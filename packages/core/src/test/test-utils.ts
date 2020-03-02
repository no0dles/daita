import {RelationalDataAdapter, RelationalSchema} from '../index';
import {ContextUser} from '../auth';

export interface RelationalDataAdapterFactoryResult<T extends RelationalDataAdapter> {
  dataAdapter: T,
  close: () => Promise<void>;
}

export interface RelationalDataAdapterFactory<T extends RelationalDataAdapter = RelationalDataAdapter> {
  create(schema: RelationalSchema): Promise<RelationalDataAdapterFactoryResult<T>>;
}

export class SchemaTest<TAdapter extends RelationalDataAdapter> {
  private dataAdapter: TAdapter | null = null;
  private result: RelationalDataAdapterFactoryResult<TAdapter> | null = null;

  constructor(private schema: RelationalSchema,
              private factory: RelationalDataAdapterFactory<TAdapter>) {
  }

  async getDataAdapter(): Promise<TAdapter> {
    if (!this.dataAdapter) {
      this.result = await this.factory.create(this.schema);
      this.dataAdapter = this.result.dataAdapter;
    }
    return this.dataAdapter;
  }

  async getContext(options?: { migrationId?: string, user?: ContextUser }) {
    return this.schema.context(await this.getDataAdapter(), options);
  }

  async close() {
    if (this.result) {
      await this.result.close();
    }
  }
}

// export class TestRunner {
//   private environments: TestRunnerEnvironment[] = [];
//
//   newEnvironment(): TestRunnerEnvironment {
//     const env = new TestRunnerEnvironment();
//     this.environments.push(env);
//     return env;
//   }
//
//   async close(): Promise<any> {
//     for (const env of this.environments) {
//       await env.close();
//     }
//   }
// }
//
// export class TestRunnerEnvironment {
//   private readonly directory: string;
//   private readonly astContext = new AstContext();
//
//   constructor(public relationalDataAdapter: RelationalDataAdapter) {
//     this.directory = path.join(process.cwd(), 'tmp', Math.random().toString(36).substring(2, 15));
//   }
//
//   addFile(file: string, content: string) {
//     fs.writeFileSync(path.join(this.directory, file), content);
//   }
//
//   removeFile(file: string) {
//     fs.unlinkSync(path.join(this.directory, file));
//   }
//
//   async getRelationalContext(options: { schema?: string, user?: ContextUser }) {
//     const schemaLocation = await getSchemaLocation({
//       schema: options ? options.schema : undefined,
//       cwd: this.directory,
//     }, null);
//     const sourceFile = this.astContext.get(schemaLocation.fileName);
//     if (!sourceFile) {
//       throw new Error(`source file ${schemaLocation.fileName} not found`);
//     }
//
//     const schemas = parseSchemas(sourceFile);
//     if (schemas.length === 0) {
//       throw new Error('schema not found');
//     } else if (schemas.length > 1) {
//       throw new Error('multiple schemas found');
//     }
//     const schemaInfo = new SchemaInformation(schemas[0]);
//
//     const migrationTree = schemaInfo.getMigrationTree();
//     const schema = migrationTree.defaultSchema();
//     if (!schema) {
//       throw new Error('no default schema');
//     }
//
//     return new RelationalContext(
//       schema,
//       migrationTree,
//       this.relationalDataAdapter,
//       options ? options.user : null,
//     );
//   }
//
//   runCommand(command: string, options: { timeout?: number }) {
//     const ps = child_process.spawn(command, {cwd: this.directory, timeout: options ? options.timeout : undefined});
//     const statusCodeDefer = new Defer<number>();
//
//     ps.on('close', (code) => {
//       statusCodeDefer.resolve(code);
//     });
//
//     return {
//       statusCode: statusCodeDefer.promise,
//       cancel: () => {
//         ps.kill();
//       },
//     };
//   }
//
//   close() {
//
//   }
// }
