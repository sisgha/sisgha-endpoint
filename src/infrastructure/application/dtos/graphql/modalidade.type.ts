import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ModalidadeModel } from '../../../../domain/models';
import { CursoType } from './curso.type';

@ObjectType('Modalidade')
export class ModalidadeType implements ModalidadeModel {
  @Field(() => Int)
  id!: number;

  // ...

  @Field(() => String)
  slug!: string;

  @Field(() => String)
  nome!: string;

  // ...

  @Field(() => Date)
  dateCreated!: Date;

  @Field(() => Date)
  dateUpdated!: Date;

  @Field(() => Date, { nullable: true })
  dateDeleted!: Date | null;

  @Field(() => Date, { nullable: true })
  dateSearchSync!: Date | null;

  //

  cursos!: CursoType[];
}
