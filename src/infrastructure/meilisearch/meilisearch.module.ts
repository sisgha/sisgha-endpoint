import { Module } from '@nestjs/common';
import { EnvironmentConfigModule } from '../config/environment-config/environment-config.module';
import { DatabaseModule } from '../database/database.module';
import { MeiliSearchService } from './meilisearch.service';
import { meiliSearchClientProvider } from './providers/meilisearch-client.provider';

@Module({
  imports: [
    // ...
    DatabaseModule,
    EnvironmentConfigModule,
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
