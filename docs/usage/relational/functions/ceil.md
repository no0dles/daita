# CEIL

```typescript
const stats = await client.select({
   select: {
       height: ceil(Moutain, 'height'),
       name: field(Mountain, 'name'),
   }
   from: table(Mountain),
});
// sql: SELECT ceil("Mountain"."height"), "Mountain"."name"
//      FROM "Mountain"
//
// const stats: { height: number, name: string }[]
```
