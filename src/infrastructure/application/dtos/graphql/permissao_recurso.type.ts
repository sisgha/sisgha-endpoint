import { Field, Int, ObjectType } from '@nestjs/graphql';
import { PermissaoRecursoModel } from '../../../../domain/models';

@ObjectType('PermissaoRecurso')
export class PermissaoRecursoType implements PermissaoRecursoModel {
  @Field(() => Int)
  id!: number;

  // ...

  @Field(() => String)
  recurso!: string;

  // ...

  permissaoId!: number;
}
