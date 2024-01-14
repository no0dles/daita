# DAY OF WEEK

```typescript
const mountains = await client.select({
   select: {
       name: field(Mountain, 'name'),
       day: dayOfWeek(field(Moutain, 'firstAscentDate')),
   },
   from: table(Mountain),
});
// postgres sql: SELECT "Mountain"."name", date_part('day', "Mountain"."firstAscentDate")
//             FROM "Mountain"
//
// sqlite sql: SELECT "Mountain"."name", round(strftime('%w', "Mountain"."firstAscentDate"))
//             FROM "Mountain"
//
// const mountains: { name: string, day: number }[]
```
