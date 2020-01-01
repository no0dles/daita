import {
  AddCollectionFieldMigrationStep,
  AddCollectionMigrationStep,
  DropCollectionFieldMigrationStep, DropCollectionMigrationStep,
  ModifyCollectionFieldMigrationStep,
  RelationalAddTableFieldMigrationStep, RelationalAddTableForeignKey,
  RelationalAddTableMigrationStep,
  RelationalAddTablePrimaryKey, RelationalDropTableFieldMigrationStep,
  RelationalDropTableMigrationStep,
} from '../steps';
import {
  DocumentCollectionSchema,
  DocumentCollectionSchemaCollection,
  RelationalTableSchema,
  RelationalTableSchemaTable,
} from '../../schema';
import {MigrationStep} from '../migration-step';


function merge(currentItems: string[], newItems: string[], functions: {
  add: (item: string) => void;
  remove: (item: string) => void;
  merge: (item: string) => void;
}) {
  const leftItems = [...newItems];
  for (const currentItem of currentItems) {
    const index = leftItems.indexOf(currentItem);
    if (index >= 0) {
      leftItems.splice(index, 1);
      functions.merge(currentItem);
    } else {
      functions.remove(currentItem);
    }
  }

  for(const leftItem of leftItems) {
    functions.add(leftItem);
  }
}

function mergeList<T>(currentItems: T[], newItems: T[], functions: {
  compare: (first: T, second: T) => boolean,
  add: (item: T) => void;
  remove: (item: T) => void;
  merge: (currentItem: T, newItem: T) => void;
}) {
  const leftItems = [...newItems];
  for (const currentItem of currentItems) {
    const newItem = newItems.filter(newItem => functions.compare(newItem, currentItem))[0];
    if (newItem) {
      const index = leftItems.indexOf(newItem);
      leftItems.splice(index, 1);
      functions.merge(currentItem, newItem);
    } else {
      functions.remove(currentItem);
    }
  }

  for(const leftItem of leftItems) {
    functions.add(leftItem);
  }
}

export function getRelationalMigrationSteps(currentSchema: RelationalTableSchema, newSchema: RelationalTableSchema) {
  const steps: MigrationStep[] = [];

  mergeList(currentSchema.tables, newSchema.tables, {
    compare: (first, second) => first.name === second.name,
    add: table => {
      steps.push(new RelationalAddTableMigrationStep(table.name));
      for (const field of table.fields) {
        steps.push(
          new RelationalAddTableFieldMigrationStep(
            table.name,
            field.name,
            field.type,
            field.required,
            field.defaultValue
          )
        );
      }

      steps.push(new RelationalAddTablePrimaryKey(table.name, table.primaryKeys));
      for(const foreignKey of table.foreignKeys) {
        steps.push(new RelationalAddTableForeignKey(table.name, foreignKey.name, foreignKey.keys, foreignKey.table, foreignKey.foreignKeys));
      }
    },
    remove: table => {
      steps.push(new RelationalDropTableMigrationStep(table.name));
    },
    merge: (currentTable, newTable) => {
      steps.push(...mergeTable(currentTable, newTable));
    },
  });

  return steps;
}

export function getDocumentMigrationSteps(currentSchema: DocumentCollectionSchema, newSchema: DocumentCollectionSchema) {
  const steps: MigrationStep[] = [];

  mergeList(currentSchema.collections, newSchema.collections, {
    compare: (first, second) => first.name === second.name,
    add: collection => {
      steps.push(new AddCollectionMigrationStep(collection.name));
      for (const field of collection.fields) {
        steps.push(
          new AddCollectionFieldMigrationStep(
            collection.name,
            field.name,
            field.type,
            field.required,
            field.defaultValue
          )
        );
      }
    },
    remove: collection => {
      steps.push(new DropCollectionMigrationStep(collection.name));
    },
    merge: (currentCollection, newCollection) => {
      steps.push(...mergeCollection(currentCollection, newCollection));
    }
  });

  return steps;
}

function mergeTable(currentTable: RelationalTableSchemaTable, newTable: RelationalTableSchemaTable) {
  const steps: MigrationStep[] = [];

  mergeList(currentTable.fields, newTable.fields, {
    compare: (first, second) => first.name === second.name,
    add: field => {
      steps.push(
        new RelationalAddTableFieldMigrationStep(
          newTable.name,
          field.name,
          field.type,
          field.required,
          field.defaultValue,
        )
      );
    },
    remove: field => {
      steps.push(new RelationalDropTableFieldMigrationStep(newTable.name, field.name));
    },
    merge: (currentField, newField) => {
      console.log(currentField, newField)
    }
  });

  merge(currentTable.primaryKeys, newTable.primaryKeys, {
    add: key => {
      throw new Error(`cant change primary key for table ${currentTable.name}`);
    },
    merge: () => {},
    remove: key => {
     throw new Error(`cant change primary key for table ${currentTable.name}`);
    }
  });

  // mergeList(currentTable.foreignKeys, newTable.foreignKeys, {
  //   compare: (first, second) => first.table === second.table,
  // });

  return steps;
}

function mergeCollection(currentCollection: DocumentCollectionSchemaCollection, newCollection: DocumentCollectionSchemaCollection) {
  const steps: MigrationStep[] = [];

  mergeList(currentCollection.fields, newCollection.fields, {
    compare: (first, second) => first.name === second.name,
    add: field => {
      steps.push(
        new AddCollectionFieldMigrationStep(
          newCollection.name,
          field.name,
          field.type,
          field.required,
          field.defaultValue
        )
      );
    },
    remove: field => {
      steps.push(
        new DropCollectionFieldMigrationStep(newCollection.name, field.name)
      );
    },
    merge: (currentField, newField) => {
      if (newField.type !== currentField.type) {
        steps.push(
          new DropCollectionFieldMigrationStep(newCollection.name, currentField.name)
        );
        steps.push(
          new AddCollectionFieldMigrationStep(
            newCollection.name,
            currentField.name,
            newField.type,
            newField.required,
            newField.defaultValue
          )
        );
      } else if (
        newField.required !== currentField.required ||
        newField.defaultValue !== currentField.defaultValue
      ) {
        steps.push(
          new ModifyCollectionFieldMigrationStep(
            newCollection.name,
            currentField.name,
            newField.required,
            newField.defaultValue
          )
        );
      }
    }
  });

  return steps;
}
