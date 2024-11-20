import * as z from 'zod';

export const signupSchema = z.object({
  email: z.string({
    required_error: "Email is required",
  }).email('Invalid email address'),
  password: z.string({
    required_error: "Password is required",
  })
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string({
    required_error: "Please confirm your password",
  }),
  first_name: z.string({
    required_error: "First name is required",
  }).min(1, 'First name is required'),
  last_name: z.string({
    required_error: "Last name is required",
  }).min(1, 'Last name is required'),
  gender: z.enum(['male', 'female', 'other'], {
    required_error: "Please select a gender",
  }).default('other'),
  mobile: z.string({
    required_error: "Mobile number is required",
  }).refine((val) => {
    const numberOnly = val.replace(/^\+\d{1,4}\s*/, '').replace(/\s/g, '');
    return numberOnly.length >= 10;
  }, 'Mobile number must be at least 10 digits'),
  alternate_mobile: z.string().optional().nullable(),
  country: z.string().optional().default(''),
  address: z.string().optional().default(''),
  default_address: z.boolean().default(false),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
}); 