FROM node:14

WORKDIR /build
COPY package.json .
COPY package-lock.json .
RUN npm ci

COPY tsconfig.container.json tsconfig.json
COPY src src
RUN npm run build

FROM node:14-alpine

WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm ci --production
COPY --from=0 /build/dist .

CMD ["node", "server.js"]
