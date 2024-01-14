# CREATE TABLE


```typescript
await client.exec({
   createTable: table('Mountains'),
   ifNotExists: true,
   columns: [{
       name: 'name',
       type: 'VARCHAR',
       notNull: true,
       primaryKey: true,
   }, {
       name: 'firstAscent',
       type: 'UUID',
   }],
   foreignKey: {
       firstAscent: {
           key: 'firstAscent',
           references: {
               table: table('Ascent'),
               primaryKey: ['id'],
           },
           onDelete: 'set null',
       }
   }
});

// sql: CREATE TABLE IF NOT EXISTS "Mountains" (
//         "name" VARCHAR NOT NULL,
//         "firstAscent" UUID
//      ), 
//      PRIMARY KEY ("name"),
//      CONSTRAINT "firstAscent" FOREIGN KEY ("firstAscent") REFERENCES "Ascent" ("id") ON DELETE set null
```

