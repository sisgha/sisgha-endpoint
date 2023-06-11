import { IActorUserRef } from '../authentication/interfaces/IActorUserRef';
import { ActorUser } from './ActorUser';
import { ActorType } from './interfaces/ActorType';

export class Actor {
  constructor(public readonly type = ActorType.ANON) {}

  static forUser(userId: number) {
    const actorUserRef: IActorUserRef = {
      id: userId,
    };

    return new ActorUser(actorUserRef);
  }

  static forPublicReadStrict() {
    const resourceActionRequest = new Actor(ActorType.ANON);
    return resourceActionRequest;
  }

  static forSystemInternalActions() {
    const resourceActionRequest = new Actor(ActorType.SYSTEM);
    return resourceActionRequest;
  }
}
