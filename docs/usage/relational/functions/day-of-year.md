# DAY OF YEAR

```typescript
const mountains = await client.select({
   select: {
       name: field(Mountain, 'name'),
       day: dayOfMonth(field(Moutain, 'firstAscentDate')),
   },
   from: table(Mountain),
});
// postgres sql: SELECT "Mountain"."name", date_part('doy', "Mountain"."firstAscentDate")
//             FROM "Mountain"
//
// sqlite sql: SELECT "Mountain"."name", round(strftime('%j', "Mountain"."firstAscentDate"))
//             FROM "Mountain"
//
// const mountains: { name: string, day: number }[]
```
