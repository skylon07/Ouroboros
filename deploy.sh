npm run build
mv build latest-build
cp -r server latest-build
tar -czvf latest-build.tar.gz latest-build
scp latest-build.tar.gz skylon07@thedelta.stream:server/ouroboros
rm latest-build.tar.gz

# on server
# cd server/ouroboros
# tar -xvf latest-build.tar.gz 
# rmtrash latest-build.tar.gz
