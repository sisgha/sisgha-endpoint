import { Catch, HttpException } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';

@Catch(HttpException)
export class HttpExceptionFilter implements GqlExceptionFilter {
  catch(exception: HttpException /*, host: ArgumentsHost */) {
    // const _gqlHost = GqlArgumentsHost.create(host);
    return exception;
  }
}
