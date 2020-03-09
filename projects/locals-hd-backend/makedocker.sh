PRODUCT_NAME=locals_hd_backend
VERSION=latest
CONTAINER_ID=`docker ps -f name=${PRODUCT_NAME} -q`

build() {
  if [[ $CONTAINER_ID != "" ]]
  then
    docker stop $PRODUCT_NAME
    docker rm $PRODUCT_NAME
  fi

  docker build -t ${PRODUCT_NAME}:${VERSION} .
}

run() {
  build
  docker run -d -v /data:/data -p 7001:7001 --link mariadb:mysql --link redis:redis --name $PRODUCT_NAME $PRODUCT_NAME
	sleep 1
	docker ps
	docker logs $PRODUCT_NAME
}

if [[ $@ == "run" ]]
then
  run
else
  build
fi

