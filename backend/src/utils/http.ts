export class HttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export function assertFound<T>(value: T | null, message = "Resource not found"): T {
  if (!value) {
    throw new HttpError(404, message);
  }

  return value;
}
