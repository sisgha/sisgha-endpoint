import { z } from 'zod';
import { ConstraintJoinMode } from '../interfaces';

export const ZodConstraintJoinMode = z.nativeEnum(ConstraintJoinMode);
