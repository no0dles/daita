# CREATE INDEX

```typescript
await client.exec({
   createIndex: 'MountainName',
   unique: true,
   on: table(Mountain),
   columns: ['name'],
});

// sql: CREATE UNIQUE INDEX "MountainName" ON "Mountain" ("name")
```
