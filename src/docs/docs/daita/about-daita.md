---
id: about-daita
title: About daita
sidebar_label: About daita
---

## Introduction

Daita is a set of tools to store and access data in typescript. 
Each of which adds functionality and tries to make your application simpler. 

There is the [relational](/docs/@daita/relational) package that contains all the standard sql syntax and a common interface that each database provider has to provide.

There is the [orm](/docs/@daita/orm) package that contains logic for generating and applying sql migrations with support for schemas, tables, indices and views. 
While being able to define permissions and ensure access controls.

There is the [cli](/docs/@daita/cli) package which provides tooling for your source code repository. 
It should help you to set up new projects or integrate daita into existing ones, generate orm migrations based on source code as well as applying and undoing those on databases. 

There is the [pg-adapter](/docs/@daita/pg-adapter) package that adds support for postgres databases. 
Including postgres specific sql syntax.

There is the [sqlite-adapter](/docs/@daita/sqlite-adapter) package that adds support for sqlite databases.

There is the [http-adapter](/docs/@daita/http-adapter) package that allows access to databases like postgres or sqlite over the web. 


_\* Currently only relational databases are supported yet, but key-value, document and column databases are on the [roadmap](/docs/daita/roadmap)_ 
