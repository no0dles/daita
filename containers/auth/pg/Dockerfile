FROM node:13-alpine

WORKDIR /app
COPY packages/auth/package-lock.json .
COPY packages/auth/package.json .
RUN npm install --production
RUN npm i @daita/pg-adapter

COPY packages/auth/dist .
COPY packages/auth/www/dist /app/www/dist

EXPOSE 4000
EXPOSE 5000

CMD ["node", "index.js"]
