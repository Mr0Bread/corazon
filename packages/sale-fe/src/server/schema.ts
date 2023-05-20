import { int, mysqlTable, serial, varchar } from 'drizzle-orm/mysql-core';

export const products = mysqlTable(
    'products',
    {
        id: serial('id').primaryKey(),
        price: int('price').notNull(),
        name: varchar('name', { length: 256 }).notNull(),
        description: varchar('description', { length: 256 }).notNull(),
        quantity: int('quantity').notNull(),
        userId: varchar('user_id', { length: 256 }).notNull(),
    }
);
