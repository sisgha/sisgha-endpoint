import { Field, InputType, Int } from '@nestjs/graphql';
import { ICheckUsuarioAuthorizationsInput, ICheckUsuarioAuthorizationsInputCheck } from '../../../../domain/dtos';

@InputType('CheckUsuarioAuthorizationsInputCheck')
export class CheckUsuarioAuthorizationsInputCheckType implements ICheckUsuarioAuthorizationsInputCheck {
  @Field(() => Int)
  usuarioId!: number;

  @Field(() => String)
  recurso!: string;

  @Field(() => String)
  verbo!: string;

  @Field(() => Int, { nullable: true })
  entityId!: number | null;
}

@InputType('CheckUsuarioAuthorizationsInput')
export class CheckUsuarioAuthorizationsInputType implements ICheckUsuarioAuthorizationsInput {
  @Field(() => [CheckUsuarioAuthorizationsInputCheckType], { nullable: false })
  checks!: CheckUsuarioAuthorizationsInputCheckType[];
}
