# CREATE VIEW

```typescript
await client.exec({
   createView: 'MountainsInSwitzerland',
   orReplace: true,
   as: {
       select: all(Mountain),
       from: table(Mountain),
       where: equal(field(Mountain, 'country'), 'CH'),
   }
});

// sql: CREATE OR REPLACE VIEW "MountainsInSwitzerland" AS
//      SELECT "Mountain".* FROM "Mountain"
//      WHERE "Mountain"."country" = 'CH'
```
