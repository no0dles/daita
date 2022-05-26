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
// sql: SELECT "Mountain"."name" FROM "Mountain"
//
// const names: string[]
```

```typescript
const mountains = await client.select({
   select: { 
     moutain: field(Moutain, 'name'),
   }
   from: table(Mountain),
});
// sql: SELECT "Mountain"."name" FROM "Mountain"
//
// const names: { mountain: string }[]
```

### all (\*)

```typescript
const mountains = await client.select({
  select: all(Mountain),
  from: table(Mountain),
});
// sql: SELECT "Mountain".* FROM "Mountain"
//
// const mountains: Mountain[]
```

```typescript
const mountains = await client.select({
  select: all(),
  from: table(Mountain),
});
// sql: SELECT * FROM "Mountain"
//
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
// sql: SELECT 
//         "Mountain"."name", 
//         (SELECT min("Ascent"."date") FROM "Ascent" WHERE "Ascent"."mountain" = "Mountain"."name")) 
//      FROM "Mountain"
//
// const mountains: { name: string, firstAscent: Date }[]
```

### selectFirst

```typescript
const mountains = await client.selectFirst({
  select: all(Mountain),
  from: table(Mountain),
});
// sql: SELECT "Mountain".* FROM "Mountain" LIMIT 1
//
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

```typescript
const mountains = await client.select({
   select: {
     country: field(Moutain, 'country'),
     mountain: field(Moutain, 'name'),
   },
   from: table(Mountain),
   where: equal(field(Mountain, 'country'), 'CH'),
});
// sql: SELECT "Mountain"."name", "Mountain"."country" 
//      FROM "Mountain"
//      WHERE "Mountain"."country" = 'CH'
//
// const mountains: { country: string, mountain: number }[]
```

### notEqual

```typescript
const mountains = await client.select({
   select: {
     country: field(Moutain, 'country'),
     mountain: field(Moutain, 'name'),
   },
   from: table(Mountain),
   where: notEqual(field(Mountain, 'country'), 'CH'),
});
// sql: SELECT "Mountain"."name", "Mountain"."country" 
//      FROM "Mountain"
//      WHERE "Mountain"."country" != 'CH'
//
// const mountains: { country: string, mountain: number }[]
```

### greaterThan

```typescript
const mountains = await client.select({
   select: field(Moutain, 'name'),
   from: table(Mountain),
   where: greaterThan(field(Mountain, 'height'), 1000),
});
// sql: SELECT "Mountain"."name"
//      FROM "Mountain"
//      WHERE "Mountain"."height" > 1000
//
// const mountains: string[]
```

### greaterEqualThan

```typescript
const mountains = await client.select({
   select: field(Moutain, 'name'),
   from: table(Mountain),
   where: greaterEqualThan(field(Mountain, 'height'), 1000),
});
// sql: SELECT "Mountain"."name"
//      FROM "Mountain"
//      WHERE "Mountain"."height" >= 1000
//
// const mountains: string[]
```

### lowerThan

```typescript
const mountains = await client.select({
   select: field(Moutain, 'name'),
   from: table(Mountain),
   where: lowerThan(field(Mountain, 'height'), 1000),
});
// sql: SELECT "Mountain"."name"
//      FROM "Mountain"
//      WHERE "Mountain"."height" < 1000
//
// const mountains: string[]
```

### lowerEqualThan

```typescript
const mountains = await client.select({
   select: field(Moutain, 'name'),
   from: table(Mountain),
   where: lowerEqualThan(field(Mountain, 'height'), 1000),
});
// sql: SELECT "Mountain"."name"
//      FROM "Mountain"
//      WHERE "Mountain"."height" <= 1000
//
// const mountains: string[]
```


### isNull

```typescript
const mountains = await client.select({
   select: field(Moutain, 'name'),
   from: table(Mountain),
   where: isNull(field(Mountain, 'firstAscent')),
});
// sql: SELECT "Mountain"."name"
//      FROM "Mountain"
//      WHERE "Mountain"."firstAscent" IS NULL
//
// const mountains: string[]
```


### isNotNull

```typescript
const mountains = await client.select({
   select: field(Moutain, 'name'),
   from: table(Mountain),
   where: isNotNull(field(Mountain, 'firstAscent')),
});
// sql: SELECT "Mountain"."name"
//      FROM "Mountain"
//      WHERE "Mountain"."firstAscent" IS NOT NULL
//
// const mountains: string[]
```

### in

```typescript
const mountains = await client.select({
   select: field(Moutain, 'name'),
   from: table(Mountain),
   where: isIn(field(Mountain, 'country'), ['CH', 'IT']),
});
// sql: SELECT "Mountain"."name"
//      FROM "Mountain"
//      WHERE "Mountain"."country" IN ('CH', 'IT')
//
// const mountains: string[]
```

### isNotIn

