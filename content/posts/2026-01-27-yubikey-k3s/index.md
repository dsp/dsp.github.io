---
title: "Fun with Yubikeys: Hardware-Backed Kubernetes Auth"
date: 2026-01-27T10:47:02Z
draft: false
tags:
  - k8s
  - security
  - yubikey
author: David Soria Parra
categories:
  - short
---

The private key that grants admin access to your Kubernetes cluster shouldn't live in `~/.kube/config`. It shouldn't live on your filesystem at all. I built a proxy that keeps my k8s client credentials locked inside a [YubiKey](https://www.yubico.com/).

**TL;DR:** If you just want the tool: [yubikey-kube-proxy](https://github.com/dsp/yubikey-kube-proxy). Read on for how it works.

# The Problem: Secrets on Disk

I'm running a single-node k3s cluster on a Hetzner root server, reachable from my laptop via [Tailscale](https://tailscale.com). The standard way to access it is to SSH to it and access it as root. However, I wanted to access it from my laptop. One way to do this is to just copy `/etc/rancher/k3s/k3s.yaml` to your laptop. It looks like this:

```yaml
apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: <SOME_VERY_LONG_BASE64_STRING>
    server: https://127.0.0.1:6443
  name: default
contexts:
- context:
    cluster: default
    user: default
  name: default
current-context: default
kind: Config
users:
- name: default
  user:
    client-certificate-data: <SOME_VERY_LONG_BASE64_STRING>
    client-key-data: <SOME_SLIGHTLY_SHORTER_BASE64_STRING>
```

That `client-key-data` is the problem. It's a plaintext private key sitting on your laptop. Anyone who gets access to your machine—malware, a stolen laptop, a curious coworker—gets admin access to your cluster.

I wanted something better: the private key should live in hardware, where it (hopefully) physically cannot be extracted.

So our plan is: 
1. Extract the certs from the config
2. Import them into the YubiKey's PIV slot 
3. Write a proxy for our Kubernetes connection that pieces the client certificate and private key together

# Extracting and Importing the Certs

First, we pull the certificates out of the kubeconfig:

```sh
# Extract client certificate
yq -r '.users[0].user."client-certificate-data"' k3s.yaml | base64 -d > client.crt

# Extract client private key
yq -r '.users[0].user."client-key-data"' k3s.yaml | base64 -d > client.key
```

Then import them into the YubiKey's PIV slot:

```sh
# Import private key to slot 9a (PIV Authentication)
# --touch-policy=never means no physical touch required (use 'always' for more security)
ykman piv keys import --touch-policy=never 9a client.key

# Import certificate to the same slot
ykman piv certificates import 9a client.crt
```

Now our certificates live on the YubiKey. Verify with `ykman`:

```sh
$ ykman piv info
PIV version:              5.1.2
PIN tries remaining:      3
Management key algorithm: TDES
CHUID: <SOMEID>
CCC:   No data available
Slot 9A (AUTHENTICATION):
  Private key type: EMPTY
  Public key type:  ECCP256
  Subject DN:       CN=system:admin,O=system:masters
  Issuer DN:        CN=k3s-client-ca@1741297299
  Serial:           2632924463644838760 (0x248a06d98ffc8b68)
  Fingerprint:      bf819a84a822bd44b905826667e09be8e2007c9c5a3f61dcd521bc74127454aa
  Not before:       2025-03-06T21:41:39+00:00
  Not after:        2026-11-13T04:42:16+00:00
```

*(The private key shows as EMPTY because YubiKey firmware doesn't expose key metadata—the key is there, just not readable.)*

**Now delete those `.key` and `.crt` files from your filesystem.** They're safely locked in hardware.

# The Proxy: Hardware-Backed TLS

Here's where it gets interesting. We can't just point kubectl at the YubiKey, as kubectl doesn't speak PIV. Instead, we build a local proxy that:

1. Reads the certificate from the YubiKey
2. Uses the YubiKey as a crypto oracle for TLS handshakes
3. Forwards requests to the real k8s API server

The magic happens through [piv-go](https://github.com/go-piv/piv-go). It implements the PIV standard and lets us use the YubiKey for signing without ever extracting the private key.

```go
// Open YubiKey
cards, err := piv.Cards()
if err != nil {
    return fmt.Errorf("failed to enumerate smart cards: %w", err)
}
if len(cards) == 0 {
    return fmt.Errorf("no YubiKey found - please insert your YubiKey")
}

yk, err := piv.Open(cards[0])
if err != nil {
    return fmt.Errorf("failed to open YubiKey: %w", err)
}
defer yk.Close()

// Get certificate from YubiKey slot 9a
cert, err := yk.Certificate(piv.SlotAuthentication)
if err != nil {
    return fmt.Errorf("failed to get certificate from YubiKey: %w", err)
}

// Get private key handle - the key never leaves the YubiKey
priv, err := yk.PrivateKey(piv.SlotAuthentication, cert.PublicKey, piv.KeyAuth{
    PINPolicy: piv.PINPolicyNever,
})
if err != nil {
    return fmt.Errorf("failed to get private key handle: %w", err)
}
```

The `priv` object isn't the actual private key—it's a handle that delegates signing operations to the YubiKey hardware. When we pass this to Go's TLS stack, every TLS handshake makes the YubiKey perform the cryptographic operation.

The proxy itself is a standard `httputil.ReverseProxy` with our YubiKey-backed TLS config:

```go
// Create TLS config with YubiKey-backed client certificate
tlsConfig := &tls.Config{
    MinVersion: tls.VersionTLS12,
    Certificates: []tls.Certificate{
        {
            Certificate: [][]byte{cert.Raw},
            PrivateKey:  priv, // This is the YubiKey handle
        },
    },
    RootCAs: caCertPool, // The k8s CA from our kubeconfig
}

// Create reverse proxy
proxy := httputil.NewSingleHostReverseProxy(serverURL)
proxy.Transport = &http.Transport{
    TLSClientConfig: tlsConfig,
    // Disable keep-alives to force new TLS handshake per request.
    // Removing the YubiKey immediately stops further requests.
    DisableKeepAlives: true,
}

// Start server on localhost only
return http.ListenAndServe("localhost:8080", proxy)
```

## Security Model

The proxy binds to localhost only—no authentication on the proxy itself because only local processes can reach it. This trades network-level authentication for physical possession of the YubiKey.

Of course, this is not perfectly safe. A few limitations:
- Malware on your machine could use the proxy while the YubiKey is inserted, but at least it can't exfiltrate the key for later use.
- The YubiKey can be configured to require touch for each signing operation, adding physical presence verification per-request. The default setup uses `--touch-policy=never` for convenience; use `ykman piv keys import --touch-policy=always 9a client.key` if you want touch required. Note that touch policy won't work easily with a systemd unit.

# Running It

We need two kubeconfig files. First, one for kubectl that points to our local proxy:

```yaml
# client.yml
apiVersion: v1
kind: Config
clusters:
- cluster:
    server: http://localhost:8080
  name: k3s-yubikey-proxy
contexts:
- context:
    cluster: k3s-yubikey-proxy
  name: k3s-yubikey
current-context: k3s-yubikey
```

Second, one for the proxy itself with the server address and CA (but no client credentials):

```yaml
# proxy.yml
apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: <THE_CA_CERT>
    server: https://my-server.tailnet:6443
  name: default
contexts:
- context:
    cluster: default
  name: default
current-context: default
```

To run as a systemd user service:

```ini
# ~/.config/systemd/user/yubikey-kube-proxy.service
[Unit]
Description=YubiKey Kubernetes Proxy
After=pcscd.service

[Service]
Type=simple
ExecStart=/path/to/yubikey-kube-proxy proxy --kubeconfig=%h/.kube/proxy.yml
Restart=on-failure
RestartSec=5

[Install]
WantedBy=default.target
```

Enable and start:

```sh
systemctl --user daemon-reload
systemctl --user enable --now yubikey-kube-proxy
```

Moment of truth:

```sh
$ export KUBECONFIG=~/.kube/client.yml
$ kubectl get nodes
NAME         STATUS   ROLES                  AGE    VERSION
my-server    Ready    control-plane,master   326d   v1.34.3+k3s1
```

Without the YubiKey, the proxy won't even start:

```sh
$ yubikey-kube-proxy proxy --kubeconfig=~/.kube/proxy.yml
Error: no YubiKey found - please insert your YubiKey
```

And kubectl fails to connect:

```sh
$ kubectl get nodes
The connection to the server localhost:8080 was refused - did you specify the right host or port?
```

Insert the key, start the proxy, and we're in. The private key that grants admin access never touches the laptop's filesystem.

# The Package

I've wrapped all of this into [yubikey-kube-proxy](https://github.com/dsp/yubikey-kube-proxy). It handles certificate extraction, YubiKey import, and kubeconfig generation automatically.

For NixOS users:

```nix
# flake.nix
{
  inputs.yubikey-kube-proxy.url = "github:dsp/yubikey-kube-proxy";
}

# configuration.nix
{ inputs, ... }: {
  imports = [ inputs.yubikey-kube-proxy.nixosModules.default ];
  programs.yubikey-kube-proxy.enable = true;
}
```

This automatically enables `pcscd` (the PC/SC daemon needed for smartcard access).

Setup is one command:

```sh
# Extract certs from existing kubeconfig and import to YubiKey
yubikey-kube-proxy setup \
  --kubeconfig=/etc/rancher/k3s/k3s.yaml \
  --context=default

# Creates:
#   proxy.yml  - server + CA for the proxy
#   client.yml - points kubectl to localhost:8080
```

Then start the proxy and use kubectl as shown above. The tool supports all four PIV slots (9a, 9c, 9d, 9e) if you want to keep different cluster credentials separate.

---

## References

- [go-piv/piv-go](https://github.com/go-piv/piv-go) - PIV smartcard interface for Go
- [Yubico PIV Tool](https://developers.yubico.com/yubico-piv-tool/) - PIV documentation
- [k8s client-go](https://github.com/kubernetes/client-go) - Kubernetes Go client library
- [Tailscale](https://tailscale.com) - Zero-config VPN
