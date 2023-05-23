import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { db } from "~/server/db";
import { products, productsToCategories } from "~/server/schema";
import { sql } from "drizzle-orm";

export const productsRouter = createTRPCRouter({
    create: protectedProcedure
        .input(z.object({
            data: z.object({
                name: z.string(),
                price: z.number(),
                description: z.string(),
                quantity: z.number(),
                categories: z.array(z.string()),
                images: z.array(z.string()),
            }),
        }))
        .mutation(
            async ({ ctx, input }) => {
                const {
                    auth: {
                        userId
                    }
                } = ctx
                const {
                    images: sourceImages,
                    categories,
                    ...insertValues
                } = input.data;
                const images = {
                    images: sourceImages
                };

                await db.insert(products)
                    .values({
                        ...insertValues,
                        images: JSON.stringify(images),
                        userId
                    });
                
                await db.execute(
                    sql`SET @last_id_in_products = LAST_INSERT_ID();`
                )

                await db.insert(productsToCategories)
                    .values(
                        input.data.categories.map(
                            (categoryId) => ({
                                productId: sql`@last_id_in_products`,
                                categoryId: Number(categoryId)
                            })
                        )
                    );
            }
        ),
});