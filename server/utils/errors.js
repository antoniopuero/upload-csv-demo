export class NotFound extends Error {
  constructor(msg) {
    super(msg);
    this.message = msg || 'Not Found';
    this.status = 404;
    Error.captureStackTrace(this);
  }
}

export class BadRequest extends Error {
  constructor(msg, errors) {
    if (!errors) {
      errors = [{ field: 'message', message: msg }];
    }
    super(msg);
    this.message = msg || 'Bad Request';
    this.errors = errors;
    this.status = 400;
    Error.captureStackTrace(this);
  }
}
