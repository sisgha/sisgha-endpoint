import { Field, Int, ObjectType } from '@nestjs/graphql';
import { LugarType } from '../lugar/lugar.type';

@ObjectType('Disciplina')
export class DisciplinaType {
  @Field(() => Int)
  id!: number;

  @Field()
  nome!: string;

  @Field(() => LugarType, { nullable: true })
  lugarPadrao!: LugarType | null;
}
