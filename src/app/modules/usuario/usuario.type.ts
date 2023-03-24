import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType('Usuario')
export class UsuarioType {
  @Field(() => Int)
  id!: number;

  @Field(() => String, { nullable: true })
  email!: string | null;

  @Field(() => String, { nullable: true })
  keycloakId!: string | null;

  @Field(() => String, { nullable: true })
  matriculaSiape!: string | null;
}
