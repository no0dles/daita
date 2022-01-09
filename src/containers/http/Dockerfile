FROM node:16-alpine as base

WORKDIR /build
COPY package.json .
COPY package-lock.json .
RUN npm ci

###################################
FROM node:16-alpine as runetime-modules

WORKDIR /build
COPY package.json .
COPY --from=base /build/node_modules node_modules
COPY lerna.json .
COPY src/containers/ src/containers
COPY src/packages/ src/packages
COPY src/tooling/ src/tooling
RUN node_modules/.bin/lerna bootstrap -- --production

###################################
FROM node:16-alpine as build

WORKDIR /build
COPY package.json .
COPY --from=base /build/node_modules node_modules

COPY lerna.json .
COPY tsconfig.json .
COPY src/containers/ src/containers
COPY src/packages/ src/packages
COPY src/tooling/ src/tooling
RUN node_modules/.bin/lerna bootstrap

WORKDIR /build/src/containers/http
RUN npm run build

###################################
FROM alpine:3.12 as runtime
WORKDIR /app

ENV NODE_ENV=production
RUN apk update && apk add --no-cache nodejs && rm -rf /var/cache/apk

COPY --from=runetime-modules /build/src/containers src/containers
COPY --from=runetime-modules /build/src/packages src/packages
COPY --from=runetime-modules /build/src/tooling src/tooling
COPY --from=build /build/src/packages src/packages
COPY --from=build /build/src/containers src/containers

WORKDIR /app/src/containers/http
CMD ["node", "dist/index.js"]
