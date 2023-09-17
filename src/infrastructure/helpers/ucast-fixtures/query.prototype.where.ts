import { AuthorizationConstraintRecipeConditionSQLValueZod } from '#recipe-guard-core';
import { Query } from '@ucast/sql';

export function where(this: Query, field: string, operator: string, value?: unknown) {
  const fieldParsed = AuthorizationConstraintRecipeConditionSQLValueZod.safeParse(field);

  if (fieldParsed.success) {
    return this.whereRaw(`${this.field(field)} ${operator} ${this.field(fieldParsed.data.$field)}`);
  }

  const sql = `${this.field(field)} ${operator} ${this.param()}`;

  return this.whereRaw(sql, value);
}
