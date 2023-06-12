import { ActorType } from './interfaces/ActorType';

export class Actor {
  constructor(public readonly type = ActorType.ANON) {}

  static forPublicReadStrict() {
    const resourceActionRequest = new Actor(ActorType.ANON);
    return resourceActionRequest;
  }

  static forSystemInternalActions() {
    const resourceActionRequest = new Actor(ActorType.SYSTEM);
    return resourceActionRequest;
  }
}
