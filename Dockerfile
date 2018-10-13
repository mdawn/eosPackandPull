FROM node:latest

RUN mkdir -p /usr/app
WORKDIR /usr/app

COPY . /usr/app

EXPOSE 4000

CMD npm install; node app.js
