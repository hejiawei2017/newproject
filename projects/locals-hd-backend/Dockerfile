FROM node:8.14.0

ENV TZ=Asia/Shanghai

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN  npm install --registry=https://registry.npm.taobao.org
# If you are building your code for production
# RUN npm install --only=production

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Bundle app source
COPY . .

EXPOSE 7001

CMD [ "npm", "start" ]