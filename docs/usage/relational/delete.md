# DELETE

```typescript
const result = await client.delete({
   delete: table(Mountain),
   where: equal(field(Mountain, 'country'), 'CH'),
});
// sql: DELETE FROM "Mountain" WHERE "Mountain"."country" = 'CH'
//
// const result: { deletedRows: number }
```
