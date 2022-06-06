# DAY OF YEAR

```typescript
const mountains = await client.select({
   select: {
       name: field(Mountain, 'name'),
       week: weekOfYear(field(Moutain, 'firstAscentDate')),
   },
   from: table(Mountain),
});
// postgres sql: SELECT "Mountain"."name", date_part('week', "Mountain"."firstAscentDate")
//             FROM "Mountain"
//
// sqlite sql: SELECT "Mountain"."name", round(strftime('%W', "Mountain"."firstAscentDate"))
//             FROM "Mountain"
//
// const mountains: { name: string, week: number }[]
```
