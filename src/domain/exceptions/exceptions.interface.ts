export interface ExceptionsInterface {
  message: string;
  code_error?: number;
}

export interface IException {
  internalServerErrorException(data: ExceptionsInterface): void;

  badRequestException(data: ExceptionsInterface): void;

  forbiddenException(data: ExceptionsInterface): void;

  unauthorizedException(data: ExceptionsInterface): void;
}
