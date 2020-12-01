


# 系统部署流程

## 概述

在ubuntu 18.6配置nodejs app docker, mongo docker以及nginx reversion proxy
以kwpolish为例子进行配置

## 创建Dockerfile

```dockerfile
# Specifies where to get the base image (Node v12 in our case) and creates a new container for it
FROM node:12

RUN mkdir -p /usr/src/kwpolish
# Set working directory. Paths will be relative this WORKDIR.
WORKDIR /usr/src/kwpolish

# Install dependencies
COPY package.json /usr/src/kwpolish/
RUN npm install

# Copy source files from host computer to the container
COPY . /usr/src/kwpolish

# Specify port app runs on
EXPOSE 3000

# Run the app
CMD [ "npm", "start" ]

#To build the docker image
#docker build [username]/[tag] [dockerfile location]
#docker build -t szsong100/kwpolish:v1 .
#docker run -d -p 3333:3000 szsong100/kwpolish:v1
```

## 创建docker-compose.yml 文件

```dockerfile
version: '3'
services:
  # defining a service called kwpolish
  app:
    #adding a container name for the app service as giving the container 
    container_name: kwpolish
    # instrctings Docker to restart the container automatically if it fails
    restart: always
    #buiding the app image using the Dockfile in the current directory
    build: .
    #mapping the host port to the container post
    ports:
      - "3000:3000"
    links:
      - mongo
  mongo:
    container_name: mongo
    image: mongo
    volumes:
      - ./data:/data/db
    ports:
      - "27017:27017"
      # run cmd 
      #docker-compose build
      #docker-compose up
```

## Build

```bash
docker-compose build
docker-compose up
```

## Install nginx

```base
vim /etc/nginx/sites-enabled/default
server {
    listen 80;
    location / {
    proxy_set_header X-Real-IP
    $remote_addr;
    proxy_set_header
    X-Forwarded-For
    $proxy_add_x_forwarded_for;
    proxy_set_header Host
    $http_host;
    proxy_set_header
    X-NginX-Proxy true; proxy_pass
    http://127.0.0.1:3000/;
    proxy_redirect off;
    proxy_http_version 1.1;
    proxy_set_header Upgrade
    $http_upgrade;
    proxy_set_header Connection
    "upgrade";
    proxy_redirect off;
    proxy_set_header
    X-Forwarded-Proto $scheme;
  }
}

systemctl restart nginx

```

## 还原数据库

### 拷贝本地文件到mongo docker container

```bash
#copy db.bak下的所有文件到容器名称为"mongo"的目录/data/dbbak
docker cp ./db.bak/. mongo:/data/dbbak
```

### 打开mongo容器shell查看文件是否cp成功

```bash
#mongo为容器名称
docker exec -it mongo bash
mongorestore -d kwPolish /data/dbbak/kwPolish --drop
```

## vim 清除文件内容命令

```bash
:1,$d
```

## 其他

```bash

#update column
db.getCollection('keywords').update({'status':{$exists:false}},{$set:{'status':1}},{multi:true})

//run
forever start ./server.js
forever stopall

//git
git reset --hard
git pull

//mongodb backup and restore
For lazy people like me, i use mongodump it's faster:

mongodump -d <database_name> -o <directory_backup>
And to "restore/import" that, i used (from directory_backup/dump/):

mongorestore -d <database_name> <directory_backup>
```
