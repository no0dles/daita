FROM node:14

WORKDIR /build
COPY package.json .
COPY package-lock.json .
RUN npm install

COPY tsconfig.json .
COPY src src
RUN npm run build

FROM node:14

WORKDIR /app
RUN chown node:node -R /app

USER node
COPY package.json .
COPY package-lock.json .
RUN npm install --production && rm -rf ~/.config && rm -rf ~/.npm
COPY --from=0 /build/dist .

ENV DATABASE_URL :memory:
ENV TRANSACTION_TIMEOUT 4000
ENV PORT 3000
EXPOSE 3000/tcp

CMD ["node", "index.js"]
