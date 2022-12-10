npm run build
cp -r server build
tar -czvf latest-build.tar.gz build
scp latest-build.tar.gz skylon07@thedelta.stream:server/ouroboros
rm latest-build.tar.gz

### SERVER ###
# cd server/ouroboros
# tar -xvf latest-build.tar.gz
# rmtrash latest-build.tar.gz
# mv build/* ./
# rm -d build/
