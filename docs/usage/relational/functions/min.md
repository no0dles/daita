# MIN

```typescript
const stats = await client.select({
   select: {
       height: min(Moutain, 'height'),
       country: field(Mountain, 'country'),
   }
   from: table(Mountain),
   groupBy: field(Mountain, 'country'),
});
// sql: SELECT sum("Mountain"."height"), "Mountain"."country"
//      FROM "Mountain"
//      GROUP BY "Mountain"."country"
//
// const stats: { height: number, country: string }[]
```
