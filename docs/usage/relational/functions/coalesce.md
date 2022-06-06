# COALESCE

```typescript
const stats = await client.select({
   select: {
       height: coalesce([field(Moutain, 'height'), field(Moutain, 'backupHeight')]),
       name: field(Mountain, 'name'),
   }
   from: table(Mountain),
});
// sql: SELECT COALESCE("Mountain"."height", "Mountain"."backupHeight"), "Mountain"."name"
//      FROM "Mountain"
//
// const stats: { height: number, name: string }[]
```
