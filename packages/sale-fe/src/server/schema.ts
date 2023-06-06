import { int, json, mysqlTable, serial, uniqueIndex, varchar, primaryKey, index, timestamp } from 'drizzle-orm/mysql-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { InferModel, relations } from 'drizzle-orm'
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
export type ProductModel = InferModel<typeof products>;

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
export type CategoriesInsertSchema = z.infer<typeof categoriesInsertSchema>;
export const categoriesSelectSchema = createSelectSchema(categories);
export type CategoriesSelectSchema = z.infer<typeof categoriesSelectSchema>;
export type CategoryModel = InferModel<typeof categories>;

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
export type CategoriesToChildrenInsertSchema = z.infer<typeof categoriesToChildrenInsertSchema>;
export const categoriesToChildrenSelectSchema = createSelectSchema(categoriesToChildren);
export type CategoriesToChildrenSelectSchema = z.infer<typeof categoriesToChildrenSelectSchema>;
export type CategoryToChildModel = InferModel<typeof categoriesToChildren>;

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
export type ProductToCategoryModel = InferModel<typeof productsToCategories>;

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
export type ConfigsInsertSchema = z.infer<typeof configsInsertSchema>;
export const configsSelectSchema = createSelectSchema(configs);
export type ConfigsSelectSchema = z.infer<typeof configsSelectSchema>;
export type ConfigModel = InferModel<typeof configs>;

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
export type CountriesInsertSchema = z.infer<typeof countriesInsertSchema>;
export const countriesSelectSchema = createSelectSchema(countries);
export type CountriesSelectSchema = z.infer<typeof countriesSelectSchema>;
export type CountryModel = InferModel<typeof countries>;

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
export type ParcelLocationsInsertSchema = z.infer<typeof parcelLocationsInsertSchema>;
export const parcelLocationsSelectSchema = createSelectSchema(parcelLocations);
export type ParcelLocationsSelectSchema = z.infer<typeof parcelLocationsSelectSchema>;
export type ParcelLocationModel = InferModel<typeof parcelLocations>;

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
export type OrdersInsertSchema = z.infer<typeof ordersInsertSchema>;
export const ordersSelectSchema = createSelectSchema(orders);
export type OrdersSelectSchema = z.infer<typeof ordersSelectSchema>;
export type OrderModel = InferModel<typeof orders>;

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
export type OrderAddressesInsertSchema = z.infer<typeof orderAddressesInsertSchema>;
export const orderAddressesSelectSchema = createSelectSchema(orderAddresses);
export type OrderAddressesSelectSchema = z.infer<typeof orderAddressesSelectSchema>;
export type OrderAddressModel = InferModel<typeof orderAddresses>;

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
export type OrderItemsInsertSchema = z.infer<typeof orderItemsInsertSchema>;
export const orderItemsSelectSchema = createSelectSchema(orderItems);
export type OrderItemsSelectSchema = z.infer<typeof orderItemsSelectSchema>;
export type OrderItemModel = InferModel<typeof orderItems>;

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
export type WishlistedProductsInsertSchema = z.infer<typeof wishlistedProductsInsertSchema>;
export const wishlistedProductsSelectSchema = createSelectSchema(wishlistedProducts);
export type WishlistedProductsSelectSchema = z.infer<typeof wishlistedProductsSelectSchema>;
export type WishlistedProductModel = InferModel<typeof wishlistedProducts>;

export const ordersRelations = relations(
    orders,
    ({ many, one }) => ({
        orderItems: many(orderItems),
        orderAddress: one(orderAddresses)
    })
)

export const orderAddressesRelations = relations(
    orderAddresses,
    ({ one}) => ({
        order: one(
            orders,
            {
                fields: [orderAddresses.orderId],
                references: [orders.id]
            }
        )
    })
)

export const orderItemsRelations = relations(
    orderItems,
    ({ one }) => ({
        order: one(
            orders,
            {
                fields: [orderItems.orderId],
                references: [orders.id]
            }
        ),
        product: one(
            products,
            {
                fields: [orderItems.productId],
                references: [products.id]
            }
        )
    })
)
