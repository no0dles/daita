# INSERT

```typescript
const result = await client.insert({
   insert: {
       name: 'Matterhorn',
       height: 4478,
       country: 'CH',
   },
   into: table(Mountain),
});
// sql: INSERT INTO "Mountain" ("name", "height", "country") VALUES ('Matterhorn', 4478, 'CH')
//
// const result: { insertedRows: number }
```


```typescript
const result = await client.insert({
   insert: [{
       name: 'Matterhorn',
       height: 4478,
       country: 'CH',
   }, {
       name: 'Albis',
       height: 914.6,
       country: 'CH',
   }],
   into: table(Mountain),
});
// sql: INSERT INTO "Mountain" ("name", "height", "country") VALUES ('Matterhorn', 4478, 'CH'), ('Albis', 914.6, 'CH')
//
// const result: { insertedRows: number }
```



```typescript
const result = await client.insert({
   insert: {
       select: {
           name: field(Mountain, 'name'),
           height: field(Mountain, 'height'),
           country: 'IT',
       },
       from: table(Mountain),
       where: equal(field(Mountain, 'country'), 'CH'),
   },
   into: table(Mountain),
});
// sql: INSERT INTO "Mountain" ("name", "height", "country") 
//      SELECT "Mountain"."name", "Mountain"."height", 'IT'
//      WHERE "Mountain"."country" = 'CH'
//
// const result: { insertedRows: number }
```

