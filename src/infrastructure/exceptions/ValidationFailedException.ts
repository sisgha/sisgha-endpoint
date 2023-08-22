import { UnprocessableEntityException } from '@nestjs/common';

export type IValidationFailedExceptionResponse = {
  code: string;
  message: string;
  errors: any[];
};

export class ValidationFailedException extends UnprocessableEntityException {
  constructor(errors: any[]) {
    const response: IValidationFailedExceptionResponse = {
      code: 'validation-failed',
      message: 'Validation failed',
      errors: errors,
    };
    super(response);
  }
}
