export class ApiError extends Error {
  constructor(
    statusCode,
    message = "Internal server error",
    errors = [],
    stack = ""
  ) {
    super(message);
    (this.statusCode = statusCode),
      (this.errors = errors),
      (this.message = message),
      (this.data = null),
      (this.success = false);
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}