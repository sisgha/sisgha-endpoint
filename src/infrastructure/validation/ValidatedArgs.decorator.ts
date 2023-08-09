import { Args } from '@nestjs/graphql';
import { ArgsOptions } from '@nestjs/graphql/dist/decorators/args.decorator';
import { ZodType } from 'zod';
import { ZodValidationPipe } from '../zod/ZodValidationPipe';

export const ValidatedArgs = (property: string, zodType: ZodType, options?: ArgsOptions) => {
  return Args(property, { ...options }, new ZodValidationPipe(zodType));
};
