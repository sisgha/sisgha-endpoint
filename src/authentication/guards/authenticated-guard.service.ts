import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AuthenticatedGuard extends AuthGuard(['access-token']) {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }

  async canActivate(context: ExecutionContext): Promise<any> {
    const req = this.getRequest(context);

    const hasAuthorizationToken = req.headers.authorization !== undefined;

    if (hasAuthorizationToken) {
      return await Promise.resolve(super.canActivate(context));
    }

    return true;
  }
}
