import { Field, Int, ObjectType } from '@nestjs/graphql';
import { TurmaType } from '../turma/turma.type';
import { TurnoAulaType } from '../turno-aula/turno-aula.type';

@ObjectType('TurmaHasTurnoAula')
export class TurmaHasTurnoAulaType {
  @Field(() => Int)
  id!: number;

  @Field(() => TurmaType)
  turma!: TurmaType;

  @Field(() => TurnoAulaType)
  turnoAula!: TurnoAulaType;
}
