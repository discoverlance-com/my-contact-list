import { isPossiblePhoneNumber } from "react-phone-number-input";
import { z } from "zod";

const PhoneSchema = z
  .string({
    invalid_type_error: "Please enter a valid phone number",
    required_error: "Phone number is required",
  })
  .trim()
  .min(10, "Phone number must be between 10 and 15 characters")
  .max(20, "Phone number must be between 10 and 15 characters")
  .refine((value) => isPossiblePhoneNumber(value), {
    message: "Phone number must be a valid phone number",
  });

export const ContactSchema = z.object({
  id: z.string(),
  name: z
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name must be a valid text",
    })
    .max(255, "Name must be less than 255 characters"),
  email: z
    .string({
      invalid_type_error: "Name must be a email",
    })
    .email("Email must be a valid email address"),
  phone_number: PhoneSchema,
  address: z
    .string({
      invalid_type_error: "Address must be a valid text",
    })
    .max(255, "Address must be less than 255 characters")
    .optional(),
  is_favorite: z.boolean().optional(),
  updated_at: z.date(),
  created_at: z.date(),
});

export const CreateContactSchema = ContactSchema.pick({
  name: true,
  email: true,
  address: true,
  phone_number: true,
});

export type Contact = z.infer<typeof ContactSchema>;
