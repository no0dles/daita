const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');
const eventIdLength = 22;

export function generateRandomId() {
  let id = '';
  for (let i = 0; i < eventIdLength; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}
