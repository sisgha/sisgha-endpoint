import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../../database/database.module';
import { UsuarioService } from './usuario.service';
import { UsuarioResolver } from './usuario.resolver';
import { CargoModule } from '../cargo/cargo.module';

@Module({
  imports: [DatabaseModule, CargoModule],
  exports: [UsuarioService],
  providers: [UsuarioService, UsuarioResolver],
})
export class UsuarioModule {}
