
echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" > $HOME/.npmrc

cat $HOME/.npmrc

npm publish