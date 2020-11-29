FROM node:13-alpine as build

WORKDIR /build
COPY package.json .
COPY package-lock.json .
RUN npm install

COPY tsconfig.json .
COPY src/testing src/testing
COPY src/docs src/docs
COPY src/containers src/containers
COPY src/packages src/packages
RUN npx tsc

###################################
FROM node:13-alpine as runtime

WORKDIR /app
COPY src/containers/http/http-pg/package.json .
RUN npm i --production

COPY --from=build /build/dist/containers/http/http-pg containers/http/http-pg
COPY --from=build /build/dist/containers/http/server.js containers/http/server.js
COPY --from=build /build/dist/packages packages
CMD ["node", "containers/http/http-pg/index.js"]
