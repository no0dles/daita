<h1 align="center">
  <a href="https://daita.ch"><img src="docs/logo.png" alt="daita" width="250"></a>
</h1>

<p align='center'>
  <a href="https://drone.bertschi.io/no0dles/daita"><img alt='build' src='https://drone.bertschi.io/api/badges/no0dles/daita/status.svg'></a>
  <img alt='npm' src='https://img.shields.io/npm/dm/@daita/common.svg'>
  <img alt='mit' src='https://img.shields.io/badge/License-MIT-blue.svg'>
</p>

## Motivation
The daita project aims to make the development and deployment of applications easier and faster without sacrifising security. 
These goals are archived by the key features of daita.

## Documentation and examples
The Documentation and getting started guide is available [here](https://daita.ch/). 
Example projects are in the [packages/examples](./packages/examples) folder.

## Key features

### Powerful cli
The @daita/cli contains a huge set of commands. 

**Generate database migrations**
Create migrations based on typescript classes. 
There is no need for annotations because the cli gets it‘s metadata directly from the typescript AST. 
This allows the cli to gather more information from less verbose code.

**Backward compatible schema**
All migrations create backward compatible data structures. 
Old applications will continue to work after applying breaking code changes to the database. 
Adding new required or renaming existing fields will not impact the previous versions of your application and only apply for the new one.

**HTTP API / Websocket Server integration**
The cli contains an integrated web server that gives access to the database over the web. 
This eliminates the need of an own api server and boosts productivity.

**Generate Diagrams**
An integrated diagram generator helps to keep the documentation always up to date. 
This helps others getting into the project faster. 

### Strongly typed


### Advanced security

## Contributing
As I use this for my own projects, I know this might not be the perfect approach for all the projects out there. 
If you have any ideas, just open an issue and tell me what you think.

## Roadmap

- [ ] validation for update
- [ ] logging
- [ ] data type abstraction cleanup
- [ ] more tests
- [ ] test field name with underscore
- [ ] perf test for mapping of data

