import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType('Lugar')
export class LugarType {
  @Field(() => Int)
  id!: number;

  @Field(() => String, { nullable: true })
  numero!: string | null;

  @Field(() => String, { nullable: true })
  tipo!: string | null;

  @Field(() => String, { nullable: true })
  descricao!: string | null;
}
