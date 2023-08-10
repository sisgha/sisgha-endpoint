import { AuthenticatedEntityType } from '../authentication';

export interface IActor<T extends AuthenticatedEntityType = AuthenticatedEntityType> {
  readonly type: T;
}
