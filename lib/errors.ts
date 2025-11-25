const errorCode = [
  "bad-request",
  "bad-request/already-followed",
  "not-found",
  "unexpected-error",
] as const;

export type ErrorCode = (typeof errorCode)[number];

export class CustomError extends Error {
  code: ErrorCode;
  constructor(code: ErrorCode, message?: string) {
    super(message ?? "CustomError");
    this.name = "CustomError";
    this.code = code;
  }
}
