import { IDatabaseRunCallbackPayload } from './IDatabaseRunCallbackPayload';

export type IDatabaseRunCallback<T> = (
  payload: IDatabaseRunCallbackPayload,
) => Promise<T>;