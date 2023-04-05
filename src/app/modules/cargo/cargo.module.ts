import { Module } from '@nestjs/common';
import { MeiliSearchModule } from 'src/meilisearch/meilisearch.module';
import { DatabaseModule } from '../../../database/database.module';
import { CargoResolver } from './cargo.resolver';
import { CargoService } from './cargo.service';

@Module({
  imports: [
    DatabaseModule,
    MeiliSearchModule,
    //...
  ],
  exports: [CargoService],
  providers: [CargoService, CargoResolver],
})
export class CargoModule {}
