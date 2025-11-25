// カスタムエラークラス

export class BadRequestError extends Error {
  constructor(message: string = "Bad Request") {
    super(message);
    this.name = "BadRequestError";
  }
}

export class NotFoundError extends Error {
  constructor(message: string = "Not Found") {
    super(message);
    this.name = "NotFoundError";
  }
}

export class UnexpectedError extends Error {
  constructor(message: string = "Unexpected Error") {
    super(message);
    this.name = "UnexpectedError";
  }
}

export class BadRequestAlreadyFollowedError extends Error {
  constructor(message: string = "Bad Request Already Followed") {
    super(message);
    this.name = "BadRequestAlreadyFollowedError";
  }
}

