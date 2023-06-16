import { Query } from '@ucast/sql';
import { ZodConstraintConditionSQLValue } from '../../dtos/ZodConstraintConditionSQLValue';

export function where(this: Query, field: string, operator: string, value?: unknown) {
  const fieldParsed = ZodConstraintConditionSQLValue.safeParse(field);

  if (fieldParsed.success) {
    return this.whereRaw(`${this.field(field)} ${operator} ${this.field(fieldParsed.data.$field)}`);
  }

  const sql = `${this.field(field)} ${operator} ${this.param()}`;

  return this.whereRaw(sql, value);
}
