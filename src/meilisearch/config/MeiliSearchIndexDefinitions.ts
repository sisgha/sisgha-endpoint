import { AulaDbEntity } from 'src/database/entities/aula.db.entity';
import { CargoDbEntity } from 'src/database/entities/cargo.db.entity';
import { CursoDbEntity } from 'src/database/entities/curso.db.entity';
import { DiaSemanaDbEntity } from 'src/database/entities/dia-semana.db.entity';
import { DiarioProfessorDbEntity } from 'src/database/entities/diario-professor.db.entity';
import { DiarioDbEntity } from 'src/database/entities/diario.db.entity';
import { DisciplinaCursoDbEntity } from 'src/database/entities/disciplina-curso.db.entity';
import { DisciplinaDbEntity } from 'src/database/entities/disciplina.db.entity';
import { LugarDbEntity } from 'src/database/entities/lugar.db.entity';
import { PeriodoDiaDbEntity } from 'src/database/entities/periodo-dia.db.entity';
import { ProfessorDbEntity } from 'src/database/entities/professor.db.entity';
import { TurmaDbEntity } from 'src/database/entities/turma.db.entity';
import { TurnoAulaDbEntity } from 'src/database/entities/turno-aula.db.entity';
import { UsuarioHasCargoDbEntity } from 'src/database/entities/usuario-has-cargo.db.entity';
import { getAulaRepository } from 'src/database/repositories/aula.repository';
import { getCargoRepository } from 'src/database/repositories/cargo.repository';
import { getCursoRepository } from 'src/database/repositories/curso.repository';
import { getDiaSemanaRepository } from 'src/database/repositories/dia-semana.repository';
import { getDiarioProfessorRepository } from 'src/database/repositories/diario-professor.repository';
import { getDiarioRepository } from 'src/database/repositories/diario.repository';
import { getDisciplinaCursoRepository } from 'src/database/repositories/disciplina-curso.repository';
import { getDisciplinaRepository } from 'src/database/repositories/disciplina.repository';
import { getLugarRepository } from 'src/database/repositories/lugar.repository';
import { getPeriodoDiaRepository } from 'src/database/repositories/periodo-dia.repository';
import { getProfessorRepository } from 'src/database/repositories/professor.repository';
import { getSemanaRepository } from 'src/database/repositories/semana.repository';
import { getTurmaHasTurnoAulaRepository } from 'src/database/repositories/turma-has-turno-aula.repository';
import { getTurmaRepository } from 'src/database/repositories/turma.repository';
import { getTurnoAulaRepository } from 'src/database/repositories/turno-aula.repository';
import { getUsuarioHasCargoRepository } from 'src/database/repositories/usuario-has-cargo.repository';
import { getUsuarioRepository } from 'src/database/repositories/usuario.repository';
import { SemanaDbEntity } from '../../database/entities/semana.db.entity';
import { TurmaHasTurnoAulaDbEntity } from '../../database/entities/turma-has-turno-aula.db.entity';
import { UsuarioDbEntity } from '../../database/entities/usuario.db.entity';
import {
  INDEX_AULA,
  INDEX_CARGO,
  INDEX_CURSO,
  INDEX_DIARIO,
  INDEX_DIARIO_PROFESSOR,
  INDEX_DIA_SEMANA,
  INDEX_DISCIPLINA,
  INDEX_DISCIPLINA_CURSO,
  INDEX_LUGAR,
  INDEX_PERIODO_DIA,
  INDEX_PROFESSOR,
  INDEX_SEMANA,
  INDEX_TURMA,
  INDEX_TURMA_HAS_TURNO_AULA,
  INDEX_TURNO_AULA,
  INDEX_USUARIO,
  INDEX_USUARIO_HAS_CARGO,
} from '../constants/meilisearch-tokens';
import { IMeiliSearchIndexDefinition } from '../interfaces/MeiliSearchIndexDefinition';

