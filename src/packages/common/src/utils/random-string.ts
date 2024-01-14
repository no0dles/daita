const allChars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');
const uuidChars = '0123456789ABCDEF'.split('');

export function randomString(length: number, chars = allChars) {
  let id = '';
  for (let i = 0; i < length; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

export function randomUuid() {
  return `${randomString(8, uuidChars)}-${randomString(4, uuidChars)}-${randomString(4, uuidChars)}-${randomString(
    4,
    uuidChars,
  )}-${randomString(12, uuidChars)}`;
}

export function randomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min;
}
