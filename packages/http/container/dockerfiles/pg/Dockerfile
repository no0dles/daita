FROM node:14-alpine

WORKDIR /build
COPY package-pg.json package.json
RUN npm install

COPY tsconfig.json .
COPY src/server.ts src/server.ts
COPY src/test.ts src/test.ts
COPY src/pg src/pg
RUN npm run build

##################################
FROM node:14-alpine

WORKDIR /app
RUN chown node:node -R /app

USER node
COPY package-pg.json package.json
COPY package-lock.json .
RUN npm install --production && rm -rf ~/.config && rm -rf ~/.npm
COPY --from=0 /build/dist .

ENV TRANSACTION_TIMEOUT 4000
ENV PORT 3000

EXPOSE 3000/tcp

CMD ["node", "pg/index.js"]
