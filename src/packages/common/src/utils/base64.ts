export function encodeBase64(val: string) {
  if (typeof window !== 'undefined') {
    return btoa(val);
  } else {
    return new Buffer(val).toString('base64');
  }
}

export function decodeBase64(val: string) {
  if (typeof window !== 'undefined') {
    return atob(val);
  } else {
    return new Buffer(val, 'base64').toString('utf8');
  }
}
