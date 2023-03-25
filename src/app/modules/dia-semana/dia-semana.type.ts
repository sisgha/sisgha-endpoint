import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType('DiaSemana')
export class DiaSemanaType {
  @Field(() => Int)
  id!: number;

  @Field(() => Int)
  ordem!: number;
}
