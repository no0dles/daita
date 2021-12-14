FROM node:13-alpine AS api

RUN apk update && apk add curl bash
RUN curl -sfL https://install.goreleaser.com/github.com/tj/node-prune.sh | bash -s -- -b /usr/local/bin

WORKDIR /build

COPY package.json .
COPY package-lock.json .
COPY src src
RUN npm ci

WORKDIR /build/src/packages/common
RUN npm ci

WORKDIR /build/src/packages/relational
RUN npm ci

WORKDIR /build/src/packages/orm
RUN npm ci

WORKDIR /build/src/packages/auth-server
RUN npm ci

WORKDIR /build/src/packages/mariadb-adapter
RUN npm ci

WORKDIR /build/src/packages/pg-adapter
RUN npm ci

WORKDIR /build/src/packages/sqlite-adapter
RUN npm ci

WORKDIR /build/src/containers/auth
RUN npm ci
RUN npm run build

COPY src/frontends src/frontends
WORKDIR src/frontends/auth
ENV NODE_ENV production
RUN npx ng build --prod --base-href /admin/ auth

WORKDIR /app
COPY src/containers/auth/package.json .
RUN npm prune --production
RUN /usr/local/bin/node-prune

###############
FROM alpine:3.12 as runtime
WORKDIR /app

ENV NODE_ENV=production
RUN apk update && apk add --no-cache nodejs && rm -rf /var/cache/apk

COPY --from=api /app/node_modules node_modules
COPY --from=api /app/dist/containers/auth containers/auth
COPY --from=api /app/dist/packages packages
COPY --from=api /app/dist/frontends/auth /app/www
RUN mkdir /app/keys

CMD ["node", "containers/auth/index.js"]
