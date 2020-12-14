FROM node:13-alpine AS api

WORKDIR /app
COPY package-lock.json .
COPY package.json .
RUN npm ci

COPY tsconfig.json .
COPY src/testing src/testing
COPY src/docs src/docs
COPY src/containers src/containers
COPY src/packages src/packages
COPY src/examples src/examples
COPY src/frontends src/frontends
RUN npm run build

WORKDIR src/frontends/auth
ENV NODE_ENV production
RUN npx ng build --prod --base-href /admin/ auth

###############
FROM node:13-alpine

ENV NODE_ENV=production

WORKDIR /app
COPY src/containers/auth/package.json .
RUN npm install --production

COPY --from=api /app/dist/containers/auth containers/auth
COPY --from=api /app/dist/packages packages
COPY --from=api /app/dist/frontends/auth /app/www
RUN mkdir /app/keys && chown node:node /app/keys

USER node
CMD ["node", "containers/auth/index.js"]
