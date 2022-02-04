export {};
// export interface HttpTestAdapterOptions {
//   adapter: RelationalAdapter<any> & RelationalOrmAdapter;
//   user?: {
//     roles: string[];
//   };
// }
//
// export class HttpTestAdapterImplementation
//   implements RelationalAdapterImplementation<HttpAdapter, any, HttpTestAdapterOptions>
// {
//   getRelationalAdapter(options: HttpTestAdapterOptions): HttpAdapter {
//     let server: Server;
//     let authAdminServer: Server;
//
//     return new HttpAdapter(
//       new Resolvable<Http>(
//         async () => {
//           const port = getRandomTestPort();
//           const authPort = getRandomTestPort();
//
//           const authCtx = getMigrationContext(options.adapter, {
//             schema: authSchema,
//           });
//           await authCtx.migrate();
//           await seedUserPool(options.adapter, {
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
//           await seedPoolUser(options.adapter, {
//             username: 'test',
//             disabled: false,
//             userPoolId: 'test',
//             password: '123456', // TODO hash
//           });
//           for (const role of options?.user?.roles || []) {
//             await seedRoles(options.adapter, {
//               userPoolId: 'test',
//               name: role,
//             });
//             await seedUserRole(options.adapter, {
//               userUsername: 'test',
//               roleUserPoolId: 'test',
//               roleName: role,
//             });
//           }
//           const token = await createToken(options.adapter, {
//             name: 'test',
//             userPoolId: 'test',
//             username: 'test',
//           });
//
//           // authServer = await createAuthApp(options.context, authPort);
//           authAdminServer = await createAuthAdminApp(options.adapter, authPort);
//           server = await createHttpServerApp(
//             {
//               relational: {
//                 dataAdapter: options.adapter,
//                 enableTransactions: true,
//                 transactionTimeout: 2000,
//               },
//               authorization: {
//                 providers: [],
//                 rules: 'disabled',
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
//         },
//       ),
//     );
//   }
// }
//
// export const httpTestAdapter = new HttpTestAdapterImplementation();
