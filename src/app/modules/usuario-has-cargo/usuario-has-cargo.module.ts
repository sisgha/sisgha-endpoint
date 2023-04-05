import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../../database/database.module';
import { CargoModule } from '../cargo/cargo.module';
import { UsuarioResolver } from './usuario-has-cargo.resolver';
import { UsuarioHasCargoService } from './usuario-has-cargo.service';
import { MeiliSearchModule } from 'src/meilisearch/meilisearch.module';

@Module({
  imports: [
    DatabaseModule,
    MeiliSearchModule,
    // ...
    CargoModule,
  ],
  exports: [UsuarioHasCargoService],
  providers: [UsuarioHasCargoService, UsuarioResolver],
})
export class UsuarioHasCargoModule {}
