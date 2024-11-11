import { union, literal, object, string } from "zod";

export const intentSchema = union([
  literal("yetiize"),
  literal("print"),
  literal("saveImg"),
]);

export const printActionFormSchema = object({
  imgSrc: string(),
  intent: intentSchema,
});
