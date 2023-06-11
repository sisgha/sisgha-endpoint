import { ConstraintJoinMode } from './ConstraintJoinMode';

export type IInterpretedConstraintJoin = {
  mode: ConstraintJoinMode;
  resource: string;
  alias: string;
  on: string;
};
