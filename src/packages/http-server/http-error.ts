export class HttpError extends Error {
  constructor(public statusCode: number, public responseMessage: string) {
    super(`http status error: ${statusCode}, ${responseMessage}`);
  }
}
