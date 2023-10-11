import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ModalidadeModel } from '../../../../domain/models';

@ObjectType('Modalidade')
export class ModalidadeType implements ModalidadeModel {
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
