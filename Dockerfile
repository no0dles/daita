FROM node:13-alpine

WORKDIR /build
COPY package.json .
COPY package-lock.json .
RUN npm install

COPY packages/common/package.json packages/common/package.json
COPY packages/common/package-lock.json packages/common/package-lock.json
COPY packages/common/dist/package.json packages/common/dist/package.json

COPY packages/relational/package.json packages/relational/package.json
COPY packages/relational/package-lock.json packages/relational/package-lock.json
COPY packages/relational/dist/package.json packages/relational/dist/package.json

COPY packages/eslint-config/package.json packages/eslint-config/package.json
COPY packages/eslint-config/package-lock.json packages/eslint-config/package-lock.json
COPY packages/eslint-config/dist/package.json packages/eslint-config/dist/package.json

COPY packages/cli/package.json packages/cli/package.json
COPY packages/cli/package-lock.json packages/cli/package-lock.json
COPY packages/cli/dist/package.json packages/cli/dist/package.json

COPY packages/auth/package.json packages/auth/package.json
COPY packages/auth/package-lock.json packages/auth/package-lock.json

COPY packages/orm/package.json packages/orm/package.json
COPY packages/orm/package-lock.json packages/orm/package-lock.json
COPY packages/orm/dist/package.json packages/orm/dist/package.json

COPY packages/pg-adapter/package.json packages/pg-adapter/package.json
COPY packages/pg-adapter/package-lock.json packages/pg-adapter/package-lock.json
COPY packages/pg-adapter/dist/package.json packages/pg-adapter/dist/package.json

COPY packages/sqlite-adapter/package.json packages/sqlite-adapter/package.json
COPY packages/sqlite-adapter/package-lock.json packages/sqlite-adapter/package-lock.json
COPY packages/sqlite-adapter/dist/package.json packages/sqlite-adapter/dist/package.json

COPY packages/internal/relational-test/package.json packages/internal/relational-test/package.json
COPY packages/internal/relational-test/package-lock.json packages/internal/relational-test/package-lock.json


COPY packages/http/http-adapter/package.json packages/http/http-adapter/package.json
COPY packages/http/http-adapter/package-lock.json packages/http/http-adapter/package-lock.json
COPY packages/http/http-adapter/dist/package.json packages/http/http-adapter/dist/package.json

COPY packages/http/http-server/package.json packages/http/http-server/package.json
COPY packages/http/http-server/package-lock.json packages/http/http-server/package-lock.json
COPY packages/http/http-server/dist/package.json packages/http/http-server/dist/package.json

COPY packages/http/http-client-common/package.json packages/http/http-client-common/package.json
COPY packages/http/http-client-common/package-lock.json packages/http/http-client-common/package-lock.json
COPY packages/http/http-client-common/dist/package.json packages/http/http-client-common/dist/package.json

COPY packages/http/http-server-common/package.json packages/http/http-server-common/package.json
COPY packages/http/http-server-common/package-lock.json packages/http/http-server-common/package-lock.json
COPY packages/http/http-server-common/dist/package.json packages/http/http-server-common/dist/package.json

COPY lerna.json .
RUN npx lerna bootstrap

COPY packages/auth/tsconfig.json packages/auth/tsconfig.json
COPY packages/relational/tsconfig.json packages/relational/tsconfig.json
COPY packages/pg-adapter/tsconfig.json packages/pg-adapter/tsconfig.json
COPY packages/orm/tsconfig.json packages/orm/tsconfig.json
COPY packages/cli/tsconfig.json packages/cli/tsconfig.json
COPY packages/create/tsconfig.json packages/create/tsconfig.json
COPY packages/common/tsconfig.json packages/common/tsconfig.json
COPY packages/internal/relational-test/tsconfig.json packages/internal/relational-test/tsconfig.json
COPY packages/eslint-config/tsconfig.json packages/eslint-config/tsconfig.json
COPY packages/sqlite-adapter/tsconfig.json packages/sqlite-adapter/tsconfig.json
COPY packages/http/tsconfig.json packages/http/tsconfig.json
COPY packages/http/http-client-common/tsconfig.json packages/http/http-client-common/tsconfig.json
COPY packages/http/http-server-common/tsconfig.json packages/http/http-server-common/tsconfig.json
COPY packages/http/http-server/tsconfig.json packages/http/http-server/tsconfig.json
COPY packages/http/http-adapter/tsconfig.json packages/http/http-adapter/tsconfig.json
COPY tsconfig.json .
COPY tsconfig.base.json .

COPY packages/auth/src packages/auth/src
COPY packages/relational/src packages/relational/src
COPY packages/pg-adapter/src packages/pg-adapter/src
COPY packages/orm/src packages/orm/src
COPY packages/cli/src packages/cli/src
COPY packages/create/src packages/create/src
COPY packages/common/src packages/common/src
COPY packages/http/http-adapter/src packages/http/http-adapter/src
COPY packages/http/http-server/src packages/http/http-server/src
COPY packages/http/http-client-common/src packages/http/http-client-common/src
COPY packages/http/http-server-common/src packages/http/http-server-common/src
COPY packages/internal/relational-test/src packages/internal/relational-test/src
COPY packages/eslint-config/src packages/eslint-config/src
COPY packages/sqlite-adapter/src packages/sqlite-adapter/src

WORKDIR /build/packages/common
RUN npm run build

WORKDIR /build/packages/relational
RUN npm run build

WORKDIR /build/packages/eslint-config
RUN npm run build

WORKDIR /build/packages/pg-adapter
RUN npm run build

WORKDIR /build/packages/sqlite-adapter
RUN npm run build

WORKDIR /build/packages/http/http-client-common
RUN npm run build

WORKDIR /build/packages/http/http-adapter
RUN npm run build

WORKDIR /build/packages/http/http-server-common
RUN npm run build

WORKDIR /build/packages/http/http-server
RUN npm run build

WORKDIR /build/packages/orm
RUN npm run build

WORKDIR /build/packages/cli
RUN npm run build

WORKDIR /build/packages/auth
RUN npm run build
