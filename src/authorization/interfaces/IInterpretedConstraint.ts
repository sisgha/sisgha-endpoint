import { IInterpretedConstraintJoin } from './IInterpretedConstraintJoin';

export type IInterpretedConstraint = {
  resource: string;
  alias: string;

  condition: string;

  joins: IInterpretedConstraintJoin[];
  params: Record<string, unknown>;
};
