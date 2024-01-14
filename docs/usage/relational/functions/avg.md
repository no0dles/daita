# AVG

```typescript
const stats = await client.select({
   select: {
       height: avg(Moutain, 'height'),
       country: field(Mountain, 'country'),
   }
   from: table(Mountain),
   groupBy: field(Mountain, 'country'),
});
// sql: SELECT avg("Mountain"."height"), "Mountain"."country"
//      FROM "Mountain"
//      GROUP BY "Mountain"."country"
//
// const stats: { height: number, country: string }[]
```
