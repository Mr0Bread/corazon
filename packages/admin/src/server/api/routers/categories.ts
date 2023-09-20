import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from 'zod';
import { db } from "@corazon/sale-fe/src/server/db";
import {
    categories as categoriesTable,
    categoriesToChildren as categoriesToChildrenTable,
    productsToCategories as productsToCategoriesTable,
    products as productsTable,
    type CategoryModel,
    type ProductModel
} from "@corazon/sale-fe/src/server/schema";
import { eq, sql, ne } from 'drizzle-orm'

export const categoriesRouter = createTRPCRouter({
    getCategory: protectedProcedure
        .input(
            z.object({
                id: z.number()
            })
        )
        .output(
            z.object({
                category: z.object({
                    id: z.number(),
                    name: z.string(),
                    parentId: z.number().nullable(),
                    slug: z.string(),
                    description: z.string(),
                })
            })
        )
        .mutation(
            async ({ input }) => {
                const category = (await db
                    .select()
                    .from(categoriesTable)
                    .where(
                        eq(categoriesTable.id, input.id)
                    ))[0]

                if (!category) {
                    throw new Error('Category not found')
                }

                return {
                    category
                }
            }),
    getDirectChildren: protectedProcedure
        .input(
            z.object({
                parentId: z.number()
            })
        )
        .output(
            z.object({
                categories: z.array(
                    z.object({
                        id: z.number(),
                        name: z.string(),
                        parentId: z.number().nullable(),
                        slug: z.string(),
                        description: z.string(),
                    })
                )
            })
        )
        .mutation(
            async ({ input }) => {
                const categories = await db
                    .select()
                    .from(categoriesTable)
                    .where(
                        eq(categoriesTable.parentId, input.parentId)
                    )

                return {
                    categories
                }
            }
        ),
    getChildren: protectedProcedure
        .input(
            z.object({
                parentId: z.number()
            })
        )
        .output(
            z.object({
                categories: z.array(
                    z.object({
                        id: z.number(),
                        name: z.string(),
                        parentId: z.number().nullable(),
                        slug: z.string(),
                        description: z.string(),
                    })
                )
            })
        )
        .mutation(
            async ({ input }) => {
                const result = await db
                    .select()
                    .from(categoriesToChildrenTable)
                    .leftJoin(
                        categoriesTable,
                        eq(categoriesToChildrenTable.childId, categoriesTable.id)
                    )
                    .where(
                        eq(categoriesToChildrenTable.parentId, input.parentId)
                    )

                const categories = result
                    .filter(
                        (item) => !!item.categories
                    )
                    .map(
                        (item) => item.categories
                    ) as CategoryModel[]

                return {
                    categories
                }
            }
        ),
    getProducts: protectedProcedure
        .input(
            z.object({
                categoryId: z.number(),
                pagination: z.object({
                    page: z.number().int().positive().default(1),
                    perPage: z.number().int().positive().default(10)
                }).default({
                    page: 1,
                    perPage: 10
                })
            })
        )
        .output(
            z.object({
                products: z.array(
                    z.object({
                        id: z.number(),
                        name: z.string(),
                        price: z.number(),
                        userId: z.string(),
                        description: z.string(),
                        quantity: z.number(),
                        images: z.unknown()
                    })
                ),
                totalCount: z.number()
            })
        )
        .mutation(
            async ({ input: { categoryId, pagination } }) => {
                const result = await db
                    .select()
                    .from(productsToCategoriesTable)
                    .leftJoin(
                        productsTable,
                        eq(productsToCategoriesTable.productId, productsTable.id)
                    )
                    .where(
                        eq(productsToCategoriesTable.categoryId, categoryId)
                    )
                    .limit(pagination.perPage)
                    .offset((pagination.page - 1) * pagination.perPage)
                const totalCount = Number(
                    (await db
                        .select({
                            count: sql<string>`COUNT(*)`
                        })
                        .from(productsToCategoriesTable)
                        .leftJoin(
                            productsTable,
                            eq(productsToCategoriesTable.productId, productsTable.id)
                        )
                        .where(
                            eq(productsToCategoriesTable.categoryId, categoryId)
                        ))[0]?.count ?? 0
                );

                const products = result
                    .filter(
                        (item) => !!item.products
                    )
                    .map(
                        (item) => item.products
                    ) as ProductModel[]

                return {
                    products,
                    totalCount
                }
            }
        ),
    getUnassignedProducts: protectedProcedure
        .input(
            z.object({
                categoryId: z.number(),
                pagination: z.object({
                    page: z.number().int().positive().default(1),
                    perPage: z.number().int().positive().default(10)
                }).default({
                    page: 1,
                    perPage: 10
                })
            })
        )
        .output(
            z.object({
                products: z.array(
                    z.object({
                        id: z.number(),
                        name: z.string(),
                        price: z.number(),
                        userId: z.string(),
                        description: z.string(),
                        quantity: z.number(),
                        images: z.unknown()
                    })
                ),
                totalCount: z.number()
            })
        )
        .mutation(
            async ({ input: { categoryId, pagination } }) => {
                const result = await db
                    .select()
                    .from(productsToCategoriesTable)
                    .leftJoin(
                        productsTable,
                        eq(productsToCategoriesTable.productId, productsTable.id)
                    )
                    .where(
                        ne(productsToCategoriesTable.categoryId, categoryId)
                    )
                    .limit(pagination.perPage)
                    .offset((pagination.page - 1) * pagination.perPage)
                const totalCount = Number(
                    (await db
                        .select({
                            count: sql<string>`COUNT(*)`
                        })
                        .from(productsToCategoriesTable)
                        .leftJoin(
                            productsTable,
                            eq(productsToCategoriesTable.productId, productsTable.id)
                        )
                        .where(
                            ne(productsToCategoriesTable.categoryId, categoryId)
                        ))[0]?.count ?? 0
                );

                const products = result
                    .filter(
                        (item) => !!item.products
                    )
                    .map(
                        (item) => item.products
                    ) as ProductModel[]

                return {
                    products,
                    totalCount
                }
            }
        ),
    create: protectedProcedure
        .input(
            z.object({
                name: z.string(),
                parentId: z.number().nullable(),
                slug: z.string(),
                description: z.string()
            })
        )
        .mutation(
            async ({ input }) => {
                await db.transaction(
                    async (trx) => {
                        await trx
                            .insert(categoriesTable)
                            .values({
                                name: input.name,
                                parentId: input.parentId,
                                slug: input.slug,
                                description: input.description
                            })

                        await trx.execute(
                            sql`SET @last_id_in_categories = LAST_INSERT_ID();`
                        )

                        if (!input.parentId) {
                            return
                        }

                        await trx
                            .insert(categoriesToChildrenTable)
                            .values({
                                parentId: input.parentId,
                                childId: sql`@last_id_in_categories`
                            })

                        let upperParentId = input.parentId

                        while (upperParentId) {
                            const upperParent = (await trx
                                .select()
                                .from(categoriesTable)
                                .where(
                                    eq(categoriesTable.id, upperParentId)
                                ))[0]

                            if (!upperParent || !upperParent.parentId) {
                                break
                            }

                            await trx
                                .insert(categoriesToChildrenTable)
                                .values({
                                    parentId: upperParent.parentId,
                                    childId: sql`@last_id_in_categories`
                                })

                            upperParentId = upperParent.parentId
                        }
                    }
                )
            }
        )
})