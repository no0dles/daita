# DROP VIEW

```typescript
await client.exec({
   dropView: table('MountainsInSwitzerland'),
   ifExists: true
});
// sql: DROP VIEW IF EXISTS "MountainsInSwitzerland"
```


