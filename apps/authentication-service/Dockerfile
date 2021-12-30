FROM node:16-alpine

WORKDIR /usr/app

COPY ./dist/apps/authentication-service/package.json ./

RUN npm install --production
RUN npm install tslib

COPY ./dist/apps/authentication-service ./

ENV PORT=3000
EXPOSE ${PORT}

USER node

CMD ["node", "./main.js"]
