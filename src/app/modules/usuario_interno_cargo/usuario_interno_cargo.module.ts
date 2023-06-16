import { Module } from '@nestjs/common';
import { MeiliSearchModule } from 'src/meilisearch/meilisearch.module';
import { CargoModule } from '../cargo/cargo.module';
import { UsuarioInternoModule } from '../usuario_interno/usuario_interno.module';
import { UsuarioInternoCargoResolver } from './usuario_interno_cargo.resolver';
import { UsuarioInternoCargoService } from './usuario_interno_cargo.service';

@Module({
  imports: [
    MeiliSearchModule,
    // ...
    CargoModule,
    UsuarioInternoModule,
  ],
  exports: [UsuarioInternoCargoService],
  providers: [UsuarioInternoCargoService, UsuarioInternoCargoResolver],
})
export class UsuarioInternoCargoModule {}
