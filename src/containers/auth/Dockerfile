###################################
FROM node:20 as runetime-modules

WORKDIR /build
COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .
COPY src/containers/ src/containers
COPY src/packages/ src/packages
COPY src/tooling/ src/tooling
COPY src/frontends/ src/frontends
RUN npm ci

WORKDIR /build/src/containers/auth
RUN npx tsc -b

WORKDIR /build/src/frontends
ENV NODE_ENV production
RUN npx ng build auth --configuration production --base-href /admin/

###################################
FROM alpine:3.19 as runtime
WORKDIR /app

ENV NODE_ENV=production
RUN apk update && apk add --no-cache nodejs && rm -rf /var/cache/apk

COPY --from=runetime-modules /build/src/containers src/containers
COPY --from=runetime-modules /build/src/packages src/packages
COPY --from=runetime-modules /build/src/tooling src/tooling
COPY --from=runetime-modules /build/src/packages src/packages
COPY --from=runetime-modules /build/src/containers src/containers
COPY --from=runetime-modules /build/src/frontends/dist/auth /app/src/containers/auth/www

WORKDIR /app/src/containers/auth
CMD ["node", "dist/index.js"]
