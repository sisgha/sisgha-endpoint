import { ConstraintJoinMode } from './ConstraintJoinMode';
import { IRawConstraintCondition } from './IRawConstraintCondition';

export type IRawConstraintJoin = {
  mode: ConstraintJoinMode;

  resource: string;
  alias: string;

  condition: IRawConstraintCondition;
};
