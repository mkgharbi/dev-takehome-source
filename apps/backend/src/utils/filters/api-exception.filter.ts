import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Response } from "express";

import { ApiException } from "../errors/api.exception";
import { ErrorCode } from "../errors/error-codes";
import { errorDefinition } from "../errors/error-definitions";

type ApiErrorResponse = {
  errorCode: ErrorCode;
  statusCode: number;
  message: string;
  errorContext?: object;
};

const HTTP_STATUS_TO_ERROR_CODE: Record<number, ErrorCode> = {
  [HttpStatus.UNAUTHORIZED]: ErrorCode.Unauthorized,
  [HttpStatus.FORBIDDEN]: ErrorCode.Forbidden,
  [HttpStatus.NOT_FOUND]: ErrorCode.NotFound,
  [HttpStatus.BAD_REQUEST]: ErrorCode.BadRequest,
  [HttpStatus.CONFLICT]: ErrorCode.Conflict,
  [HttpStatus.UNPROCESSABLE_ENTITY]: ErrorCode.ValidationError,
};

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();

    if (exception instanceof ApiException) {
      const def = errorDefinition[exception.errorCode];
      const body: ApiErrorResponse = {
        errorCode: exception.errorCode,
        statusCode: def.status,
        message: def.message,
        ...(exception.errorContext ? { errorContext: exception.errorContext } : {}),
      };
      response.status(def.status).json(body);
      return;
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const errorCode =
        HTTP_STATUS_TO_ERROR_CODE[status] ?? ErrorCode.InternalServerError;
      const def = errorDefinition[errorCode];
      const raw = exception.getResponse();
      const rawMessage =
        typeof raw === "string"
          ? raw
          : (raw as { message?: string }).message ?? def.message;

      const body: ApiErrorResponse = {
        errorCode,
        statusCode: status,
        message: rawMessage,
      };
      response.status(status).json(body);
      return;
    }

    const def = errorDefinition[ErrorCode.InternalServerError];
    const body: ApiErrorResponse = {
      errorCode: ErrorCode.InternalServerError,
      statusCode: def.status,
      message: def.message,
    };
    response.status(def.status).json(body);
  }
}
