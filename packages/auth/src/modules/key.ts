import { UserPoolAlgorithm } from '../models/user-pool';
import * as crypto from 'crypto';
import * as jose from 'jose';
import * as path from 'path';
import * as fs from 'fs';
import { Defer } from '@daita/common';
import * as jwt from 'jsonwebtoken';

const keystore = new jose.JWKS.KeyStore([]);
const keysOnDisk = new Promise((resolve, reject) => {
  const keyPath = path.join(process.cwd(), 'keys');
  if (!fs.existsSync(keyPath)) {
    return resolve();
  }
  for (const keyFile of fs.readdirSync(keyPath)) {
    const content = fs.readFileSync(path.join(keyPath, keyFile));
    const key = jose.JWK.asKey(content);
    keystore.add(key);
  }
  resolve();
});

export async function getKeyForId(id: string) {
  await keysOnDisk;
  return keystore.get({ kid: id });
}

export function getKeyAlgorithm(algorithm: UserPoolAlgorithm) {
  switch (algorithm) {
    case 'ES384':
    case 'ES512':
      return 'EC';
    case 'RS384':
    case 'RS512':
      return 'RSA';
  }
}

export async function getKey(algorithm: UserPoolAlgorithm) {
  await keysOnDisk;
  let key = keystore.get({
    kty: getKeyAlgorithm(algorithm),
  });

  if (key) {
    return { id: key.kid, secret: key.toPEM(true) };
  }

  if (algorithm === 'RS384') {
    const rsaKey = crypto.generateKeyPairSync('rsa', { modulusLength: 3072 });
    const rsaKeyPem = rsaKey.privateKey.export({ type: 'pkcs8', format: 'pem' });
    key = jose.JWK.asKey({
      key: rsaKeyPem,
      format: 'pem',
      type: 'pkcs8',
    });
    keystore.add(key);
  } else if (algorithm === 'RS512') {
    const rsaKey = crypto.generateKeyPairSync('rsa', { modulusLength: 4096 });
    const rsaKeyPem = rsaKey.privateKey.export({ type: 'pkcs8', format: 'pem' });
    key = jose.JWK.asKey({
      key: rsaKeyPem,
      format: 'pem',
      type: 'pkcs8',
    });
    keystore.add(key);
  } else if (algorithm === 'ES384') {
    const ecKey = crypto.generateKeyPairSync('ec', { namedCurve: 'secp384r1' });
    const ecKeyPem = ecKey.privateKey.export({ type: 'sec1', format: 'pem' });
    key = jose.JWK.asKey({
      key: ecKeyPem,
      format: 'pem',
      type: 'sec1',
    });
    keystore.add(key);
  } else if (algorithm === 'ES512') {
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
  return { id: key.kid, secret: key.toPEM(true) };
}

export async function getKeys() {
  await keysOnDisk;
  return keystore.toJWKS(false);
}

export async function getAccessToken<T>(payload: any, options: { subject: string, expiresIn: number, issuer: string, algorithm: UserPoolAlgorithm }) {
  const defer = new Defer<string>();
  const key = await getKey(options.algorithm);
  jwt.sign(payload, key.secret, { ...options, keyid: key.id }, (err, encoded) => {
    if (err) {
      return defer.reject(err);
    }
    defer.resolve(encoded);
  });
  return defer.promise;
}
