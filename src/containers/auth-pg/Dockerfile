FROM node:13-alpine AS api

WORKDIR /app
COPY package-lock.json .
COPY package.json .
RUN npm install

COPY tsconfig.json .
COPY src/testing src/testing
COPY src/containers src/containers
COPY src/packages src/packages
COPY src/frontends src/frontends
RUN npm run build

COPY angular.json .
COPY tsconfig.angular.json .
RUN npx ng build --prod --base-href /admin/ auth

###############
FROM node:13-alpine

WORKDIR /app
COPY src/containers/auth-pg/package.json .
RUN npm install --production

COPY --from=api /app/dist/containers/auth-pg containers/auth-pg
COPY --from=api /app/dist/packages packages
COPY --from=api /app/dist/frontends/auth /app/www/dist

EXPOSE 4000
EXPOSE 5000

CMD ["node", "containers/auth-pg/index.js"]
