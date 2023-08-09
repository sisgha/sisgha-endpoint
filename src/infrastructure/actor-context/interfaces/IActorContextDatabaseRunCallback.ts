import { EntityManager, QueryRunner } from 'typeorm';

export type IActorContextDatabaseRunCallbackPayload = {
  queryRunner: QueryRunner;
  entityManager: EntityManager;
};

export type IActorContextDatabaseRunCallback<T> = (payload: IActorContextDatabaseRunCallbackPayload) => Promise<T>;
