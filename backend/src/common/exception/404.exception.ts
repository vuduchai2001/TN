import { HttpException, HttpStatus } from '@nestjs/common';

export class CNotFoundException extends HttpException {
  constructor(message: string, objectOrError?: string | object | any, description = 'Not found') {
    const data = {
      message,
      data: objectOrError,
    };
    super(HttpException.createBody(data, description, HttpStatus.NOT_FOUND), HttpStatus.NOT_FOUND);
  }
}
