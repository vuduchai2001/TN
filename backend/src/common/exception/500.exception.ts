import { HttpException, HttpStatus } from '@nestjs/common';

export class CRequestException extends HttpException {
  constructor(
    message: string,
    objectOrError?: string | object | any,
    description = 'Internal Server',
  ) {
    const data = {
      message,
      data: objectOrError,
    };
    super(
      HttpException.createBody(data, description, HttpStatus.INTERNAL_SERVER_ERROR),
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
