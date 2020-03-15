---
id: about-daita
title: About daita
sidebar_label: About daita
---

## TL;DR

## Introduction

Daita is backward compatible ORM for relational and document databases.

## Design goals

## Features

### Backward compatible
Daita generates migrations based on the defined models in your source code. As in other ORM frameworks those migrations can be applied to a database to modify your data structure. The difference is that with the daita tooling the modifications are backward compatible to your last migrations. This means your old version of your application can run side to side with your new version. This should make zero downtime and canary deployments easy and straight forward for everyone.


### Compile safe
100% compile safe data handling

### Cli
Cli to managing migrations


### api backend
Api to serve data without a backend