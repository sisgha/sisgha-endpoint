import { Field, Int, ObjectType } from '@nestjs/graphql';
import { PermissaoType } from './permissao.type';
import { UsuarioInternoModel } from '../../../../domain/models/usuario_interno.model';

@ObjectType('UsuarioInterno')
export class UsuarioInternoType implements UsuarioInternoModel {
  @Field(() => Int)
  id!: number;

  // ...

  @Field(() => String, { nullable: false })
  tipoEntidade!: string;

  // ...

  @Field(() => Date)
  dateCreated!: Date;

  @Field(() => Date)
  dateUpdated!: Date;

  @Field(() => Date, { nullable: true })
  dateDeleted!: Date | null;

  @Field(() => Date, { nullable: true })
  dateSearchSync!: Date | null;

  // ...

  @Field(() => [PermissaoType])
  permissoes!: PermissaoType[];
}
