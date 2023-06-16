import { Module } from '@nestjs/common';
import { MeiliSearchModule } from 'src/meilisearch/meilisearch.module';
import { CargoResolver } from './cargo.resolver';
import { CargoService } from './cargo.service';

@Module({
  imports: [
    MeiliSearchModule,
    // ...
  ],
  exports: [CargoService],
  providers: [CargoService, CargoResolver],
})
export class CargoModule {}
