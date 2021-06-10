FROM node
ARG systemtype="consumer"
LABEL name="vue-ssr"
LABEL version="2.0"
COPY . /app
WORKDIR /app
# RUN npm install -g yarn
RUN echo "-----------${systemtype}"
RUN yarn global add pm2
RUN yarn install
RUN yarn settype -- --sys=${systemtype}
RUN yarn build:win
EXPOSE 3000
CMD  npm run server:start

