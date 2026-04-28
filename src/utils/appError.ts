export class AppError extends Error {
  public code: string;
  public statusCode: number;

  constructor(message: string, code: string, statusCode = 400) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
  }
}