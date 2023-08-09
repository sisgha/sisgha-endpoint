import { Global, Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { MeiliSearchService } from './meilisearch.service';
import { meiliSearchClientProvider } from './providers/meilisearch-client.provider';

@Global()
@Module({
  imports: [
    // ...
    DatabaseModule,
  ],
  providers: [
    // ...
    meiliSearchClientProvider,
    MeiliSearchService,
  ],
  exports: [
    // ...
    meiliSearchClientProvider,
    MeiliSearchService,
  ],
})
export class MeiliSearchModule {}
