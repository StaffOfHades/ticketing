FROM node:16-alpine

WORKDIR /usr/app

COPY ./dist/apps/tickets-service/package.json ./

RUN npm install --production
RUN npm install tslib

COPY ./dist/apps/tickets-service ./

ENV PORT=3333
EXPOSE ${PORT}

USER node

CMD ["node", "./main.js"]
