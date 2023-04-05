import { Module } from '@nestjs/common';
import { MeiliSearchModule } from 'src/meilisearch/meilisearch.module';
import { DatabaseModule } from '../../../database/database.module';
import { DisciplinaModule } from '../disciplina/disciplina.module';
import { TurmaModule } from '../turma/turma.module';
import { DiarioResolver } from './diario.resolver';
import { DiarioService } from './diario.service';

@Module({
  imports: [
    DatabaseModule,
    MeiliSearchModule,
    // ...
    TurmaModule,
    DisciplinaModule,
  ],
  exports: [DiarioService],
  providers: [DiarioService, DiarioResolver],
})
export class DiarioModule {}
