commit 151a1c80958f186d1b30ddfc26acb178c836cbfe
Author: David Soria Parra <dsp@experimentalworks.net>
Date:   Tue Dec 24 23:47:15 2019 -0800

    deploy script

diff --git a/deploy.sh b/deploy.sh
new file mode 100644
index 0000000..92e1cef
--- /dev/null
+++ b/deploy.sh
@@ -0,0 +1,5 @@
+set -x
+set -e
+
+tree_id = awk '{print $3}' <(git ls-tree master -- public)
+
