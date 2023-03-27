import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType('Professor')
export class ProfessorType {
  @Field(() => Int)
  id!: number;

  @Field(() => String)
  nome!: string;
}
