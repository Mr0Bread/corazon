import { int, json, mysqlTable, serial, uniqueIndex, varchar, primaryKey, index } from 'drizzle-orm/mysql-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const products = mysqlTable(
    'products',
    {
        id: serial('id').primaryKey(),
        price: int('price').notNull(),
        name: varchar('name', { length: 256 }).notNull(),
        description: varchar('description', { length: 256 }).notNull(),
        quantity: int('quantity').notNull(),
        userId: varchar('user_id', { length: 256 }).notNull(),
        images: json('images'),
    }
);

export const productsInsertSchema = createInsertSchema(products);
export type ProductsInsertSchema = z.infer<typeof productsInsertSchema>;
export const productsSelectSchema = createSelectSchema(products);
export type ProductsSelectSchema = z.infer<typeof productsSelectSchema>;

export const categories = mysqlTable(
    'categories',
    {
        id: serial('id').primaryKey(),
        name: varchar('name', { length: 256 }).notNull(),
        slug: varchar('slug', { length: 256 }).notNull(),
        parentId: int('parent_id'),
        children: json('children'),
        description: varchar('description', { length: 256 }).notNull(),
    },
    (table) => ({
        slugIdx: uniqueIndex('slug_idx').on(table.slug)
    })
);

export const categoriesInsertSchema = createInsertSchema(categories);
export type CategoriesInsertSchema = z.infer<typeof categoriesInsertSchema>;
export const categoriesSelectSchema = createSelectSchema(categories);
export type CategoriesSelectSchema = z.infer<typeof categoriesSelectSchema>;

export const productsToCategories = mysqlTable(
    'products_to_categories',
    {
        productId: int('product_id').notNull(),
        categoryId: int('category_id').notNull(),
    },
    (table) => ({
        pk: primaryKey(table.productId, table.categoryId),
        productIdIdx: index('product_id_idx').on(table.productId),
        categoryIdIdx: index('category_id_idx').on(table.categoryId),
    })
);

export const productsToCategoriesInsertSchema = createInsertSchema(productsToCategories);
export type ProductsToCategoriesInsertSchema = z.infer<typeof productsToCategoriesInsertSchema>;
export const productsToCategoriesSelectSchema = createSelectSchema(productsToCategories);
export type ProductsToCategoriesSelectSchema = z.infer<typeof productsToCategoriesSelectSchema>;
