FROM node:14-alpine

WORKDIR /usr/app

RUN npm install -g nx

COPY ["package.json", "package-lock.json", "./"]

RUN npm ci

COPY [".eslintrc.json", "babel.config.json", "jest.config.js", "jest.preset.js", "nx.json", "tsconfig.base.json", "workspace.json", "./"]

COPY ./apps/authentication/project.json ./apps/authentication/project.json
COPY ./apps/ticketing/project.json ./apps/ticketing/project.json
COPY ./apps/ticketing-e2e/project.json ./apps/ticketing-e2e/project.json

COPY ./libs ./libs

COPY ./apps/authentication ./apps/authentication

ENV PORT=3000
EXPOSE ${PORT}

CMD ["nx", "run", "authentication:serve", "--verbose"]
