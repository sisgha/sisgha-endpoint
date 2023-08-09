import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Actor } from '../../actor-context/Actor';

export const ResolveRequestActor = createParamDecorator((data: unknown, context: ExecutionContext) => {
  const ctx = GqlExecutionContext.create(context);

  const request = ctx.getContext().req;

  return request.user ?? Actor.forAnonymousEntity();
});
