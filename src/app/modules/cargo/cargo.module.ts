import { Module } from '@nestjs/common';
import { MeiliSearchModule } from 'src/meilisearch/meilisearch.module';
import { CargoResolver } from './cargo.resolver';
import { CargoService } from './cargo.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [
    DatabaseModule,
    MeiliSearchModule,
    // ...
  ],
  exports: [CargoService],
  providers: [CargoService, CargoResolver],
})
export class CargoModule {}
