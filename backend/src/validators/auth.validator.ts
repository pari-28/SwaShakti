import { z } from "zod";

const phoneSchema = z
  .string()
  .trim()
  .regex(/^\+?[1-9]\d{7,14}$/, "Invalid phone number");

const emergencyContactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Contact name must be at least 2 characters")
    .max(100, "Contact name is too long"),

  phone: phoneSchema,

  relation: z
    .string()
    .trim()
    .min(2, "Relation is required")
    .max(50, "Relation is too long"),
});

export const registerSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name is too long"),

  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .transform((value) => value.toLowerCase()),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password is too long"),

  phone: phoneSchema,

  emergencyContacts: z
    .array(emergencyContactSchema)
    .min(1, "At least one emergency contact is required")
    .max(5, "Maximum 5 emergency contacts are allowed"),
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .transform((value) => value.toLowerCase()),

  password: z
    .string()
    .min(1, "Password is required")
    .max(128, "Password is too long"),
});

export const fcmTokenSchema = z.object({
  token: z
    .string()
    .trim()
    .min(1, "FCM token is required")
    .max(4096, "Invalid FCM token"),
});