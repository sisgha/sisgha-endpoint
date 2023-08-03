import { Module } from '@nestjs/common';
import { databaseProviders } from './database.providers';
import { EnvironmentConfigModule } from '../config/environment-config/environment-config.module';

@Module({
  imports: [EnvironmentConfigModule],
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}
