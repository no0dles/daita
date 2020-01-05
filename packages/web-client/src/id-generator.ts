export class IdGenerator {
  private characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  next() {
    let result = '';
    for (let i = 0; i < 12; i++) {
      result += this.characters.charAt(
        Math.floor(Math.random() * this.characters.length),
      );
    }
    return result;
  }
}