# Daita
Yet another O(R) mapper

## Motiviation
The daita project aims to make the development and deployment of applications easier and faster without sacrifising security. These goals are archived by the key features of daita.

## Key features

### Powerful cli
The @daita/cli contains a huge set of commands. 

**Generate database migrations**
Create migrations based on typescript classes. There is no need for annotations because the cli gets it‘s metadata directly from the typescript AST. This allows the cli to gather more information from less verbose code.

**Backward compatible schema**
All migrations create backward compatible data structures. Old applications will continue to work after applying breaking code changes to the database. Adding new required or renaming existing fields will not impact the previous versions of your application and only apply for the new one.

**HTTP API / Websocket Server integration**
The cli contains an integrated web server that gives access to the database over the web. This eliminates the need of an own api server and boosts productivity.

**Generate data diagramms**


### Strongly typed


### Advanced security

## Documentation and examples
The Documentation and getting started guide is available [here](https://app.gitbook.com/@no0dles/s/daita/). Example projects are in the [packages/examples](./packages/examples) folder.

## Contributing
As I use this for my own projects, I know this might not be the perfect approach for all the projects out there. If you have any ideas, just open an issue and tell me what you think.


## Open todos

- [ ] validation for update
- [ ] logging
- [ ] ast mess generation cleanup
- [ ] data type abstraction cleanup
- [ ] migration adapter abstraction
- [ ] include resolve select
- [ ] nested include and path resolve
- [ ] more tests
- [ ] test field name with underscore
- [ ] perf test for mapping of data


[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://
opensource.org/licenses/MIT)
