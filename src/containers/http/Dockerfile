FROM node:13-alpine as build

RUN apk update && apk add curl bash
RUN curl -sfL https://install.goreleaser.com/github.com/tj/node-prune.sh | bash -s -- -b /usr/local/bin

WORKDIR /build
COPY package.json .
COPY package-lock.json .
RUN npm ci

COPY tsconfig.json .
COPY src/containers/http src/containers/http
COPY src/packages/relational src/packages/relational
COPY src/packages/common src/packages/common
COPY src/packages/orm src/packages/orm
COPY src/packages/node src/packages/node
COPY src/packages/sqlite-adapter src/packages/sqlite-adapter
COPY src/packages/pg-adapter src/packages/pg-adapter
COPY src/packages/http-server-common src/packages/http-server-common
COPY src/packages/http-client-common src/packages/http-client-common
COPY src/packages/http-server src/packages/http-server
RUN npx tsc

COPY src/containers/http/package.json .
RUN npm prune --production
RUN /usr/local/bin/node-prune

###################################
FROM alpine:3.12 as runtime
WORKDIR /app

ENV NODE_ENV=production
RUN apk update && apk add --no-cache nodejs && rm -rf /var/cache/apk

COPY --from=build /build/node_modules node_modules
COPY --from=build /build/dist/containers/http containers/http
COPY --from=build /build/dist/packages packages

CMD ["node", "containers/http/index.js"]
