import { int, json, mysqlTable, serial, uniqueIndex, varchar, primaryKey, index, timestamp } from 'drizzle-orm/mysql-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import * as z from 'zod';

export const products = mysqlTable(
    'products',
    {
        id: serial('id').primaryKey(),
        name: varchar('name', { length: 256 }).notNull(),
        description: varchar('description', { length: 256 }).notNull(),
        quantity: int('quantity').notNull(),
        userId: varchar('user_id', { length: 256 }).notNull(),
        images: json('images'),
        basePrice: int('base_price').notNull(),
        discountPercentage: int('discount_percentage').notNull(),
        discountAmount: int('discount_amount').notNull(),
        finalPrice: int('final_price').notNull(),
        createdAt: timestamp('created_at').defaultNow().notNull(),
        updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
    }
);

export const productsInsertSchema = createInsertSchema(products);
export const productsSelectSchema = createSelectSchema(products);
export type ProductsSelectSchema = z.infer<typeof productsSelectSchema>;

export const categories = mysqlTable(
    'categories',
    {
        id: serial('id').primaryKey(),
        name: varchar('name', { length: 256 }).notNull(),
        slug: varchar('slug', { length: 256 }).notNull(),
        parentId: int('parent_id'),
        description: varchar('description', { length: 256 }).notNull(),
    },
    (table) => ({
        slugIdx: uniqueIndex('slug_idx').on(table.slug)
    })
);

export const categoriesInsertSchema = createInsertSchema(categories);
export const categoriesSelectSchema = createSelectSchema(categories);
export type CategoriesSelectSchema = z.infer<typeof categoriesSelectSchema>;

export const categoriesToChildren = mysqlTable(
    'categories_to_children',
    {
        parentId: int('parent_id').notNull(),
        childId: int('child_id').notNull(),
    },
    (table) => ({
        pk: primaryKey(table.parentId, table.childId),
        parentIdIdx: index('parent_id_idx').on(table.parentId),
        childIdIdx: index('child_id_idx').on(table.childId),
    })
)

export const categoriesToChildrenInsertSchema = createInsertSchema(categoriesToChildren);
export const categoriesToChildrenSelectSchema = createSelectSchema(categoriesToChildren);

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
export const productsToCategoriesSelectSchema = createSelectSchema(productsToCategories);

export const configs = mysqlTable(
    'configs',
    {
        id: serial('id').primaryKey(),
        key: varchar('key', { length: 256 }).notNull(),
        value: varchar('value', { length: 256 }),
    },
    (table) => ({
        keyIdx: uniqueIndex('key_idx').on(table.key)
    })
);

export const configsInsertSchema = createInsertSchema(configs);
export const configsSelectSchema = createSelectSchema(configs);

export const countries = mysqlTable(
    'countries',
    {
        id: serial('id').primaryKey(),
        name: varchar('name', { length: 256 }).notNull(),
        code: varchar('code', { length: 256 }).notNull(),
    },
    (table) => ({
        codeIdx: uniqueIndex('code_idx').on(table.code)
    })
);

export const countriesInsertSchema = createInsertSchema(countries);
export const countriesSelectSchema = createSelectSchema(countries);

export const parcelLocations = mysqlTable(
    'parcel_locations',
    {
        id: serial('id').primaryKey(),
        name: varchar('name', { length: 256 }).notNull(),
        country: varchar('country', { length: 256 }).notNull(),
        address: varchar('address', { length: 256 }).notNull(),
        city: varchar('city', { length: 256 }).notNull(),
        postcode: varchar('postcode', { length: 256 }).notNull(),
    },
    (table) => ({
        countryIdx: index('country_idx').on(table.country)
    })
);

export const parcelLocationsInsertSchema = createInsertSchema(parcelLocations);
export const parcelLocationsSelectSchema = createSelectSchema(parcelLocations);

export const orders = mysqlTable(
    'orders',
    {
        id: serial('id').primaryKey(),
        userId: varchar('user_id', { length: 256 }).notNull(),
        status: varchar('status', { length: 256 }).notNull(),
        shippingMethod: varchar('shipping_method', { length: 256 }).notNull(),
        shippingPrice: int('shipping_price').notNull(),
        productsAmount: int('products_amount').notNull(),
        createdAt: timestamp('created_at').defaultNow().notNull(),
        updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
    },
    (table) => ({
        userIdIdx: index('user_id_idx').on(table.userId)
    })
);

export const ordersInsertSchema = createInsertSchema(orders);
export const ordersSelectSchema = createSelectSchema(orders);

export const orderAddresses = mysqlTable(
    'order_addresses',
    {
        id: serial('id').primaryKey(),
        orderId: int('order_id').notNull(),
        country: varchar('country', { length: 256 }).notNull(),
        city: varchar('city', { length: 256 }).notNull(),
        postcode: varchar('postcode', { length: 256 }).notNull(),
        address: varchar('address', { length: 256 }).notNull(),
        phone: varchar('phone', { length: 256 }).notNull(),
    },
    (table) => ({
        orderIdIdx: index('order_id_idx').on(table.orderId)
    })
);

export const orderAddressesInsertSchema = createInsertSchema(orderAddresses);
export const orderAddressesSelectSchema = createSelectSchema(orderAddresses);

export const orderItems = mysqlTable(
    'order_items',
    {
        id: serial('id').primaryKey(),
        orderId: int('order_id').notNull(),
        productId: int('product_id').notNull(),
        quantity: int('quantity').notNull(),
        unitPrice: int('unit_price').notNull(),
    },
    (table) => ({
        orderIdIdx: index('order_id_idx').on(table.orderId),
        productIdIdx: index('product_id_idx').on(table.productId),
    })
);

export const orderItemsInsertSchema = createInsertSchema(orderItems);
export const orderItemsSelectSchema = createSelectSchema(orderItems);

export const wishlistedProducts = mysqlTable(
    'wishlisted_products',
    {
        id: serial('id').primaryKey(),
        userId: varchar('user_id', { length: 256 }).notNull(),
        productId: int('product_id').notNull(),
    },
    (table) => ({
        userIdIdx: index('user_id_idx').on(table.userId)
    })
)

export const wishlistedProductsInsertSchema = createInsertSchema(wishlistedProducts);
export const wishlistedProductsSelectSchema = createSelectSchema(wishlistedProducts);

export const menus = mysqlTable(
    'menus',
    {
        id: serial('id').primaryKey(),
        identifier: varchar('name', { length: 256 }).notNull(),
    }
)

export const menusInsertSchema = createInsertSchema(menus);
export const menusSelectSchema = createSelectSchema(menus);

export const menuItems = mysqlTable(
    'menu_items',
    {
        id: serial('id').primaryKey(),
        menuId: int('menu_id').notNull(),
        identifier: varchar('name', { length: 256 }).notNull(),
        href: varchar('href', { length: 256 }).notNull(),
    },
    (table) => ({
        menuIdIdx: index('menu_id_idx').on(table.menuId),
    })
)
