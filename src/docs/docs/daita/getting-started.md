---
id: getting-started
title: Getting started
sidebar_label: Getting started
---


```
npm init @daita
```


## setup schema / model

create your first model

``src/models/mountain.ts``
```typescript
export class Mountain {
  name!: string
  height!: number
  firstAscent!: Date
}
``` 


add your model to the schema

``src/schema.ts``
```typescript
import {RelationalSchema} from '@daita/orm'; 
import { Mountain } from './models/mountain';

export const schema = new RelationalSchema();
schema.table(Mountain);
``` 


create a migration for your schema changes
```shell script
npx daita migration:add initial
```



## node with sqlite

apply migrations to the database
```shell script
npx daita migration:apply
```

## node with postgres

start your database
```shell script
docker-compuse up -d
```

apply migrations to the database
```shell script
npx daita migration:apply
```

## web with sqlite over http

apply migrations to the database
```shell script
npx daita migration:apply
```

