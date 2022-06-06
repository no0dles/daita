# COUNT

```typescript
const mountainCount = await client.selectFirst({
   select: count(),
   from: table(Mountain),
});
// sql: SELECT count(*)
//      FROM "Mountain"
//
// const mountainCount: number
```
