export class IdGenerator {
  constructor(private characters =
                'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
              private length = 12) {

  }

  next() {
    let result = '';
    for (let i = 0; i < this.length; i++) {
      result += this.characters.charAt(
        Math.floor(Math.random() * this.characters.length),
      );
    }
    return result;
  }
}
