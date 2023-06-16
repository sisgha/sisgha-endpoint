import { Field, InputType } from '@nestjs/graphql';
import { z } from 'zod';
import { IdZod } from '../../../../common/zod/IdZod';

export const FindUsuarioInternoCargoByUsuarioInternoIdAndCargoIdInputZod = z.object({
  usuarioInternoId: IdZod,
  cargoId: IdZod,
});

export type IFindUsuarioInternoCargoByUsuarioInternoIdAndCargoIdInput = z.infer<
  typeof FindUsuarioInternoCargoByUsuarioInternoIdAndCargoIdInputZod
>;

@InputType('FindUsuarioInternoCargoByUsuarioInternoIdAndCargoIdInput')
export class FindUsuarioInternoCargoByUsuarioInternoIdAndCargoIdInputType
  implements IFindUsuarioInternoCargoByUsuarioInternoIdAndCargoIdInput
{
  @Field()
  usuarioInternoId!: number;

  @Field()
  cargoId!: number;
}
