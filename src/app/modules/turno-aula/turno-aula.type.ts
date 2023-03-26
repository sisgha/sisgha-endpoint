import { Field, Int, ObjectType } from '@nestjs/graphql';
import { DiaSemanaType } from '../dia-semana/dia-semana.type';
import { PeriodoDiaType } from '../periodo-dia/periodo-dia.type';

@ObjectType('TurnoAula')
export class TurnoAulaType {
  @Field(() => Int)
  id!: number;

  @Field(() => DiaSemanaType)
  diaSemana!: DiaSemanaType;

  @Field(() => PeriodoDiaType)
  periodoDia!: PeriodoDiaType;
}
