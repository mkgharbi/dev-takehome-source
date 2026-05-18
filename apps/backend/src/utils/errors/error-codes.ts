/**
 * Application error codes. Each code maps to:
 *  - an HTTP status (see error-definitions.ts)
 *  - a default user-facing message (translated in Certalis prod via i18n;
 *    here we keep a French string inline for simplicity).
 */
export const ErrorCode = {
  BadRequest: "BAD_REQUEST",
  Unauthorized: "UNAUTHORIZED",
  Forbidden: "FORBIDDEN",
  NotFound: "NOT_FOUND",
  Conflict: "CONFLICT",
  ValidationError: "VALIDATION_ERROR",
  InternalServerError: "INTERNAL_SERVER_ERROR",

  BookingAlreadyExists: "BOOKING_ALREADY_EXISTS",
  TrainingSessionNotFound: "TRAINING_SESSION_NOT_FOUND",
  TrainerNotFound: "TRAINER_NOT_FOUND",
} as const;

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];
