import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../../database/database.module';
import { CargoModule } from '../cargo/cargo.module';
import { UsuarioResolver } from './usuario.resolver';
import { UsuarioService } from './usuario.service';
import { MeiliSearchModule } from 'src/meilisearch/meilisearch.module';

@Module({
  imports: [
    DatabaseModule,
    MeiliSearchModule,
    // ...
    CargoModule,
  ],
  exports: [UsuarioService],
  providers: [UsuarioService, UsuarioResolver],
})
export class UsuarioModule {}
