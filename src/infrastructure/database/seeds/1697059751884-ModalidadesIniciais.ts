import { MigrationInterface, QueryRunner } from 'typeorm';
import { ModalidadeDbEntity } from '../entities/modalidade.db.entity';
import { getModalidadeRepository } from '../repositories/modalidade.repository';

export class ModalidadesIniciais1697059751884 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const modalidadeRepository = getModalidadeRepository(queryRunner.manager);

    await modalidadeRepository.save(<ModalidadeDbEntity>{
      slug: 'tecnico-integrado',
      nome: 'Técnico Integrado',
    });

    await modalidadeRepository.save(<ModalidadeDbEntity>{
      slug: 'graduacao',
      nome: 'Graduação',
    });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const modalidadeRepository = getModalidadeRepository(queryRunner.manager);

    await modalidadeRepository.delete({
      slug: 'graduacao',
    });

    await modalidadeRepository.delete({
      slug: 'tecnico-integrado',
    });
  }
}
