FROM node:13-alpine AS api

WORKDIR /app
COPY package-lock.json .
COPY package.json .
RUN npm install

COPY tsconfig.json .
COPY src/testing src/testing
COPY src/containers src/containers
COPY src/packages src/packages
RUN npm run build

################
FROM node:14-alpine AS web

WORKDIR /build/frontends/auth
COPY src/frontends/auth/package.json .
COPY src/frontends/auth/package-lock.json .
RUN npm ci

COPY src/frontends/auth/src src
COPY src/frontends/auth/angular.json .
COPY src/frontends/auth/tsconfig.json .
COPY src/frontends/auth/webpack.config.js .
COPY src/frontends/auth/tsconfig.app.json .
COPY src/frontends/auth/tsconfig.base.json .
COPY src/frontends/auth/tailwind.config.js .

COPY src/packages/auth/models /build/packages/auth/models

RUN npx ng build --prod --base-href /admin/


###############
FROM node:13-alpine

WORKDIR /app
COPY src/containers/auth-pg/package.json .
RUN npm install --production

COPY --from=api /app/dist/containers/auth-pg containers/auth-pg
COPY --from=api /app/dist/packages packages
COPY --from=web /build/frontends/auth/dist /app/www/dist

EXPOSE 4000
EXPOSE 5000

CMD ["node", "containers/auth-pg/index.js"]
