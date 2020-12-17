FROM node:13-alpine AS api

RUN apk update && apk add curl bash
RUN curl -sfL https://install.goreleaser.com/github.com/tj/node-prune.sh | bash -s -- -b /usr/local/bin

WORKDIR /app
COPY package-lock.json .
COPY package.json .
RUN npm ci

COPY tsconfig.json .
COPY src/containers src/containers
COPY src/packages src/packages
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
