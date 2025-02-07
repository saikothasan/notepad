export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

export class NotFoundError extends ApiError {
  constructor(message = "Resource not found") {
    super(404, message)
    this.name = "NotFoundError"
  }
}

export class BadRequestError extends ApiError {
  constructor(message = "Bad request") {
    super(400, message)
    this.name = "BadRequestError"
  }
}

