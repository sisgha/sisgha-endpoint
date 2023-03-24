import {
  ArgumentMetadata,
  createParamDecorator,
  ExecutionContext,
  Inject,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { DataSource } from 'typeorm';
import { ResourceActionRequest } from '../auth/interfaces/ResourceActionRequest';
import { DATA_SOURCE } from '../database/constants/DATA_SOURCE';
import { AppContext } from './AppContext';

@Injectable()
export class AppContextPipe implements PipeTransform {
  constructor(
    @Inject(DATA_SOURCE)
    private dataSource: DataSource,
  ) {}

  async transform(value: ResourceActionRequest, metadata: ArgumentMetadata) {
    const appContext = new AppContext(this.dataSource, value);
    return appContext;
  }
}

const ResolveResourceActionRequest = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);

    const request = ctx.getContext().req;

    const resourceActionRequest =
      request.user ?? ResourceActionRequest.forPublicReadStrict();

    return resourceActionRequest;
  },
);

export const ResolveAppContext = (options?: any) =>
  ResolveResourceActionRequest(options, AppContextPipe);