```typescript
const mountains = await client.select({
   select: field(Moutain, 'name'),
   from: table(Mountain),
   where: isNotIn(field(Mountain, 'country'), ['CH', 'IT']),
});
// sql: SELECT "Mountain"."name"
//      FROM "Mountain"
//      WHERE "Mountain"."country" NOT IN ('CH', 'IT')
//
// const mountains: string[]
```

### like

```typescript
const mountains = await client.select({
   select: field(Moutain, 'name'),
   from: table(Mountain),
   where: like(field(Mountain, 'name'), 'Matter%'),
});
// sql: SELECT "Mountain"."name"
//      FROM "Mountain"
//      WHERE "Mountain"."name" LIKE 'Matter%'
//
// const mountains: string[]
```


### between

```typescript
const mountains = await client.select({
   select: field(Moutain, 'name'),
   from: table(Mountain),
   where: between(field(Mountain, 'height'), 1000, 2000),
});
// sql: SELECT "Mountain"."name"
//      FROM "Mountain"
//      WHERE "Mountain"."height" BETWEEN 1000 AND 2000
//
// const mountains: string[]
```



### notBetween

```typescript
const mountains = await client.select({
   select: field(Moutain, 'name'),
   from: table(Mountain),
   where: notBetween(field(Mountain, 'height'), 1000, 2000),
});
// sql: SELECT "Mountain"."name"
//      FROM "Mountain"
//      WHERE "Mountain"."height" NOT BETWEEN 1000 AND 2000
//
// const mountains: string[]
```


### and

```typescript
const mountains = await client.select({
   select: {
     country: field(Moutain, 'country'),
     mountain: field(Moutain, 'name'),
   },
   from: table(Mountain),
   where: and(
     equal(field(Mountain, 'country'), 'CH'),
     greaterEqualThan(field(Mountain, 'height'), 2000),
   ),
});
// sql: SELECT "Mountain"."name", "Mountain"."country"
//      FROM "Mountain"
//      WHERE "Mountain"."country" = 'CH' AND "Mountain"."height" > 2000
//
// const mountains: { country: string, mountain: number }[]
```

### or

```typescript
const mountains = await client.select({
   select: {
     country: field(Moutain, 'country'),
     mountain: field(Moutain, 'name'),
   },
   from: table(Mountain),
   where: or(
     equal(field(Mountain, 'country'), 'CH'),
     greaterEqualThan(field(Mountain, 'height'), 2000),
   ),
});
// sql: SELECT "Mountain"."name", "Mountain"."country"
//      FROM "Mountain"
//      WHERE "Mountain"."country" = 'CH' OR "Mountain"."height" > 2000
//
// const mountains: { country: string, mountain: number }[]
```



## GROUP BY

```typescript
const names = await client.select({
   select: {
     country: field(Moutain, 'country'),
     count: count(),
   },
   from: table(Mountain),
   groupBy: field(Mountain, 'country'),
});
// sql: SELECT "Mountain"."country", count(*)
//      FROM "Mountain"
//      GROUP BY "Mountain"."country"
//
// const names: { country: string, count: number }[]
```

## HAVING BY

```typescript
const countries = await client.select({
   select: field(Moutain, 'country'),
   from: table(Mountain),
   groupBy: field(Mountain, 'country'),
   havingBy: greaterThan(count(*), 1),
});
// sql: SELECT "Mountain"."country"
//      FROM "Mountain"
//      GROUP BY "Mountain"."country"
//      HAVING BY count(*) > 1
//
// const countries: string[]
```

## ORDER BY

```typescript
const names = await client.select({
   select: field(Moutain, 'name'),
   from: table(Mountain),
   orderBy: field(Mountain, 'name')
});
// sql: SELECT "Mountain"."name"
//      FROM "Mountain"
//      ORDER BY "Mountain"."name"
//
// const names: string[]
```

```typescript
const names = await client.select({
   select: field(Moutain, 'name'),
   from: table(Mountain),
   orderBy: desc(field(Mountain, 'height'))
});
// sql: SELECT "Mountain"."name"
//      FROM "Mountain"
//      ORDER BY "Mountain"."height" DESC
//
// const names: string[]
```

```typescript
const names = await client.select({
   select: field(Moutain, 'name'),
   from: table(Mountain),
   orderBy: [
     desc(field(Mountain, 'height')),
     asc(field(Mountain, 'name')),
   ]
});
// sql: SELECT "Mountain"."name"
//      FROM "Mountain"
//      ORDER BY "Mountain"."height" DESC, "Mountain"."name" ASC
//
// const names: string[]
```

## LIMIT

```typescript
const names = await client.select({
   select: field(Moutain, 'name'),
   from: table(Mountain),
   limit: 5,
});
// sql: SELECT "Mountain"."name"
//      FROM "Mountain"
//      LIMIT 5
//
// const names: string[]
```

## OFFSET

```typescript
const names = await client.select({
   select: field(Moutain, 'name'),
   from: table(Mountain),
   offset: 5,
});
// sql: SELECT "Mountain"."name"
//      FROM "Mountain"
//      OFFSET 5
//
// const names: string[]
```
