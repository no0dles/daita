# MINUTE

```typescript
const mountains = await client.select({
   select: {
       name: field(Mountain, 'name'),
       minute: minute(field(Moutain, 'firstAscentDate')),
   },
   from: table(Mountain),
});
// postgres sql: SELECT "Mountain"."name", date_part('minute', "Mountain"."firstAscentDate")
//             FROM "Mountain"
//
// sqlite sql: SELECT "Mountain"."name", round(strftime('%M', "Mountain"."firstAscentDate"))
//             FROM "Mountain"
//
// const mountains: { name: string, minute: number }[]
```
