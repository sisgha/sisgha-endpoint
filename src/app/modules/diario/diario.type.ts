import { Field, Int, ObjectType } from '@nestjs/graphql';
import { DisciplinaType } from '../disciplina/disciplina.type';
import { TurmaType } from '../turma/turma.type';

@ObjectType('Diario')
export class DiarioType {
  @Field(() => Int)
  id!: number;

  @Field(() => TurmaType)
  turma!: TurmaType;

  @Field(() => DisciplinaType)
  disciplina!: DisciplinaType;
}
