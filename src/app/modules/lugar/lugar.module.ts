import { Module } from '@nestjs/common';
import { MeiliSearchModule } from 'src/meilisearch/meilisearch.module';
import { DatabaseModule } from '../../../database/database.module';
import { LugarResolver } from './lugar.resolver';
import { LugarService } from './lugar.service';

@Module({
  imports: [
    DatabaseModule,
    MeiliSearchModule,
    // ...
  ],
  exports: [LugarService],
  providers: [LugarService, LugarResolver],
})
export class LugarModule {}
