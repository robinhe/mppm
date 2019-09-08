
echo "registry=https://registry.npmjs.org/:_authToken=$NPM_TOKEN" > $HOME/.npmrc

cat $HOME/.npmrc

yarn publish