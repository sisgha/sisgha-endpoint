import { IActor } from '../../domain/actor';
import { AuthenticatedEntityType } from '../../domain/authentication';

export class Actor implements IActor {
  constructor(
    // ...
    readonly type: AuthenticatedEntityType = AuthenticatedEntityType.ANON,
  ) {}

  static forAnonymousEntity() {
    return new Actor(AuthenticatedEntityType.ANON);
  }

  static forSystemEntity() {
    return new Actor(AuthenticatedEntityType.SYSTEM);
  }
}
