import { z } from "zod";

export const createSOSSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  message: z.string().optional(),
});

export const updateLocationSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
});

export const updateStatusSchema = z.object({
  status: z.enum(["ACTIVE", "RESOLVED", "CANCELLED"]),
});