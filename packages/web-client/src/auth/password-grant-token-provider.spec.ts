import {PasswordGrantTokenProvider} from './password-grant-token-provider';

describe('password-grant-token-provider', () => {
  it('should return token', async() => {
    const keycloakUri = (process.env.KEYCLOAK_URI || 'http://localhost') + ':8080';
    const provider = new PasswordGrantTokenProvider(`${keycloakUri}/auth/realms/master/protocol/openid-connect/token`, 'admin-cli', 'admin', 'admin');
    const token = await provider.getToken();
    expect(token).not.toBeNull();
    expect(token).not.toBeUndefined();
    provider.close();
  })
});