export class ConnectionError extends Error {
  constructor(public database: string, public originalError: Error) {
    super(`unable to connect to database ${database}`);
  }
}
