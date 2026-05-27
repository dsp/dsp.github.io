{ pkgs, lib, config, inputs, ... }:

{
  packages = [
    pkgs.git
    pkgs.jj
    pkgs.hugo
    pkgs.mdformat
  ];

  scripts.fmt.exec = ''
    mdformat content/**/*.md
  '';

  processes = {
    hugo.exec = "hugo server -D --navigateToChanged";
  };

  tasks = {
    "blog:fmt" = {
      exec = "mdformat content/**/*.md";
      before = [ "devenv:enterTest" ];
    };
  };

  enterShell = ''
    echo "Hugo site — $(hugo version | cut -d' ' -f1-2)"
    echo "  devenv up        — start hugo dev server"
    echo "  fmt              — format all markdown"
    echo "  hugo new posts/  — create a new post"
  '';

  enterTest = ''
    hugo --gc --minify 2>&1
  '';
}
