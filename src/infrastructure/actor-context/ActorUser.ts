import { IActorUser } from '../../domain/actor';
import { AuthenticatedEntityType, IUsuarioRef } from '../../domain/authentication';
import { Actor } from './Actor';

export class ActorUser extends Actor implements IActorUser {
  usuarioRef: IUsuarioRef;

  readonly type: AuthenticatedEntityType.USER;

  constructor(user: IUsuarioRef) {
    super();

    this.usuarioRef = user;

    this.type = AuthenticatedEntityType.USER;
  }

  static forUserEntity(userId: number) {
    const userRef: IUsuarioRef = { id: userId };
    return new ActorUser(userRef);
  }
}
