import { Module } from '@nestjs/common';
import { UsuarioResolver } from '../../../adapters/resolvers/usuario.resolver';
import { UsuarioService } from './usuario.service';

@Module({
  exports: [UsuarioService],
  providers: [UsuarioService, UsuarioResolver],
})
export class UsuarioModule {}
