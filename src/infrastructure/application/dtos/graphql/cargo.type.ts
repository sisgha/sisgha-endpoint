import { Field, Int, ObjectType } from '@nestjs/graphql';
import { CargoModel } from '../../../../domain/models';

@ObjectType('Cargo')
export class CargoType implements CargoModel {
  @Field(() => Int)
  id!: number;

  // ...

  @Field(() => String)
  slug!: string;

  // ...

  @Field(() => Date)
  dateCreated!: Date;

  @Field(() => Date)
  dateUpdated!: Date;

  @Field(() => Date, { nullable: true })
  dateDeleted!: Date | null;

  @Field(() => Date, { nullable: true })
  dateSearchSync!: Date | null;
}
