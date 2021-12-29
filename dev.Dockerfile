FROM node:14-alpine

WORKDIR /usr/app

RUN npm install -g nx

COPY ["package.json", "package-lock.json", "./"]

RUN npm ci

COPY [".eslintrc.json", "babel.config.json", "jest.config.js", "jest.preset.js", "nx.json", "tsconfig.base.json", "workspace.json", "./"]

COPY ./apps ./apps/
COPY ./libs ./libs

EXPOSE 3000
EXPOSE 4200

CMD ["nx", "run-many", "--target=serve", "--all", "--verbose"]
