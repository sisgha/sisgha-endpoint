import { Module } from '@nestjs/common';
import { MeiliSearchModule } from 'src/meilisearch/meilisearch.module';
import { DatabaseModule } from '../../../database/database.module';
import { CargoModule } from '../cargo/cargo.module';
import { UsuarioModule } from '../usuario/usuario.module';
import { UsuarioCargoResolver } from './usuario_cargo.resolver';
import { UsuarioCargoService } from './usuario_cargo.service';

@Module({
  imports: [
    DatabaseModule,
    MeiliSearchModule,
    // ...
    UsuarioModule,
    CargoModule,
  ],
  exports: [UsuarioCargoService],
  providers: [UsuarioCargoService, UsuarioCargoResolver],
})
export class UsuarioCargoModule {}
