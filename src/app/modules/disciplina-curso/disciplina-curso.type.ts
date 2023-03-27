import { Field, Int, ObjectType } from '@nestjs/graphql';
import { CursoType } from '../curso/curso.type';
import { DisciplinaType } from '../disciplina/disciplina.type';

@ObjectType('DisciplinaCurso')
export class DisciplinaCursoType {
  @Field(() => Int)
  id!: number;

  @Field(() => DisciplinaType)
  disciplina!: DisciplinaType;

  @Field(() => CursoType)
  curso!: CursoType;
}
