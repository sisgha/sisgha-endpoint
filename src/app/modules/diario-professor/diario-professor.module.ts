import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../../database/database.module';
import { DiarioModule } from '../diario/diario.module';
import { ProfessorModule } from '../professor/professor.module';
import { DiarioProfessorResolver } from './diario-professor.resolver';
import { DiarioProfessorService } from './diario-professor.service';

@Module({
  imports: [DatabaseModule, DiarioModule, ProfessorModule],
  exports: [DiarioProfessorService],
  providers: [DiarioProfessorService, DiarioProfessorResolver],
})
export class DiarioProfessorModule {}
