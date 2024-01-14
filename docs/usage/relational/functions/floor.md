# FLOOR

```typescript
const stats = await client.select({
   select: {
       height: floor(Moutain, 'height'),
       name: field(Mountain, 'name'),
   }
   from: table(Mountain),
});
// sql: SELECT floor("Mountain"."height"), "Mountain"."name"
//      FROM "Mountain"
//
// const stats: { height: number, name: string }[]
```
