import { HttpException, HttpStatus } from '@nestjs/common';

export class CBadRequestException extends HttpException {
  constructor(message: string, objectOrError?: string | object | any, description = 'Bad request') {
    const data = {
      message,
      data: objectOrError,
    };
    super(
      HttpException.createBody(data, description, HttpStatus.BAD_REQUEST),
      HttpStatus.BAD_REQUEST,
    );
  }
}
