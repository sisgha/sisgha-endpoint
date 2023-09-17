import { IAuthorizationConstraintInterpreterSQLContextOptions } from '#recipe-guard-core';
import { pg } from '@ucast/sql';

export const authorizationConstraintInterpreterSQLContextOptions: IAuthorizationConstraintInterpreterSQLContextOptions = {
  dbDialect: {
    ...pg,
  },
};
