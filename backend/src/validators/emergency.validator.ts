import { z } from "zod";

export const createEmergencySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters long"),

  phone: z
    .string()
    .regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),

  relation: z
    .string()
    .trim()
    .min(2, "Relation is required"),
});

export const updateEmergencySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters long")
    .optional(),

  phone: z
    .string()
    .regex(/^\d{10}$/, "Phone number must be exactly 10 digits")
    .optional(),

  relation: z
    .string()
    .trim()
    .min(2, "Relation is required")
    .optional(),
});