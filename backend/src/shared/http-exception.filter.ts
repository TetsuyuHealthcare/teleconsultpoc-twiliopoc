import { Catch, ExceptionFilter, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const exceptionStatus: number = exception.getStatus();
    const exceptionResponse: any = exception.getResponse();

    const errorResponse = {
      path: request.url,
      method: request.method,
      status: exceptionStatus,
      message: typeof exceptionResponse === 'object' ? exceptionResponse.message : exceptionResponse,
      errors: typeof exceptionResponse === 'object' ? exceptionResponse.errors : {},
    };
    Logger.error(`${request.method} ${request.url}`, JSON.stringify(errorResponse), 'HttpExceptionFilter');
    response.status(exceptionStatus).json(errorResponse);
  }
}
