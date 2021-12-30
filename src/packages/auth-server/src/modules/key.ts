import * as crypto from 'crypto';
import * as path from 'path';
import * as fs from 'fs';
import * as jose from 'jose';
import { UserPoolAlgorithm } from '@daita/auth';

const keyStores: { [key: string]: Promise<jose.JWKS.KeyStore> } = {};

function getKeystore(userPoolId: string) {
  if (!keyStores[userPoolId]) {
    keyStores[userPoolId] = new Promise((resolve, reject) => {
      try {
        const keystore = new jose.JWKS.KeyStore([]);
        const keyPath = path.join(process.cwd(), 'keys');
        if (!fs.existsSync(keyPath)) {
          return resolve(keystore);
        }
        for (const keyFile of fs.readdirSync(keyPath)) {
          const content = fs.readFileSync(path.join(keyPath, keyFile));
          const key = jose.JWK.asKey(content);
          keystore.add(key);
        }
        resolve(keystore);
      } catch (e) {
        reject(e);
      }
    });
  }
  return keyStores[userPoolId];
}

export async function getKeyForId(userPoolId: string, id: string) {
  const keystore = await getKeystore(userPoolId);
  return keystore.get({ kid: id });
}

export function getKeyAlgorithm(algorithm: UserPoolAlgorithm) {
  switch (algorithm) {
    case 'EC384':
    case 'EC512':
      return 'EC';
    case 'RS256':
    case 'RS384':
    case 'RS512':
      return 'RSA';
  }
}

export async function getKey(userPoolId: string, algorithm: UserPoolAlgorithm): Promise<jose.JWK.Key> {
  const keystore = await getKeystore(userPoolId);
  let key = keystore.get({
    kty: getKeyAlgorithm(algorithm),
  });

  if (key) {
    return key;
  }

  if (algorithm === 'RS256') {
    const rsaKey = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 });
    const rsaKeyPem = rsaKey.privateKey.export({
      type: 'pkcs8',
      format: 'pem',
    });
    key = jose.JWK.asKey({
      key: rsaKeyPem,
      format: 'pem',
      type: 'pkcs8',
    });
    keystore.add(key);
  } else if (algorithm === 'RS384') {
    const rsaKey = crypto.generateKeyPairSync('rsa', { modulusLength: 3072 });
    const rsaKeyPem = rsaKey.privateKey.export({
      type: 'pkcs8',
      format: 'pem',
    });
    key = jose.JWK.asKey({
      key: rsaKeyPem,
      format: 'pem',
      type: 'pkcs8',
    });
    keystore.add(key);
  } else if (algorithm === 'RS512') {
    const rsaKey = crypto.generateKeyPairSync('rsa', { modulusLength: 4096 });
    const rsaKeyPem = rsaKey.privateKey.export({
      type: 'pkcs8',
      format: 'pem',
    });
    key = jose.JWK.asKey({
      key: rsaKeyPem,
      format: 'pem',
      type: 'pkcs8',
    });
    keystore.add(key);
  } else if (algorithm === 'EC384') {
    const ecKey = crypto.generateKeyPairSync('ec', { namedCurve: 'secp384r1' });
    const ecKeyPem = ecKey.privateKey.export({ type: 'sec1', format: 'pem' });
    key = jose.JWK.asKey({
      key: ecKeyPem,
      format: 'pem',
      type: 'sec1',
    });
    keystore.add(key);
  } else if (algorithm === 'EC512') {
    const ecKey = crypto.generateKeyPairSync('ec', { namedCurve: 'secp521r1' });
    const ecKeyPem = ecKey.privateKey.export({ type: 'sec1', format: 'pem' });
    key = jose.JWK.asKey({
      key: ecKeyPem,
      format: 'pem',
      type: 'sec1',
    });
    keystore.add(key);
  } else {
    throw new Error(`unsupported algorithm ${algorithm}`);
  }

  const keyPath = path.join(process.cwd(), 'keys');
  if (!fs.existsSync(keyPath)) {
    fs.mkdirSync(keyPath);
  }
  const keyFile = path.join(keyPath, `${key.kid}.pem`);
  fs.writeFileSync(keyFile, key.toPEM(true));
  return key;
}

export async function getKeys(userPoolId: string) {
  const keystore = await getKeystore(userPoolId);
  return keystore.toJWKS(false);
}

export async function getAccessToken<T>(
  userPoolId: string,
  payload: any,
  options: {
    subject: string;
    expiresIn: number;
    issuer: string;
    algorithm: UserPoolAlgorithm;
  },
): Promise<string> {
  const key = await getKey(userPoolId, options.algorithm);
  return jose.JWT.sign(payload, key, {
    subject: options.subject,
    expiresIn: `${options.expiresIn}s`,
    iat: true,
    algorithm: options.algorithm,
    issuer: options.issuer,
    kid: true,
  });
}
