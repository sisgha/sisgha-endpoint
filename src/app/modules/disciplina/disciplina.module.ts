import { Module } from '@nestjs/common';
import { MeiliSearchModule } from 'src/meilisearch/meilisearch.module';
import { DatabaseModule } from '../../../database/database.module';
import { LugarModule } from '../lugar/lugar.module';
import { DisciplinaResolver } from './disciplina.resolver';
import { DisciplinaService } from './disciplina.service';

@Module({
  imports: [
    DatabaseModule,
    MeiliSearchModule,
    // ...
    LugarModule,
  ],
  exports: [DisciplinaService],
  providers: [DisciplinaService, DisciplinaResolver],
})
export class DisciplinaModule {}
