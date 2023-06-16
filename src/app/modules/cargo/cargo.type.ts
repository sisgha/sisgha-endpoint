import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType('Cargo')
export class CargoType {
  @Field(() => Int)
  id!: number;

  // ...

  @Field(() => String)
  slug!: string;

  //

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;

  @Field(() => Date, { nullable: true })
  deletedAt!: Date | null;

  @Field(() => Date, { nullable: true })
  searchSyncAt!: Date | null;

  // ...

  // @Field(() => [PermissaoType])
  // permissoes!: Permissao[];
}
