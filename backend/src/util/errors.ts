
class GenericError {
  message: string;
  status: number;
  constructor(message: string, status: number) {
    this.message = message;
    this.status = status;
  }
}

class NotFoundError extends GenericError {
  constructor(message: string) {
    super(message, 404);
  }
}

class NotAuthError extends GenericError {
  constructor(message: string) {
    super(message, 401);
  }
}

export {NotFoundError, NotAuthError};