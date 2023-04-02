import { ZodType } from 'zod';
import { ArgsOptions } from '@nestjs/graphql/dist/decorators/args.decorator';
import { Args } from '@nestjs/graphql';
import { ZodValidationPipe } from '../common/zod/ZodValidationPipe';

export const ValidatedArgs = (
  property: string,
  zodType: ZodType,
  options?: ArgsOptions,
) => {
  return Args(property, { ...options }, new ZodValidationPipe(zodType));
};
