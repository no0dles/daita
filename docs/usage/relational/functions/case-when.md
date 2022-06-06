# CASE WHEN

```typescript
const stats = await client.select({
   select: {
       height: caseWhen(case => case
          .when(greaterThan(field(Moutain, 'height'), 2000), 'Tier A')
          .when(greaterThan(field(Mountain, 'height'), 1000), 'Tier B')
          .else('Tier C'),
       name: field(Mountain, 'name'),
   }
   from: table(Mountain),
});
// sql: SELECT 
//         CASE WHEN "Mountain"."height" > 2000 THEN 'Tier A' 
//              WHEN "Mountain"."height" > 1000 THEN 'Tier B' 
//              ELSE 'Tier C' END, 
//         "Mountain"."name"
//      FROM "Mountain"
//
// const stats: { height: number, name: string }[]
```
