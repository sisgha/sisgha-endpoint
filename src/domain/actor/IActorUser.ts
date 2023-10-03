import { AuthenticatedEntityType, IUsuarioRef } from '../authentication';
import { IActor } from './IActor';

export interface IActorUser extends IActor<AuthenticatedEntityType.USER> {
  usuarioRef: IUsuarioRef;
}
