export function encodeBase64(val: string) {
  return new Buffer(val).toString('base64');
}

export function decodeBase64(val: string) {
  return new Buffer(val, 'base64').toString('utf8');
}
