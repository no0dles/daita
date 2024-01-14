# YEAR

```typescript
const mountains = await client.select({
   select: {
       name: field(Mountain, 'name'),
       year: year(field(Moutain, 'firstAscentDate')),
   },
   from: table(Mountain),
});
// postgres sql: SELECT "Mountain"."name", date_part('year', "Mountain"."firstAscentDate")
//             FROM "Mountain"
//
// sqlite sql: SELECT "Mountain"."name", round(strftime('%Y', "Mountain"."firstAscentDate"))
//             FROM "Mountain"
//
// const mountains: { name: string, year: number }[]
```
