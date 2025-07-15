import {object, ZodObject, ZodRawShape} from 'zod';

export const describe = <TShape extends ZodRawShape>(
  val: ZodObject<TShape>,
  descriptions: Record<keyof TShape, string>
): ZodObject<TShape> => {
  const newShape: ZodRawShape = {};
  for (const entry of Object.entries(val.shape)) {
    newShape[entry[0]] = entry[1].openapi({description: descriptions[entry[0]]});
  }
  return object(newShape) as ZodObject<TShape>;
};
