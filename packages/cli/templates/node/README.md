# {{NAME}}

## 1. Installation
```
yarn|npm install
```

## 2. Start database
```
docker-compose up -d
```

## 3. Create first migration
```
npx dc migration:add init
```

## 4. Create data schema
```
npx dc migration:apply
```

## 5. Run program
``npx ts-node src/npm-publish.ts``

Result
```json
[
  Mountain {
    id: 'c781a6b0-3575-11ea-bb56-b161374db4ba',
    name: 'Matterhorn',
    height: 4478,
    cantonId: 'c7813180-3575-11ea-bb56-b161374db4ba',
    canton: {
      id: 'c7813180-3575-11ea-bb56-b161374db4ba',
      name: 'Valais',
      shortName: 'VS'
    }
  }
]
```
