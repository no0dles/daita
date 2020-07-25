FROM node:13-alpine AS api

WORKDIR /app
COPY package-lock.json .
COPY package.json .
RUN npm install

COPY tsconfig.json .
COPY src src
RUN npm run build

################

FROM node:14-alpine AS web

WORKDIR /build
COPY www/package.json .
COPY www/package-lock.json .
RUN npm install

COPY www/src src
COPY www/angular.json .
COPY www/tsconfig.json .
COPY www/webpack.config.js .
COPY www/tsconfig.app.json .
COPY www/tailwind.config.js .

RUN npm run build

################

FROM node:13-alpine

WORKDIR /app
COPY package-lock.json .
COPY package.json .
RUN npm install --production

COPY --from=api /app/dist .
COPY --from=web /build/dist www/dist

EXPOSE 4000
EXPOSE 5000

CMD ["node", ""]
