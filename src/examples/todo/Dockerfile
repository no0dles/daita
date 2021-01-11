
FROM node:13-alpine as build

WORKDIR /build/daita

COPY package.json .
COPY package-lock.json .
RUN npm ci

COPY tsconfig.json .
COPY src/packages/iwent src/packages/iwent
COPY src/packages/pg-adapter src/packages/pg-adapter
COPY src/packages/relational src/packages/relational
COPY src/packages/common src/packages/common
COPY src/packages/orm src/packages/orm
COPY src/packages/node src/packages/node
COPY src/examples/todo src/examples/todo

RUN npm run build

########################
FROM docker.pkg.github.com/no0dles/daita/iwent:latest

COPY --from=build /build/daita/dist /app/daita

ENV APP_PATH=/app/daita/examples/todo
