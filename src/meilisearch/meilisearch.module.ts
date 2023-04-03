import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { MeiliSearchService } from './meilisearch.service';
import { meiliSearchClientProviders } from './providers/meilisearch-client.providers';

@Module({
  imports: [DatabaseModule],
  providers: [MeiliSearchService, ...meiliSearchClientProviders],
  exports: [MeiliSearchService, ...meiliSearchClientProviders],
})
export class MeiliSearchModule {}
