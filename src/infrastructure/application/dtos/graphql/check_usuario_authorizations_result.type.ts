import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ICheckUsuarioAuthorizationsResult } from '../../../../domain/dtos';
import { CheckUsuarioAuthorizationsInputCheckType } from './check_usuario_authorizations_input.type';

@ObjectType('CheckUsuarioAuthorizationsResultCheckType')
export class CheckUsuarioAuthorizationsResultCheckType extends CheckUsuarioAuthorizationsInputCheckType {
  @Field(() => Boolean)
  can!: boolean;

  @Field(() => Int)
  usuarioId!: number;

  @Field(() => String)
  recurso!: string;

  @Field(() => String)
  verbo!: string;

  @Field(() => Int, { nullable: true })
  entityId!: number | null;
}

@ObjectType('CheckUsuarioAuthorizationsResultType')
export class CheckUsuarioAuthorizationsResultType implements ICheckUsuarioAuthorizationsResult {
  @Field(() => [CheckUsuarioAuthorizationsResultCheckType])
  checks!: CheckUsuarioAuthorizationsResultCheckType[];
}
