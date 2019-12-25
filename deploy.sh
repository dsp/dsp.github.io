set -x
set -e

# we are deploying from dev to master
tree_id=$(awk '{print $3}' <(git ls-tree dev -- public))
git checkout --recurse-submodule master
git read-tree -m -u $tree_id
git commit -m'autodeploy'
