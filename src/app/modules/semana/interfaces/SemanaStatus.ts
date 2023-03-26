import { z } from 'zod';

export enum SemanaStatus {
  RASCUNHO = 'rascunho',
  PUBLICO = 'publico',
}

export const SemanaStatusZod = z.enum([
  SemanaStatus.RASCUNHO,
  SemanaStatus.PUBLICO,
]);
