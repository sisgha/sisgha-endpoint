import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType('Curso')
export class CursoType {
  @Field(() => Int)
  id!: number;

  @Field(() => String)
  nome!: string;

  @Field(() => String)
  tipo!: string;
}
