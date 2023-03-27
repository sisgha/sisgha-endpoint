import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../../infrastructure/database/database.module';
import { ProfessorResolver } from './professor.resolver';
import { ProfessorService } from './professor.service';

@Module({
  imports: [DatabaseModule],
  exports: [ProfessorService],
  providers: [ProfessorService, ProfessorResolver],
})
export class ProfessorModule {}
