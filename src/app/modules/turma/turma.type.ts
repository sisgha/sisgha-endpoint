import { Field, Int, ObjectType } from '@nestjs/graphql';
import { CursoType } from '../curso/curso.type';
import { LugarType } from '../lugar/lugar.type';

@ObjectType('Turma')
export class TurmaType {
  @Field(() => Int)
  id!: number;

  @Field(() => String)
  periodo!: string;

  @Field(() => String, { nullable: true })
  turno!: string | null;

  @Field(() => CursoType)
  curso!: CursoType;

  @Field(() => LugarType, { nullable: true })
  lugarPadrao!: LugarType | null;
}
