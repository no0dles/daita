---
id: select
title: select
sidebar_label: select
---

Create a select query with the interface `SelectSql<T>` that can be used with a `Client` to query the database.
`T` represents the type of the expected result and is equal to the `select` property type.  

## Select

### *
```typescript
const sql: SelectSql<Mountain> = {
  select: all(Mountain),
  from: table(Mountain),
}
// SELECT * FROM Mountain
```

### table fields
```typescript
const sql: SelectSql<{name: string, mountainHeight: number }> = {
  select: {
    name: field(Mountain, 'name'),
    mountainHeight: field(Mountain, 'height'),
  },
  from: table(Mountain),
}
// SELECT Mountain.name, Mountain.height AS "mountainHeight" 
// FROM Mountain
```

### subselect field
```typescript
const sql: SelectSql<{ name: string, totalCount: number}> = {
  select: {
    name: field(Mountain, 'name'),
    totalCount: subSelect({ select: count(), from: table(Mountain) }),
  },
  from: table(Mountain),
}
// SELECT Mountain.name, (SELECT count(*) FROM Mountain) AS "totalCount" 
// FROM Mountain
```

## From

### table
```typescript
// SELECT * FROM Mountain
const sql: SelectSql<Mountain> = {
  select: all(Mountain),
  from: table(Mountain),
}
```

### table alias
```typescript
const sql: SelectSql<Mountain> = {
  select: all(alias(Mountain, 'm')),
  from: alias(Mountain, 'm'),
}
// SELECT m.* FROM Mountain AS m
```

### subselect
```typescript
const sql: SelectSql<Mountain> = {
  select: all(),
  from: subSelect({
    select: [{
      name: 'result'
    }],
  })
}
// SELECT * FROM (SELECT "result")
```

## Join

### table
```typescript
const sql: SelectSql<{mountain: string, country: string}> = {
  select: {
    mountain: field(Mountain, 'name'),
    country: field(Country, 'name'),
  },
  from: table(Mountain),
  join: [
    join(Country, equal(field(Mountain, 'countryId'), field(Country, 'id')))
  ]
}
// SELECT Mountain.name AS "mountain", Country.name AS "country" 
// FROM Mountain 
// JOIN Country ON Mountain.countryId = Country.id
```

### table alias
```typescript
const parentTable = alias(Mountain, 'parent')
const sql: SelectSql<{mountain: string, parentMountain: string}> = {
  select: {
    mountain: field(Mountain, 'name'),
    parentMountain: field(parentTable, 'name'),
  },
  from: table(Mountain),
  join: [
    join(parentTable, equal(field(parentTable, 'id'), field(Mountain, 'parentMountainId')))
  ]
}
// SELECT Mountain.name AS "mountain", parent.name AS "parentMountain" 
// FROM Mountain 
// JOIN Mountain AS "parent" ON parent.id = Mountain.parentMountainId
```


## Where

### equal
```typescript
const sql: SelectSql<Mountain> = {
  select: all(Mountain),
  from: table(Mountain),
  where: equal(field(Mountain, 'name'), 'Matterhorn')
}
// SELECT Mountain.*
// FROM Mountain 
// WHERE Mountain.name = 'Matterhorn'
```

### notEqual
```typescript
const sql: SelectSql<Mountain> = {
  select: all(Mountain),
  from: table(Mountain),
  where: notEqual(field(Mountain, 'name'), 'Matterhorn')
}
// SELECT Mountain.*
// FROM Mountain 
// WHERE Mountain.name != 'Matterhorn'
```

### isNull
```typescript
const sql: SelectSql<Mountain> = {
  select: all(Mountain),
  from: table(Mountain),
  where: isNull(field(Mountain, 'name'))
}
// SELECT Mountain.*
// FROM Mountain 
// WHERE Mountain.name IS NULL'
```

### isNotNull
```typescript
const sql: SelectSql<Mountain> = {
  select: all(Mountain),
  from: table(Mountain),
  where: isNotNull(field(Mountain, 'name'))
}
// SELECT Mountain.*
// FROM Mountain 
// WHERE Mountain.name IS NOT NULL'
```

### like
```typescript
const sql: SelectSql<Mountain> = {
  select: all(Mountain),
  from: table(Mountain),
  where: like(field(Mountain, 'name'), 'Matter%')
}
// SELECT Mountain.*
// FROM Mountain 
// WHERE Mountain.name LIKE 'Matter%'
```

### and
```typescript
const sql: SelectSql<Mountain> = {
  select: all(Mountain),
  from: table(Mountain),
  where: and(
    notEqual(field(Mountain, 'name'), 'Matterhorn'),
    notEqual(field(Mountain, 'name'), 'Pilatus')
  )
}
// SELECT Mountain.*
// FROM Mountain 
// WHERE (Mountain.name != 'Matterhorn' AND Mountain.name != Pilatus')
```

### or
```typescript
const sql: SelectSql<Mountain> = {
  select: all(Mountain),
  from: table(Mountain),
  where: or(
    and(
      notEqual(field(Mountain, 'name'), 'Matterhorn'),
      notEqual(field(Mountain, 'name'), 'Pilatus')
    ),
    equal(field(Mountain, 'name'), 'Pilatus')
  )
}
// SELECT Mountain.*
// FROM Mountain 
// WHERE ((Mountain.name != 'Matterhorn' AND Mountain.name != Pilatus') OR Mountain.name = 'Pilatus') 
```

## Having
## Group by
## Order by
