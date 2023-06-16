import { z } from 'zod';

const timetzRegex = /^([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])([+-][01][0-9]:[0-5][0-9])?$/;

export const parseTimeTz = (value: string) => {
  const [, hour, minute, second, offset] = timetzRegex.exec(value) ?? [];

  const asDate = new Date(`1970-01-01T${hour}:${minute}:${second}${offset}`);

  return {
    asDate,
    hour: Number(hour),
    minute: Number(minute),
    second: Number(second),
    offset: offset ? offset : '+00:00',
  };
};

export const TimetzZod = z.string().refine((value) => timetzRegex.test(value), {
  message: 'Invalid timetz value',
});
