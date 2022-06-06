# MONTH

```typescript
const mountains = await client.select({
   select: {
       name: field(Mountain, 'name'),
       month: month(field(Moutain, 'firstAscentDate')),
   },
   from: table(Mountain),
});
// postgres sql: SELECT "Mountain"."name", date_part('month', "Mountain"."firstAscentDate")
//             FROM "Mountain"
//
// sqlite sql: SELECT "Mountain"."name", round(strftime('%m', "Mountain"."firstAscentDate"))
//             FROM "Mountain"
//
// const mountains: { name: string, month: number }[]
```
