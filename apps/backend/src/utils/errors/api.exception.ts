import { HttpException } from "@nestjs/common";

import { ErrorCode } from "./error-codes";
import { errorDefinition } from "./error-definitions";

export class ApiException extends HttpException {
  public readonly errorCode: ErrorCode;
  public readonly errorContext?: object;

  static with(errorCode: ErrorCode, errorContext?: object): never {
    const exception = new ApiException(errorCode, errorContext);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(exception, ApiException.with);
    }

    throw exception;
  }

  private constructor(errorCode: ErrorCode, errorContext?: object) {
    const def = errorDefinition[errorCode];
    super({ errorCode, message: def.message }, def.status);
    this.errorCode = errorCode;
    this.errorContext = errorContext;
    this.name = `ApiException:${errorCode}`;
  }
}
