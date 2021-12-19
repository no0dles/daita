export {};
// import { getRandomTestPort, NodeHttp } from '@daita/node';
// import { Server } from 'http';
// import { Http } from '@daita/http';
// import { createHttpServerApp } from '@daita/http-server';
// import { RelationalMigrationAdapter } from '@daita/orm';
// import { MigrationContext } from '@daita/orm';
// import { RelationalMigrationAdapterImplementation } from '@daita/orm';
// import { Resolvable } from '@daita/common';
// import { HttpMigrationAdapter } from '@daita/http-adapter';
//
// export interface HttpTestAdapterOptions {
//   context: MigrationContext<any>;
//   user?: {
//     roles: string[];
//   };
// }
//
// export class HttpTestAdapterImplementation
//   implements RelationalMigrationAdapterImplementation<any, HttpTestAdapterOptions>
// {
//   getRelationalAdapter(options: HttpTestAdapterOptions): RelationalMigrationAdapter<any> {
//     let server: Server;
//     let authAdminServer: Server;
//
//     return new HttpMigrationAdapter(
//       new Resolvable<Http>(
//         async () => {
//           const port = getRandomTestPort();
//           const authPort = getRandomTestPort();
//
//           const authCtx = options.context.forSchema(authSchema.getMigrations());
//           await authCtx.migrate();
//           await seedUserPool(authCtx, {
//             id: 'test',
//             accessTokenExpiresIn: 3600,
//             algorithm: 'RS256',
//             allowRegistration: false,
//             checkPasswordForBreach: false,
//             emailVerifyExpiresIn: 3600,
//             name: 'Test',
//             passwordRegex: undefined,
//             refreshRefreshExpiresIn: 3600,
//           });
//           await seedPoolUser(authCtx, {
//             username: 'test',
//             disabled: false,
//             userPoolId: 'test',
//             password: '123456',
//           });
//           for (const role of options?.user?.roles || []) {
//             await seedRoles(authCtx, {
//               userPoolId: 'test',
//               name: role,
//             });
//             await seedUserRole(authCtx, {
//               userUsername: 'test',
//               roleUserPoolId: 'test',
//               roleName: role,
//             });
//           }
//           const token = await createToken(authCtx, {
//             name: 'test',
//             userPoolId: 'test',
//             username: 'test',
//           });
//
//           // authServer = await createAuthApp(options.context, authPort);
//           authAdminServer = await createAuthAdminApp(options.context, authPort);
//           server = await createHttpServerApp(
//             {
//               relational: {
//                 context: options.context,
//                 enableTransactions: true,
//                 transactionTimeout: 2000,
//               },
//               authorization: {
//                 providers: [],
//                 tokenEndpoints: [{ issuer: 'test', uri: `http://localhost:${authPort}` }],
//               },
//               cors: true,
//             },
//             port,
//           );
//
//           const http = new NodeHttp(`http://localhost:${port}`, { token });
//           return http;
//         },
//         () => {
//           server?.close();
//           authAdminServer?.close();
//           options.context.close();
//         },
//       ),
//     );
//   }
// }
//
// export const testAdapter = new HttpTestAdapterImplementation();
