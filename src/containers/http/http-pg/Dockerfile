FROM node:13-alpine

WORKDIR /build
COPY package.json .
COPY package-lock.json .
RUN npm i

COPY tsconfig.json .
COPY src/types src/types
COPY src/testing src/testing
COPY src/containers src/containers
COPY src/packages src/packages
RUN npx tsc

###################################
FROM node:13-alpine

WORKDIR /app
COPY src/containers/http/http-pg/package.json .
RUN npm i --production

COPY --from=0 /build/dist/containers/http/http-pg containers/http/http-pg
COPY --from=0 /build/dist/containers/http/server.js containers/http/server.js
COPY --from=0 /build/dist/packages packages
CMD ["node", "containers/http/http-pg/index.js"]
