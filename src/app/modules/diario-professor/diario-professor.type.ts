import { Field, Int, ObjectType } from '@nestjs/graphql';
import { DiarioType } from '../diario/diario.type';
import { ProfessorType } from '../professor/professor.type';

@ObjectType('DiarioProfessor')
export class DiarioProfessorType {
  @Field(() => Int)
  id!: number;

  @Field(() => ProfessorType)
  professor!: ProfessorType;

  @Field(() => DiarioType)
  diario!: DiarioType;
}
