import { IActorUser } from '../../domain/actor';
import { AuthenticatedEntityType, IUserRef } from '../../domain/authentication';
import { Actor } from './Actor';

export class ActorUser extends Actor implements IActorUser {
  userRef: IUserRef;

  readonly type: AuthenticatedEntityType.USER;

  constructor(user: IUserRef) {
    super();

    this.userRef = user;

    this.type = AuthenticatedEntityType.USER;
  }

  static forUserEntity(userId: number) {
    const userRef: IUserRef = { id: userId };
    return new ActorUser(userRef);
  }
}
