import { IActorUser } from '../../domain/actor';
import { AuthenticatedEntityType, IUserRef } from '../../domain/authentication';
import { Actor } from './Actor';

export class ActorUser extends Actor implements IActorUser {
  userRef: IUserRef;

  constructor(user: IUserRef) {
    super(AuthenticatedEntityType.USER);
    this.userRef = user;
  }

  static forUserEntity(userId: number) {
    const userRef: IUserRef = { id: userId };
    return new ActorUser(userRef);
  }
}
