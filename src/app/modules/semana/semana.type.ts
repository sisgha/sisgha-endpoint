import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType('Semana')
export class SemanaType {
  @Field(() => Int)
  id!: number;

  @Field(() => Date)
  dataInicio!: Date;

  @Field(() => Date)
  dataFim!: Date;

  @Field(() => String)
  status!: string;
}
