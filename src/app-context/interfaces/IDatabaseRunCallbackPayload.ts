import {EntityManager, QueryRunner} from 'typeorm';

export type IDatabaseRunCallbackPayload = {
  queryRunner: QueryRunner;
  entityManager: EntityManager;
};