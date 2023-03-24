import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType('Cargo')
export class CargoType {
  @Field(() => Int)
  id!: number;

  @Field(() => String)
  slug!: string;
}
