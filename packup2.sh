PACKAGE_NAME="com.tenderer.exam"
echo start
rm -f com.tenderer.exam.cap
rm target.tar.gz
tar -czvf target.tar.gz ./build ./src ./static ./Dockerfile ./package-lock.json ./package.json ./tsconfig.json
sshpass -f $HOME/ssh/gh/pass4.txt scp ./target.tar.gz root@1.14.126.27:/home/root/code/wps
# sshpass -f $HOME/ssh/gh/pass4.txt scp -r ./src root@1.14.126.27:/home/root/code/wps
# sshpass -f $HOME/ssh/gh/pass4.txt scp -r ./static root@1.14.126.27:/home/root/code/wps
# sshpass -f $HOME/ssh/gh/pass4.txt scp -r ./Dockerfile root@1.14.126.27:/home/root/code/wps
# sshpass -f $HOME/ssh/gh/pass4.txt scp -r ./Makefile root@1.14.126.27:/home/root/code/wps
# sshpass -f $HOME/ssh/gh/pass4.txt scp -r ./package-lock.json root@1.14.126.27:/home/root/code/wps
# sshpass -f $HOME/ssh/gh/pass4.txt scp -r ./package.json root@1.14.126.27:/home/root/code/wps
# sshpass -f $HOME/ssh/gh/pass4.txt scp -r ./tsconfig.json root@1.14.126.27:/home/root/code/wps
sshpass -f $HOME/ssh/gh/pass4.txt ssh root@1.14.126.27 -p 22 <<`EOF`
PACKAGE_NAME="com.tenderer.exam"
IMAGE_NAME="service-${PACKAGE_NAME}"
VERSION="1.0.0"
DOCKER_IMAGE_NAME="wpsproject1"
cd /home/root/code/wps
tar -xzvf target.tar.gz
npm install
npm run build
# # sudo docker rmi ${IMAGE_NAME}:${VERSION}
sudo docker build -t ${DOCKER_IMAGE_NAME}:${VERSION} .
sudo docker save -o ./build/__ca-builder/${IMAGE_NAME}-${VERSION} ${DOCKER_IMAGE_NAME}:${VERSION}
cd build/__ca-builder && sudo zip ../components/${PACKAGE_NAME}.ca meta.json ${IMAGE_NAME}-${VERSION} && cd -
cd build && sudo zip -r ${PACKAGE_NAME}.cap licenceMap.json manifest.json components META && cd -
echo "done"
`EOF`
sshpass -f $HOME/ssh/gh/pass4.txt scp root@1.14.126.27:/home/root/code/wps/build/${PACKAGE_NAME}.cap ./