export const MeilisearchIndexDefinitions: IMeiliSearchIndexDefinition[] = [
  {
    index: INDEX_AULA,

    primaryKey: 'id',

    searchable: ['id'],
    filterable: ['id', 'diario.id', 'semana.id', 'turnoAula.id', 'lugar.id'],

    sortable: [],

    getSearchableDataView: () => [
      'id',
      'diario.id',
      'semana.id',
      'turnoAula.id',
      'lugar.id',
    ],

    getTypeormEntity: () => AulaDbEntity,
    getTypeormRepositoryFactory: () => getAulaRepository,
  },

  {
    index: INDEX_CARGO,

    primaryKey: 'id',

    searchable: ['id', 'slug'],

    filterable: ['id'],
    sortable: ['slug'],

    getSearchableDataView: () => ['id', 'slug'],

    getTypeormEntity: () => CargoDbEntity,
    getTypeormRepositoryFactory: () => getCargoRepository,
  },

  {
    index: INDEX_CURSO,

    primaryKey: 'id',

    searchable: ['id', 'nome', 'tipo'],
    filterable: ['id', 'nome', 'tipo'],
    sortable: ['nome', 'tipo'],

    getSearchableDataView: () => ['id', 'nome', 'tipo'],

    getTypeormEntity: () => CursoDbEntity,
    getTypeormRepositoryFactory: () => getCursoRepository,
  },

  {
    index: INDEX_DIA_SEMANA,

    primaryKey: 'id',

    searchable: ['id', 'ordem'],
    filterable: ['id', 'ordem'],
    sortable: ['ordem'],

    getSearchableDataView: () => ['id', 'ordem'],

    getTypeormEntity: () => DiaSemanaDbEntity,
    getTypeormRepositoryFactory: () => getDiaSemanaRepository,
  },

  {
    index: INDEX_DIARIO_PROFESSOR,

    primaryKey: 'id',

    searchable: ['id'],
    filterable: ['id', 'professor.id', 'diario.id'],
    sortable: ['professor.id', 'diario.id'],

    getSearchableDataView: () => ['id', 'professor.id', 'diario.id'],

    getTypeormEntity: () => DiarioProfessorDbEntity,
    getTypeormRepositoryFactory: () => getDiarioProfessorRepository,
  },

  {
    index: INDEX_DIARIO,

    primaryKey: 'id',

    searchable: ['id'],
    filterable: ['id', 'turma.id', 'disciplina.id'],
    sortable: ['turma.id', 'disciplina.id'],

    getSearchableDataView: () => ['id', 'turma.id', 'disciplina.id'],

    getTypeormEntity: () => DiarioDbEntity,
    getTypeormRepositoryFactory: () => getDiarioRepository,
  },

  {
    index: INDEX_DISCIPLINA_CURSO,

    primaryKey: 'id',

    searchable: ['id'],
    filterable: ['id', 'curso.id', 'disciplina.id'],
    sortable: ['curso.id', 'disciplina.id'],

    getSearchableDataView: () => ['id', 'curso.id', 'disciplina.id'],

    getTypeormEntity: () => DisciplinaCursoDbEntity,
    getTypeormRepositoryFactory: () => getDisciplinaCursoRepository,
  },

  {
    index: INDEX_DISCIPLINA,

    primaryKey: 'id',

    searchable: ['id', 'nome'],
    filterable: ['id', 'nome', 'lugarPadrao.id'],
    sortable: ['nome', 'lugarPadrao.id'],

    getSearchableDataView: () => ['id', 'nome', 'lugarPadrao.id'],

    getTypeormEntity: () => DisciplinaDbEntity,
    getTypeormRepositoryFactory: () => getDisciplinaRepository,
  },

  {
    index: INDEX_LUGAR,

    primaryKey: 'id',

    searchable: ['id', 'numero', 'tipo', 'descricao'],
    filterable: ['id', 'numero', 'tipo', 'descricao'],
    sortable: ['numero', 'tipo', 'descricao'],

    getSearchableDataView: () => ['id', 'numero', 'tipo', 'descricao'],

    getTypeormEntity: () => LugarDbEntity,
    getTypeormRepositoryFactory: () => getLugarRepository,
  },

  {
    index: INDEX_PERIODO_DIA,

    primaryKey: 'id',

    searchable: ['id', 'horaInicio', 'horaFim'],
    filterable: ['id', 'horaInicio', 'horaFim'],
    sortable: ['horaInicio', 'horaFim'],

    getSearchableDataView: () => ['id', 'horaInicio', 'horaFim'],

    getTypeormEntity: () => PeriodoDiaDbEntity,
    getTypeormRepositoryFactory: () => getPeriodoDiaRepository,
  },

  {
    index: INDEX_PROFESSOR,

    primaryKey: 'id',

    searchable: ['id', 'nome'],
    filterable: ['id', 'nome'],
    sortable: ['nome'],

    getSearchableDataView: () => ['id', 'nome'],

    getTypeormEntity: () => ProfessorDbEntity,
    getTypeormRepositoryFactory: () => getProfessorRepository,
  },

  {
    index: INDEX_SEMANA,

    primaryKey: 'id',

    searchable: ['id', 'dataInicio', 'dataFim', 'status'],
    filterable: ['id', 'dataInicio', 'dataFim', 'status'],
    sortable: ['dataInicio', 'dataFim', 'status'],

    getSearchableDataView: () => ['id', 'dataInicio', 'dataFim', 'status'],

    getTypeormEntity: () => SemanaDbEntity,
    getTypeormRepositoryFactory: () => getSemanaRepository,
  },

  {
    index: INDEX_TURMA_HAS_TURNO_AULA,

    primaryKey: 'id',

    searchable: ['id'],
    filterable: ['id', 'turma.id', 'turnoAula.id'],
    sortable: ['turma.id', 'turnoAula.id'],

    getSearchableDataView: () => ['id', 'turma.id', 'turnoAula.id'],

    getTypeormEntity: () => TurmaHasTurnoAulaDbEntity,
    getTypeormRepositoryFactory: () => getTurmaHasTurnoAulaRepository,
  },

  {
    index: INDEX_TURMA,

    primaryKey: 'id',

    searchable: ['id'],
    filterable: ['id', 'periodo.id', 'turno.id', 'curso.id', 'lugarPadrao.id'],
    sortable: ['periodo.id', 'turno.id', 'curso.id', 'lugarPadrao.id'],

    getSearchableDataView: () => [
      'id',
      'periodo.id',
      'turno.id',
      'curso.id',
      'lugarPadrao.id',
    ],

    getTypeormEntity: () => TurmaDbEntity,
    getTypeormRepositoryFactory: () => getTurmaRepository,
  },

  {
    index: INDEX_TURNO_AULA,

    primaryKey: 'id',

    searchable: ['id'],
    filterable: ['id', 'diaSemana.id', 'periodoDia.id'],
    sortable: ['diaSemana.id', 'periodoDia.id'],

    getSearchableDataView: () => ['id', 'diaSemana.id', 'periodoDia.id'],

    getTypeormEntity: () => TurnoAulaDbEntity,
    getTypeormRepositoryFactory: () => getTurnoAulaRepository,
  },

  {
    index: INDEX_USUARIO_HAS_CARGO,

    primaryKey: 'id',

    searchable: ['id'],
    filterable: ['id', 'usuario.id', 'cargo.id'],
    sortable: ['usuario.id', 'cargo.id'],

    getSearchableDataView: () => ['id', 'usuario.id', 'cargo.id'],

    getTypeormEntity: () => UsuarioHasCargoDbEntity,
    getTypeormRepositoryFactory: () => getUsuarioHasCargoRepository,
  },

  {
    index: INDEX_USUARIO,

    primaryKey: 'id',

    searchable: ['id', 'matriculaSiape'],
    filterable: ['id'],
    sortable: ['matriculaSiape'],

    getSearchableDataView: () => ['id', 'matriculaSiape'],

    getTypeormEntity: () => UsuarioDbEntity,
    getTypeormRepositoryFactory: () => getUsuarioRepository,
  },
];
