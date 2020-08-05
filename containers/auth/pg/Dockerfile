FROM node:13-alpine AS api

WORKDIR /app
COPY package-lock.json .
COPY package.json .
RUN npm install --registry=http://localhost:4873/

COPY tsconfig.container.json tsconfig.json
COPY src src
RUN npm run build

################
FROM node:14-alpine AS web

WORKDIR /build/www
COPY www/package.json .
COPY www/package-lock.json .
RUN npm install --registry=http://localhost:4873/

COPY www/src src
COPY www/angular.json .
COPY www/tsconfig.json .
COPY www/webpack.config.js .
COPY www/tsconfig.app.json .
COPY www/tsconfig.base.json .
COPY www/tailwind.config.js .

COPY src/models /build/src/models

RUN npm run build


###############
FROM node:13-alpine

WORKDIR /app
COPY package-lock.json .
COPY package.json .
RUN npm install --production --registry=http://localhost:4873/
RUN npm i @daita/pg-adapter --registry=http://localhost:4873/

COPY --from=api /app/dist .
COPY --from=web /build/www/dist /app/www/dist

EXPOSE 4000
EXPOSE 5000

CMD ["node", "index.js"]
