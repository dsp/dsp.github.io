set -x
set -e

tree_id = awk '{print $3}' <(git ls-tree master -- public)
git checkout --recurse-submodule gh-pages
git read-tree -m -u $tree_id
git commit -m'autodeploy'
