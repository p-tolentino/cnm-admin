import { z } from 'zod';

export const createOrUpdateProductSchema = z.object({
  flavor: z.string().min(1, { message: 'Flavor is required' }),
  price: z.string().min(1, { message: 'Price is required' }),
  size: z.string().min(1, { message: 'Size is required' }),
  category: z.string().min(1, { message: 'Category is required' }),
  heroImage: z.any().refine(file => file.length, 'Image is required'),
  
  intent: z
    .enum(['create', 'update'], {
      message: 'Intent must be either create or update',
    })
    .optional(),
  slug: z.string().optional(),
});

export type CreateOrUpdateProductSchema = z.infer<
  typeof createOrUpdateProductSchema
>;

export const createProductSchemaServer = z.object({
  flavor: z.string().min(1, { message: 'Flavor is required' }),
  price: z.number().positive({ message: 'Price is required' }),
  size: z.string().min(1, { message: 'Size is required' }),
  category: z.number().positive({ message: 'Category is required' }),
  heroImage: z.string().url({ message: 'Image is required' }),
});

export type CreateProductSchemaServer = z.infer<
  typeof createProductSchemaServer
>;