import { AuthenticatedEntityType, IUserRef } from '../authentication';
import { IActor } from './IActor';

export interface IActorUser extends IActor<AuthenticatedEntityType.USER> {
  userRef: IUserRef;
}
