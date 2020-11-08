const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');
const eventIdLength = 22;

export function randomString(length: number = eventIdLength) {
  let id = '';
  for (let i = 0; i < eventIdLength; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}
export function randomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min;
}
