# CONCAT

```typescript
const names = await client.select({
   select: concat(field(Moutain, 'country'), ' ', field(Moutain, 'name')),
   from: table(Mountain),
});
// sql: SELECT "Mountain"."country" || ' ' || "Mountain"."name"
//      FROM "Mountain"
//
// const names: string[]
```
