# HOUR

```typescript
const mountains = await client.select({
   select: {
       name: field(Mountain, 'name'),
       hour: hour(field(Moutain, 'firstAscentDate')),
   },
   from: table(Mountain),
});
// postgres sql: SELECT "Mountain"."name", date_part('hour', "Mountain"."firstAscentDate")
//             FROM "Mountain"
//
// sqlite sql: SELECT "Mountain"."name", round(strftime('%H', "Mountain"."firstAscentDate"))
//             FROM "Mountain"
//
// const mountains: { name: string, hour: number }[]
```
