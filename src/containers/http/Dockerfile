FROM node:13-alpine as build

WORKDIR /build
COPY package.json .
COPY package-lock.json .
RUN npm ci

COPY tsconfig.json .
COPY src/testing src/testing
COPY src/containers src/containers
COPY src/examples src/examples
COPY src/packages src/packages
RUN npx tsc

###################################
FROM node:13-alpine as runtime

WORKDIR /app
COPY src/containers/http/package.json .
RUN npm install --production

COPY --from=build /build/dist/containers/http containers/http
COPY --from=build /build/dist/packages packages
CMD ["node", "containers/http/index.js"]
