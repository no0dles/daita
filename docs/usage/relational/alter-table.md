# ALTER TABLE

## RENAME TABLE

```typescript
await client.exec({
   alterTable: table(Mountain),
   renameTo: 'Mowntain',
});

// sql: ALTER TABLE "Mountain" RENAME TO "Mowntain"
```

## ADD COLUMN

```typescript
await client.exec({
   alterTable: table(Mountain),
   add: { column: 'country', type: 'VARCHAR' }
});

// sql: ALTER TABLE "Mountain" ADD COLUMN "country" VARCHAR
```

## DROP COLUMN

```typescript
await client.exec({
   alterTable: table(Mountain),
   drop: { column: 'country' }
});

// sql: ALTER TABLE "Mountain" DROP COLUMN "country"
```

## ADD PRIMARY KEY

```typescript
await client.exec({
   alterTable: table(Mountain),
   add: { primaryKey: 'name' }
});

// sql: ALTER TABLE "Mountain" ADD PRIMARY KEY ("name")
```


```typescript
await client.exec({
   alterTable: table(Mountain),
   add: { primaryKey: ['name', 'country'] }
});

// sql: ALTER TABLE "Mountain" ADD PRIMARY KEY ("name", "country")
```


## ADD FOREIGN KEY

```typescript
await client.exec({
   alterTable: table(Mountain),
   add: { 
      foreignKey: ['firstAscent'], 
      references: { 
         table: table(Ascent), 
         primaryKeys: ['id'] 
      }, 
      onDelete: 'cascade', 
      onUpdate: 'cascade',
   }
});

// sql: ALTER TABLE "Mountain" ADD FOREIGN KEY ("firstAscent") 
//      REFERENCES "Ascent" ("id") 
//      ON DELETE cascade ON UPDATE cascade
```


## DROP CONSTRAINT

```typescript
await client.exec({
   alterTable: table(Mountain),
   drop: { 
      constraint: 'Mountain_pkey'
   }
});

// sql: ALTER TABLE "Mountain" ADD FOREIGN KEY ("firstAscent") 
//      DROP CONSTRAINT "Mountain_pkey"
```

