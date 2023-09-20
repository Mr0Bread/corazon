import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from 'zod';
import { db } from "@corazon/sale-fe/src/server/db";
import {
    products as productsTable,
    productsSelectSchema,
    type ProductModel
} from "@corazon/sale-fe/src/server/schema";
import { eq } from 'drizzle-orm'

export const productsRouter = createTRPCRouter({
    getProducts: protectedProcedure
        .input(
            z.object({
                pagination: z.object({
                    pageNumber: z.number(),
                    size: z.number()
                })
            })
        )
        .output(
            z.object({
                products: z.array(
                    productsSelectSchema
                        .extend({
                            images: z.unknown()
                        })
                ),
            })
        )
        .query(async ({ input: { pagination } }) => {
            const products = await db
                .select()
                .from(productsTable)
                .limit(pagination.size)
                .offset((pagination.pageNumber - 1) * pagination.size)

            return {
                products
            };
        })

})