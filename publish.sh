
echo "registry=https://registry.npmjs.org/:_authToken=$NPM_TOKEN" > $HOME/.npmrc

npm publish
