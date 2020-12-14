FROM node:14-alpine as build

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
FROM node:14-alpine as runtime

WORKDIR /app
COPY src/containers/http/package.json .
ENV NODE_ENV=production
RUN npm install --production

COPY --from=build /build/dist/containers/http containers/http
COPY --from=build /build/dist/packages packages

USER node
CMD ["node", "containers/http/index.js"]
