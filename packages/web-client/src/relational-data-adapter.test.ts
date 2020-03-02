import {RelationalDataAdapterFactory} from '@daita/core/dist/test/test-utils';
import {Defer, RelationalDataAdapter, RelationalSchema} from '@daita/core';
import {RelationalMigrationAdapter} from '@daita/core/dist/adapter/relational-migration-adapter';
import {SocketRelationalAdapter} from './socket/socket-relational-adapter';
import {ApiRelationalAdapter} from './api/api-relational-adapter';
import {openIdTokenProvider} from '@daita/web/dist/auth/openid-token-provider';
import {RelationalUserProvider} from '@daita/web/dist/auth/relational-user-provider';
import {PasswordGrantTokenProvider} from './auth/password-grant-token-provider';
import {getApp} from '@daita/web';
import {AuthProvider} from './auth/auth-provider';


export class WebDataAdapterFactory<T extends RelationalDataAdapter> implements RelationalDataAdapterFactory<T> {
  constructor(private relationalDataAdapterFactory: RelationalDataAdapterFactory<RelationalMigrationAdapter>,
              private webAdapterFactory: (port: number, auth: AuthProvider) => T) {
  }

  async create(schema: RelationalSchema) {
    const backendResult = await this.relationalDataAdapterFactory.create(schema);
    const userProvider = new RelationalUserProvider(backendResult.dataAdapter);
    const keycloakUri = (process.env.KEYCLOAK_URI || 'http://localhost') + ':8080';
    const tokenProvider = openIdTokenProvider({
      uri: `${keycloakUri}/auth/realms/master`,
      clientId: 'daita',
      clientSecret: '',
    });

    const server = getApp({
      type: 'schema',
      dataAdapter: backendResult.dataAdapter,
      schema: schema,
      transactionTimeout: 1000,
      auth: {
        tokenProvider,
        userProvider,
      },
    });

    const clientTokenProvider = new PasswordGrantTokenProvider(`${keycloakUri}/auth/realms/master/protocol/openid-connect/token`, 'daita', 'admin', 'admin');
    const adminToken = await clientTokenProvider.getToken();
    if (!adminToken) {
      throw new Error('unable to get admin token');
    }
    const adminPayload = await tokenProvider.verify(adminToken);
    const adminUser = await userProvider.get(adminPayload);
    console.log(adminUser);
    await userProvider.addRole('provider');
    await userProvider.addUserRole(adminUser.id, 'provider');

    if (backendResult.dataAdapter.isKind('migration')) {
      const backendContext = schema.context(backendResult.dataAdapter as RelationalMigrationAdapter);
      await backendContext.applyMigrations();
    }

    const port = 3000 + Math.round(Math.random() * 1000);
    const defer = new Defer();
    server.listen(port, () => defer.resolve());
    await defer.promise;

    const dataAdapter = this.webAdapterFactory(port, clientTokenProvider);

    return {
      dataAdapter,
      close: async () => {
        const closeDefer = new Defer();
        server.close(closeDefer.resolve);
        await closeDefer.promise;

        await backendResult.close();
      },
    };
  }
}

export class SocketDataAdapterFactory extends WebDataAdapterFactory<SocketRelationalAdapter> {
  constructor(relationalDataAdapterFactory: RelationalDataAdapterFactory<RelationalMigrationAdapter>) {
    super(relationalDataAdapterFactory, port => new SocketRelationalAdapter(`http://localhost:${port}`));
  }
}

export class ApiDataAdapterFactory extends WebDataAdapterFactory<ApiRelationalAdapter> {
  constructor(relationalDataAdapterFactory: RelationalDataAdapterFactory<RelationalMigrationAdapter>) {
    super(relationalDataAdapterFactory, (port, auth) => new ApiRelationalAdapter(`http://localhost:${port}`, {
      auth: auth,
    }));
  }
}