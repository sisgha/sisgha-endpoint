import { DataSource, EntityManager, QueryRunner } from 'typeorm';
import { ResourceActionRequest } from '../auth/interfaces/ResourceActionRequest';
import { ResourceActionRequestRole } from '../auth/interfaces/ResourceActionRequestRole';

type IDatabaseRunCallbackPayload = {
  queryRunner: QueryRunner;
  entityManager: EntityManager;
};

type IDatabaseRunCallback<T> = (
  payload: IDatabaseRunCallbackPayload,
) => Promise<T>;

export class AppContext {
  constructor(
    public readonly dataSource: DataSource,
    public readonly resourceActionRequest: ResourceActionRequest,
  ) {}

  databaseRun<T>(callback: IDatabaseRunCallback<T>): Promise<T> {
    const { dataSource, resourceActionRequest } = this;

    return dataSource.transaction(async (entityManager) => {
      const queryRunner = entityManager.queryRunner!;

      switch (resourceActionRequest.role) {
        case ResourceActionRequestRole.AUTHENTICATED: {
          const user = resourceActionRequest.user;

          if (user) {
            await queryRunner.query(`set local role authenticated;`);

            await queryRunner.query(
              `set local "request.auth.role" to 'authenticated';`,
            );

            await queryRunner.query(
              `set local "request.auth.user.id" to ${user.id};`,
            );

            break;
          }
        }

        case ResourceActionRequestRole.SYSTEM: {
          break;
        }

        case ResourceActionRequestRole.ANON:
        default: {
          await queryRunner.manager.query(`set local role anon;`);

          await queryRunner.manager.query(
            `set local "request.auth.role" to 'anon';`,
          );

          break;
        }
      }

      return callback({ entityManager, queryRunner });
    });
  }
}
