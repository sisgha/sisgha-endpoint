import { AuthenticatedEntityType } from '../authentication';

export interface IActor {
  readonly type: AuthenticatedEntityType;
}
