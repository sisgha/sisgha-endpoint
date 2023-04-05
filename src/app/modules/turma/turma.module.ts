import { Module } from '@nestjs/common';
import { MeiliSearchModule } from 'src/meilisearch/meilisearch.module';
import { DatabaseModule } from '../../../database/database.module';
import { CursoModule } from '../curso/curso.module';
import { LugarModule } from '../lugar/lugar.module';
import { TurmaResolver } from './turma.resolver';
import { TurmaService } from './turma.service';

@Module({
  imports: [
    DatabaseModule,
    MeiliSearchModule,
    // ...
    CursoModule,
    LugarModule,
  ],
  exports: [TurmaService],
  providers: [TurmaService, TurmaResolver],
})
export class TurmaModule {}
