export function encodeBase64(val: string) {
  return Buffer.from(val).toString('base64');
}

export function decodeBase64(val: string) {
  return Buffer.from(val, 'base64').toString('utf8');
}
