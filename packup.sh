PACKAGE_NAME="com.tenderer.exam"

rm -f com.tenderer.exam.cap
echo start
sshpass -f $HOME/ssh/gh/pass2.txt scp -r ./build  ghgame@192.168.1.131:/home/ghgame/code/wps
sshpass -f $HOME/ssh/gh/pass2.txt scp -r ./src ghgame@192.168.1.131:/home/ghgame/code/wps
sshpass -f $HOME/ssh/gh/pass2.txt scp -r ./static ghgame@192.168.1.131:/home/ghgame/code/wps
sshpass -f $HOME/ssh/gh/pass2.txt scp -r ./Dockerfile ghgame@192.168.1.131:/home/ghgame/code/wps
sshpass -f $HOME/ssh/gh/pass2.txt scp -r ./Makefile ghgame@192.168.1.131:/home/ghgame/code/wps
sshpass -f $HOME/ssh/gh/pass2.txt scp -r ./package-lock.json ghgame@192.168.1.131:/home/ghgame/code/wps
sshpass -f $HOME/ssh/gh/pass2.txt scp -r ./package.json ghgame@192.168.1.131:/home/ghgame/code/wps
sshpass -f $HOME/ssh/gh/pass2.txt scp -r ./tsconfig.json ghgame@192.168.1.131:/home/ghgame/code/wps
sshpass -f $HOME/ssh/gh/pass2.txt ssh ghgame@192.168.1.131 -p 22 <<`EOF`
PACKAGE_NAME="com.tenderer.exam"
IMAGE_NAME="service-${PACKAGE_NAME}"
VERSION="1.0.0"
DOCKER_IMAGE_NAME="wpsproject1"
cd /home/ghgame/code/wps
npm install
npm run build
# sudo docker rmi ${IMAGE_NAME}:${VERSION}
sudo docker build -t ${DOCKER_IMAGE_NAME}:${VERSION} .
sudo docker save -o ./build/__ca-builder/${IMAGE_NAME}-${VERSION} ${DOCKER_IMAGE_NAME}:${VERSION}
cd build/__ca-builder && sudo zip ../components/${PACKAGE_NAME}.ca meta.json ${IMAGE_NAME}-${VERSION} && cd -
cd build && sudo zip -r ${PACKAGE_NAME}.cap licenceMap.json manifest.json components META && cd -
echo "done"
`EOF`
sshpass -f $HOME/ssh/gh/pass2.txt scp ghgame@192.168.1.131:/home/ghgame/code/wps/build/${PACKAGE_NAME}.cap ./