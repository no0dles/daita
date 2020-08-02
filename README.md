<h1 align="center">
  <a href="https://daita.ch"><img src="docs/logo.svg" alt="daita" width="250"></a>
</h1>
<h2 align="center">Daita</h2>

<p align='center'>
  <img alt='build' src='https://github.com/no0dles/daita/workflows/build/badge.svg'>
  <img alt='mit' src='https://img.shields.io/badge/License-MIT-blue.svg'>
</p>

## Motivation
The daita project aims to make the development and deployment of web applications easier, faster and safer. 
Daita does this by removing the need for a backend service to access and store data.


## Documentation and examples
The Documentation and getting started guide is available [here](https://daita.ch/). 
Example projects are in the [packages/examples](./packages/examples) folder.

## Packages
A short description about the packages and their purpose.

### Core
| Package | Description | Downloads | Coverage | Status |
| --- | --- | --- | --- | --- |
| @daita/common | A set of advanced types and utility classes that a regularly used. | <img alt='npm' src='https://img.shields.io/npm/dm/@daita/common.svg'> | | beta |
| @daita/relational | SQL abstractions for accessing relational databases | <img alt='npm' src='https://img.shields.io/npm/dm/@daita/relational.svg'> | | beta |
| @daita/orm | An OR mapper which handles schema migrations for relational databases | <img alt='npm' src='https://img.shields.io/npm/dm/@daita/orm.svg'> | | alpha |
| @daita/odm | An object mapper which handles data migrations for document databases | <img alt='npm' src='https://img.shields.io/npm/dm/@daita/odm.svg'> | | - |


### Adapters
| Package | Description | Downloads | Coverage | Status |
| --- | --- | --- | --- | --- |
| @daita/pg-adapter | Postgres adapter | <img alt='npm' src='https://img.shields.io/npm/dm/@daita/pg-adapter.svg'> | | alpha |
| @daita/sqlite-adapter | Sqlite adapter | <img alt='npm' src='https://img.shields.io/npm/dm/@daita/sqlite-adapter.svg'> | | - |
| @daita/http-adapter | HTTP adapter | <img alt='npm' src='https://img.shields.io/npm/dm/@daita/http-adapter.svg'> | | alpha |
| @daita/websocket-adapter | HTTP adapter | <img alt='npm' src='https://img.shields.io/npm/dm/@daita/websocket-adapter.svg'> | | - |

### Development & Tooling

| Package | Description | Downloads | Coverage | Status |
| --- | --- | --- | --- | --- |
| @daita/create | Bootstrapping and initalizing new daita projects using `npm init @daita` or `npx @daita/create` | <img alt='npm' src='https://img.shields.io/npm/dm/@daita/create.svg'> | | alpha |
| @daita/cli | A cli used during development to generate migrations and diagrams | <img alt='npm' src='https://img.shields.io/npm/dm/@daita/cli.svg'> | | alpha |
| @daita/eslint-config | Linting rules for daita related code | <img alt='npm' src='https://img.shields.io/npm/dm/@daita/http-adapter.svg'> | | alpha |


## Contributing
As I use this for my own projects, I know this might not be the perfect approach for all the projects out there. 
If you have any ideas, just open an issue and tell me what you think.
