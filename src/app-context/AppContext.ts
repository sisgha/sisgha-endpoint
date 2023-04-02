import { ForbiddenException } from '@nestjs/common';
import { DataSource, QueryFailedError } from 'typeorm';
import { ResourceActionRequest } from '../auth/interfaces/ResourceActionRequest';
import { ResourceActionRequestRole } from '../auth/interfaces/ResourceActionRequestRole';
import { IDatabaseRunCallback } from './interfaces/IDatabaseRunCallback';

export class AppContext {
  constructor(
    public readonly dataSource: DataSource,
    public readonly resourceActionRequest: ResourceActionRequest,
  ) {}

  async databaseRun<T>(callback: IDatabaseRunCallback<T>): Promise<T> {
    const { dataSource, resourceActionRequest } = this;

    try {
      const result = await dataSource.transaction(async (entityManager) => {
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

      return result;
    } catch (error) {
      if (error instanceof QueryFailedError) {
        const postgresError = error as any;

        if (['42501'].includes(postgresError.code)) {
          // This is a row-level security policy violation error

          throw new ForbiddenException(
            'Cannot perform this operation due to row-level security policy.',
          );
        }
      }

      throw error;
    }
  }
}
