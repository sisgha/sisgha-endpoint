import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../../database/database.module';
import { ProfessorResolver } from './professor.resolver';
import { ProfessorService } from './professor.service';
import { MeiliSearchModule } from 'src/meilisearch/meilisearch.module';

@Module({
  imports: [
    DatabaseModule,
    MeiliSearchModule,
    // ...
  ],
  exports: [ProfessorService],
  providers: [ProfessorService, ProfessorResolver],
})
export class ProfessorModule {}
