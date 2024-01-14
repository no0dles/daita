# DROP TABLE

```typescript
await client.exec({
   dropTable: table(Mountain),
   ifExists: true
});
// sql: DROP TABLE IF EXISTS "Mountain"
```



