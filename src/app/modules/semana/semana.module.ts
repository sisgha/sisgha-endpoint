import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../../database/database.module';
import { SemanaResolver } from './semana.resolver';
import { SemanaService } from './semana.service';

@Module({
  imports: [DatabaseModule],
  exports: [SemanaService],
  providers: [SemanaService, SemanaResolver],
})
export class SemanaModule {}
