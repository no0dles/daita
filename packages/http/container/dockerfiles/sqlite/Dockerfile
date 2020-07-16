FROM node:14

WORKDIR /build
COPY package-sqlite.json package.json
COPY package-lock.json .
RUN npm install

COPY tsconfig.json .
COPY src/server.ts src/server.ts
COPY src/sqlite src/sqlite
RUN npm run build

##################################
FROM node:14

WORKDIR /app
RUN chown node:node -R /app

USER node
COPY package-sqlite.json package.json
COPY package-lock.json .
RUN npm install --production && rm -rf ~/.config && rm -rf ~/.npm
COPY --from=0 /build/dist .

ENV TRANSACTION_TIMEOUT 4000
ENV PORT 3000

EXPOSE 3000/tcp

CMD ["node", "sqlite/index.js"]
