import { Field, InputType } from '@nestjs/graphql';
import { z } from 'zod';
import { IdZod } from '../../../../common/zod/IdZod';

export const FindUsuarioCargoByUsuarioIdAndCargoIdInputZod = z.object({
  usuarioId: IdZod,
  cargoId: IdZod,
});

export type IFindUsuarioCargoByUsuarioIdAndCargoIdInput = z.infer<typeof FindUsuarioCargoByUsuarioIdAndCargoIdInputZod>;

@InputType('FindUsuarioCargoByUsuarioIdAndCargoIdInput')
export class FindUsuarioCargoByUsuarioIdAndCargoIdInputType implements IFindUsuarioCargoByUsuarioIdAndCargoIdInput {
  @Field()
  usuarioId!: number;

  @Field()
  cargoId!: number;
}
