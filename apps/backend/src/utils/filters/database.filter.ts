import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { Response } from "express";
import { QueryFailedError, TypeORMError, EntityNotFoundError } from "typeorm";

import { ErrorCode } from "../errors/error-codes";
import { errorDefinition } from "../errors/error-definitions";

/**
 * Translates TypeORM errors into the standard ApiErrorResponse shape.
 * - findOneOrFail miss → 404 NotFound
 * - SQLite UNIQUE violation on booking (sessionId, attendeeEmail) → 409 BOOKING_ALREADY_EXISTS
 * - CHECK constraint failure → 422 ValidationError
 * - anything else → 500 InternalServerError
 */
@Catch(TypeORMError)
export class DatabaseExceptionFilter implements ExceptionFilter {
  catch(exception: TypeORMError, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
    const message = exception.message ?? "";

    let errorCode: ErrorCode = ErrorCode.InternalServerError;
    let errorContext: object | undefined;

    if (exception instanceof EntityNotFoundError) {
      errorCode = ErrorCode.NotFound;
      errorContext = { reason: message };
    } else if (exception instanceof QueryFailedError) {
      if (message.includes("UNIQUE constraint failed")) {
        errorCode = message.includes("attendeeEmail")
          ? ErrorCode.BookingAlreadyExists
          : ErrorCode.Conflict;
      } else if (message.includes("CHECK constraint failed")) {
        errorCode = ErrorCode.ValidationError;
        errorContext = { reason: message };
      }
    }

    const def = errorDefinition[errorCode];
    response.status(def.status).json({
      errorCode,
      statusCode: def.status,
      message: def.message,
      ...(errorContext ? { errorContext } : {}),
    });
  }
}
