import { Module } from '@nestjs/common';
import { UsuarioInternoResolver } from '../../../adapters/graphql-resolvers/usuario_interno.resolver';
import { UsuarioInternoService } from './usuario_interno.service';

@Module({
  exports: [UsuarioInternoService],
  providers: [UsuarioInternoService, UsuarioInternoResolver],
})
export class UsuarioInternoModule {}
