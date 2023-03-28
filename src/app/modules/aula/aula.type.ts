import { Field, Int, ObjectType } from '@nestjs/graphql';
import { DiarioType } from '../diario/diario.type';
import { LugarType } from '../lugar/lugar.type';
import { SemanaType } from '../semana/semana.type';
import { TurnoAulaType } from '../turno-aula/turno-aula.type';

@ObjectType('Aula')
export class AulaType {
  @Field(() => Int)
  id!: number;

  @Field(() => DiarioType)
  diario!: DiarioType;

  @Field(() => SemanaType, { nullable: true })
  semana!: SemanaType | null;

  @Field(() => TurnoAulaType, { nullable: true })
  turnoAula!: TurnoAulaType | null;

  @Field(() => LugarType, { nullable: true })
  lugar!: LugarType | null;
}
