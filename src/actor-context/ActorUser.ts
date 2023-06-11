import { IActorUserRef } from 'src/authentication/interfaces/IActorUserRef';
import { Actor } from './Actor';
import { ActorType } from './interfaces';

export class ActorUser extends Actor {
  user: IActorUserRef;

  constructor(user: IActorUserRef) {
    super(ActorType.USER);
    this.user = user;
  }
}
