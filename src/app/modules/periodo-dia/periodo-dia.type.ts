import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType('PeriodoDia')
export class PeriodoDiaType {
  @Field(() => Int)
  id!: number;

  @Field(() => String)
  horaInicio!: string;

  @Field(() => String)
  horaFim!: string;
}
