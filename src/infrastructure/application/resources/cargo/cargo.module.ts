import { Module } from '@nestjs/common';
import { CargoResolver } from '../../../adapters/resolvers/cargo.resolver';
import { DatabaseModule } from '../../../database/database.module';
import { MeiliSearchModule } from '../../../meilisearch/meilisearch.module';
import { CargoService } from './cargo.service';

@Module({
  imports: [
    DatabaseModule,
    MeiliSearchModule,
    // ...
  ],
  exports: [
    // ...
    CargoService,
  ],
  providers: [
    // ...
    CargoService,
    CargoResolver,
  ],
})
export class CargoModule {}
