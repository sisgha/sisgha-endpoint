import { Field, Int, ObjectType } from '@nestjs/graphql';
import { CursoModel } from '../../../../domain/models/curso.model';
import { ModalidadeType } from './modalidade.type';

@ObjectType('Curso')
export class CursoType implements CursoModel {
  @Field(() => Int)
  id!: number;

  // ...

  @Field(() => String)
  nome!: string;

  @Field(() => String)
  nomeAbreviado!: string;

  // ...

  @Field(() => Date)
  dateCreated!: Date;

  @Field(() => Date)
  dateUpdated!: Date;

  @Field(() => Date, { nullable: true })
  dateDeleted!: Date | null;

  @Field(() => Date, { nullable: true })
  dateSearchSync!: Date | null;

  // ...

  @Field(() => ModalidadeType)
  modalidade!: ModalidadeType;
}
