import { IRawConstraintCondition } from './IRawConstraintCondition';
import { IRawConstraintJoin } from './IRawConstraintJoin';

export type IRawConstraint =
  | boolean
  | {
      // resource: string;
      alias: string;
      condition: IRawConstraintCondition;
      joins: IRawConstraintJoin[];
    };
