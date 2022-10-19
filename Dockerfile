FROM node:16-buster-slim
RUN apt update && apt upgrade -y
COPY . /tgbot
WORKDIR /tgbot
RUN yarn install
RUN yarn build
RUN rm -rf src
CMD yarn start