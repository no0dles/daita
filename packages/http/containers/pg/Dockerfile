FROM node:14-alpine

WORKDIR /build
COPY package.json .
COPY package-lock.json .
RUN npm ci

COPY tsconfig.json .
COPY src src
RUN npm run build

FROM node:14-alpine

WORKDIR /app
RUN chown node:node -R /app

USER node
COPY package.json .
COPY package-lock.json .
RUN npm ci --production && rm -rf ~/.config && rm -rf ~/.npm
COPY --from=0 /build/dist .

ENV DATABASE_URL postgres://postgres:postgres@database/db
ENV TRANSACTION_TIMEOUT 4000
ENV PORT 3000
EXPOSE 3000/tcp

CMD ["node", "index.js"]
