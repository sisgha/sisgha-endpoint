import { Field, Int, ObjectType } from '@nestjs/graphql';
import { PermissaoVerboModel } from '../../../../domain/models';

@ObjectType('PermissaoVerbo')
export class PermissaoVerboType implements PermissaoVerboModel {
  @Field(() => Int)
  id!: number;

  // ...

  @Field(() => String)
  verbo!: string;

  // ...

  permissaoId!: number;
}
