# UPDATE

```typescript
const result = await client.update({
   update: table(Mountain),
   set: {
       height: 100,
   },
   where: equal(field(Mountain, 'country'), 'CH'),
});
// sql: UPDATE "Mountain" SET "height" = 100 WHERE "Mountain"."country" = 'CH'
//
// const result: { updatedRows: number }
```
