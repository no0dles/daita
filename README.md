<h1 align="center">
  <a href="https://daita.ch"><img src="assets/logo.svg" alt="daita" width="250"></a>
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
The Documentation and getting started guide is available at [docs.daita.ch](https://docs.daita.ch/). 
There is also an example project located in the [src/examples](./src/examples) folder.

## Why use daita

<table>
	<colgroup>
		<col width="50%">
		<col width="50%">
	</colgroup>
	<tr>
	<td align=right>
    <img alt="productivity" src="assets/undraw_dev_productivity_umsq.svg" />
    </td>
    <td>
    Daita lets you focus on your business, and we'll do the chores. Go
    ahead check out our demos and docs.
    </td>
  </tr>   
  <tr>
  	<td align=right>Daita was designed from the ground up to be as lightweight as possible
    and have a minimum of external dependencies.</td>
    <td>
    <img alt="fast" src="assets/undraw_fast_loading_0lbh.svg" />
    </td>
  </tr> 
  <tr>
  	<td align=right><img alt="fast" src="assets/undraw_fixing_bugs_w7gi.svg" /></td>
  	<td>Catch errors early during compile time, but keep flexibility without adding more build tools.
    Everything works with plain typescript and requires no additional build steps.</td>
  </tr>
  <tr>
  	<td align=right>Take more control over the way it's allowed to execute a query and which data can be accessed.</td>
  	<td><img alt="fast" src="assets/undraw_security_o890.svg" /></td>
  </tr>
  <tr>
  	<td align=right><img alt="powerfull" src="assets/undraw_programming_2svr.svg"/></td>
  	<td>
Take advantage of the complete set of SQL capabilities with additional type checks and linting rules.</td>
  </tr>
  <tr>
  	<td align=right>Generate sql migrations with the powerfull daita cli with support for backward compatible schema changes.</td>
  	<td><img alt="fast" src="assets/undraw_hacker_mindset_gjwq.svg" /></td>
  </tr>
</table>


## How does it work?

### Usual architecture
<img alt='legacy architecture' src='./assets/legacy-architecture.png' />

### Daita architecture
<img alt='daita architecture' src='./assets/daita-architecture.png' />



### Packages
| Package | Description | Downloads | Coverage | Status |
| --- | --- | --- | --- | --- |
| @daita/relational | SQL abstractions for accessing relational databases | <img alt='npm' src='https://img.shields.io/npm/dm/@daita/relational.svg'> | | beta |
| @daita/orm | An OR mapper which handles schema migrations for relational databases | <img alt='npm' src='https://img.shields.io/npm/dm/@daita/orm.svg'> | | alpha |

### Adapters
| Package | Description | Downloads | Coverage | Status |
| --- | --- | --- | --- | --- |
| @daita/pg-adapter | Postgres adapter | <img alt='npm' src='https://img.shields.io/npm/dm/@daita/pg-adapter.svg'> | | alpha |
| @daita/sqlite-adapter | Sqlite adapter | <img alt='npm' src='https://img.shields.io/npm/dm/@daita/sqlite-adapter.svg'> | | - |
| @daita/http-adapter | HTTP adapter | <img alt='npm' src='https://img.shields.io/npm/dm/@daita/http-adapter.svg'> | | alpha |

### Development & Tooling

| Package | Description | Downloads | Coverage | Status |
| --- | --- | --- | --- | --- |
| @daita/create | Bootstrapping and initalizing new daita projects using `npm init @daita` or `npx @daita/create` | <img alt='npm' src='https://img.shields.io/npm/dm/@daita/create.svg'> | | alpha |
| @daita/cli | A cli used during development to generate migrations and diagrams | <img alt='npm' src='https://img.shields.io/npm/dm/@daita/cli.svg'> | | alpha |
| @daita/eslint-config | Linting rules for daita related code | <img alt='npm' src='https://img.shields.io/npm/dm/@daita/http-adapter.svg'> | | alpha |
