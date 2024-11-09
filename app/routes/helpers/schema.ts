import z from "zod";

export const intentSchema = z.union([
  z.literal("yetiize"),
  z.literal("print"),
  z.literal("saveImg"),
]);

export const printActionFormSchema = z.object({
  imgSrc: z.string(),
  intent: intentSchema,
});
