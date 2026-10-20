import { z } from "zod";

export const createCommunityReportSchema = z.object({
  category: z
    .string()
    .min(1, "Category is required"),

  description: z
    .string()
    .min(5, "Description must be at least 5 characters"),

  // User manually enters where the incident happened
  location: z
    .string()
    .min(2, "Incident location is required"),

  locationPrecision: z
    .string()
    .optional()
    .default("APPROXIMATE"),

  occurredAt: z
    .coerce
    .date()
    .optional(),
});

export type CreateCommunityReportInput = z.infer<
  typeof createCommunityReportSchema
>;