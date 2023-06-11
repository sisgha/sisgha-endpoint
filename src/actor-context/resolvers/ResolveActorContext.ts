import { ArgumentMetadata, createParamDecorator, ExecutionContext, Inject, Injectable, PipeTransform } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { DataSource } from 'typeorm';
import { DATA_SOURCE } from '../../database/constants/DATA_SOURCE';
import { Actor } from '../Actor';
import { ActorContext } from '../ActorContext';

const ResolveResourceActionRequest = createParamDecorator((data: unknown, context: ExecutionContext) => {
  const ctx = GqlExecutionContext.create(context);

  const request = ctx.getContext().req;

  const actor = request.user ?? Actor.forPublicReadStrict();

  return actor;
});

@Injectable()
export class ActorContextPipe implements PipeTransform {
  constructor(
    @Inject(DATA_SOURCE)
    private dataSource: DataSource,
  ) {}

  async transform(actor: Actor, _metadata: ArgumentMetadata) {
    const actorContext = new ActorContext(this.dataSource, actor);
    return actorContext;
  }
}

export const ResolveActorContext = (options?: any) => ResolveResourceActionRequest(options, ActorContextPipe);
