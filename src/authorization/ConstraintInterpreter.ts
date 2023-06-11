import { allParsingInstructions, MongoQueryParser } from '@ucast/mongo';
import { allInterpreters, createSqlInterpreter } from '@ucast/sql';
import { ConstraintInterpreterContext } from './ConstraintInterpreterContext';
import { IConstraintInterpreterContextOptions, IInterpretedConstraintJoin } from './interfaces';
import { IRawConstraint } from './interfaces/IRawConstraint';

const interpret = createSqlInterpreter({ ...allInterpreters });

const parser = new MongoQueryParser(allParsingInstructions);

export class ConstraintInterpreter {
  constructor(readonly constraintInterpreterContextOptions: IConstraintInterpreterContextOptions = {}) {}

  interpret(constraint: IRawConstraint) {
    const rootAlias = constraint.alias;
    const rootJoins = constraint.joins ?? [];
    const rootCondition = parser.parse(constraint.condition);

    const context = new ConstraintInterpreterContext(constraint, this.constraintInterpreterContextOptions);

    const [interpretedRootSql, interpretedRootParams] = interpret(rootCondition, {
      ...context.dialect,
      rootAlias,
    });

    context.addParams(interpretedRootParams);

    const joins = rootJoins.map((join): IInterpretedConstraintJoin => {
      const joinCondition = parser.parse(join.condition);

      const [interpretedJoinSql, interpretedJoinParams] = interpret(joinCondition, {
        ...context.dialect,
        rootAlias: join.alias,
      });

      context.addParams(interpretedJoinParams);

      return {
        mode: join.mode,
        resource: join.resource,
        alias: join.alias,
        on: interpretedJoinSql,
      };
    });

    const params = Object.fromEntries(Object.entries(context.getParams()));

    return {
      resource: constraint.resource,
      alias: rootAlias,
      condition: interpretedRootSql,
      joins: joins,
      params: params,
    };
  }
}
