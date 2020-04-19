import {MigrationDescription, MigrationTree} from '../migration';
import {Constructable, DefaultConstructable} from '../constructable';
import {Doc} from '../context/types/document';
import {DocumentDataAdapter} from '../adapter';
import {DocumentContext} from '../context';

export class DocumentSchema {
  private migrationTree = new MigrationTree();
  private collections: Constructable<any>[] = [];

  collection(model: DefaultConstructable<Doc>) {
    this.collections.push(model);
  }

  migration(migration: MigrationDescription) {
    this.migrationTree.add(migration);
  }

  context(dataAdapter: DocumentDataAdapter): DocumentContext {
    const schema = this.migrationTree.defaultSchema();
    return new DocumentContext(schema, this.migrationTree, dataAdapter);
  }
}
