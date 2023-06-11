import { DialectOptions, pg } from '@ucast/sql';
import { IConstraintInterpreterContextOptions } from './interfaces';
import { IRawConstraint } from './interfaces/IRawConstraint';

export class ConstraintInterpreterContext {
  #paramCounter = 0;

  #allParams: unknown[] = [];

  dbDialect: DialectOptions;

  get dialect() {
    return {
      ...this.dbDialect,
      escapeField: this.escapeField,
      joinRelation: this.joinRelation,
      paramPlaceholder: this.paramPlaceholder,
    };
  }

  constructor(readonly constraint: IRawConstraint, readonly options: IConstraintInterpreterContextOptions = {}) {
    const { dbDialect = pg } = options;
    this.dbDialect = dbDialect;
  }

  getParams = () => Array.from(this.#allParams);

  paramPlaceholder = () => {
    const targetIndex = this.#paramCounter++;
    return this.dbDialect.paramPlaceholder(targetIndex);
  };

  addParams = (params: unknown[]) => {
    this.#allParams.push(...params);
  };

  escapeField = (field: string) => {
    if (['public', 'auth_user_id()'].includes(field)) {
      return field;
    }

    return this.dbDialect.escapeField(field);
  };

  joinRelation = (entity: string) => {
    const constraint = this.constraint;

    const rootAlias = constraint.alias;
    const rootJoins = constraint.joins ?? [];

    const allEntitiesAliases = [
      // ...
      'public',
      rootAlias,
      ...rootJoins.map((i) => i.alias),
    ];

    return allEntitiesAliases.includes(entity);
  };
}
