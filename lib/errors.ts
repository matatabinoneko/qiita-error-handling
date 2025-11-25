export const errorCode = [
  // common error codes
  "bad-request",
  "not-found",
  "unexpected-error",

  // for /api/user/[userId]/follow route
  "bad-request/already-followed", 
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
