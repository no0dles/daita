---
description: Select
---

# SELECT

## SELECT

### field

```typescript
const names = await client.select({
   select: field(Moutain, 'name'),
   from: table(Mountain),
});
// const names: string[]
```

```typescript
const mountains = await client.select({
   select: { 
     moutain: field(Moutain, 'name'),
   }
   from: table(Mountain),
});
// const names: { mountain: string }[]
```

### all (\*)

```typescript
const mountains = await client.select({
  select: all(Mountain),
  from: table(Mountain),
});
// const mountains: Mountain[]
```

```typescript
const mountains = await client.select({
  select: all(),
  from: table(Mountain),
});
// const mountains: any[]
```

### subSelect

```typescript
const mountains = await client.select({
  select: {
    name: field(Moutain, 'name'),
    firstAscent: subSelect({
      select: min(field(Ascent, 'date')),
      from: table(Ascent),
      where: equal(field(Ascent, 'mountain'), field(Mountain, 'name'))
    }),
  },
  from: table(Mountain),
});
// const mountains: { name: string, firstAscent: Date }[]
```

### selectFirst

```typescript
const mountains = await client.selectFirst({
  select: all(Mountain),
  from: table(Mountain),
});
// const mountains: Mountain
```

## FROM

### table

### alias

### subSelect

## JOIN

### leftJoin

### rightJoin

### join

## WHERE

### equal

### and

### or



## GROUP BY

## HAVING BY

## ORDER BY

## LIMIT

## OFFSET
