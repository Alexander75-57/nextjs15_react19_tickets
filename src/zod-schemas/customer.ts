import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { customers } from '@/db/schema';

export const insertCustomerSchema = createInsertSchema(customers, {
    firstName: (schema) => schema.min(2, 'First Name is required'),
    lastName: (schema) => schema.min(2, 'Address is required'),
    email: (schema) => schema.email('Invalid email address'),
    phone: (schema) =>
        schema.regex(
            /^\d{3}-\d{3}-\d{4}$/,
            'Invalid phone number format. Use XXX-XXX-XXXX'
        ),
    address1: (schema) => schema.min(2),
    city: (schema) => schema.min(2, 'City is required'),
    state: (schema) => schema.length(2, 'State must be exactly 2 characters'),
    zip: (schema) =>
        schema.regex(
            /^\d{5}(-\d{4})?$/,
            'Invalid ZIP code. Use 5 digits or 5 digits followed by a hyphen and 4 digits'
        ),
}); // in {} validation of inmput data

export const selectCustomerSchema = createSelectSchema(customers);

export type insertCustomerSchemaType = typeof insertCustomerSchema._type; // ссылаемся на тип из схемы Zod
export type selectCustomerSchemaType = typeof selectCustomerSchema._type;

/* 
export const insertCustomerSchema = createInsertSchema(customers, {
    firstName: (schema) => schema.firstName.min(2, 'First Name is required'),
    lastName: (schema) => schema.lastName.min(2, 'Address is required'),
    email: (schema) => schema.email.email('Invalid email address'),
    phone: (schema) =>
        schema.phone.regex(
            /^\d{3}-\d{3}-\d{4}$/,
            'Invalid phone number format. Use XXX-XXX-XXXX'
        ),
    address1: (schema) => schema.address1.min(2),
    city: (schema) => schema.city.min(2, 'City is required'),
    state: (schema) =>
        schema.state.length(2, 'State must be exactly 2 characters'),
    zip: (schema) =>
        schema.zip.regex(
            /^\d{5}(-\d{4})?$/,
            'Invalid ZIP code. Use 5 digits or 5 digits followed by a hyphen and 4 digits'
        ),
}); // in {} validation of inmput data
 */
