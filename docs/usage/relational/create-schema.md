# CREATE SCHEMA


```typescript
await client.exec({
   createSchema: 'Mountains',
   ifNotExists: true,
});

// sql: CREATE SCHEMA IF NOT EXISTS "Mountains"
```
