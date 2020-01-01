import {DefaultConstructable} from '../constructable';
import {DocumentDataAdapter, RelationalDataAdapter} from '../adapter';
import {DocumentCreateContext} from './document-create-context';
import {DocumentFindContext} from './document-find-context';
import {DocumentRemoveContext} from './document-remove-context';
import {DocumentUpdateContext} from './document-update-context';
import {MigrationSchema} from '../schema/migration-schema';
import {MigrationTree} from '../migration';

export class DocumentContext {
  constructor(
    private schema: MigrationSchema,
    private migrationTree: MigrationTree,
    private rootDataAdapter: DocumentDataAdapter,
  ) {}

  create<T>(type: DefaultConstructable<T>): DocumentCreateContext<T> {
    return new DocumentCreateContext<T>(type);
  }
  find<T>(type: DefaultConstructable<T>): DocumentFindContext<T> {
    return new DocumentFindContext<T>(type);
  }
  update<T>(type: DefaultConstructable<T>): DocumentUpdateContext<T> {
    return new DocumentUpdateContext<T>(type);
  }
  remove<T>(type: DefaultConstructable<T>): DocumentRemoveContext<T> {
    return new DocumentRemoveContext<T>(type);
  }

  async transaction(action: (trx: DocumentContext) => Promise<any>) {
    //const trx = await this.dataAdapter.transaction();
    await action(new DocumentContext(this.schema, this.migrationTree, this.rootDataAdapter));
  }
}
