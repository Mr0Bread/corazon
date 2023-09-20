import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { db } from "~/server/db";
import { products, productsToCategories } from "~/server/schema";
import { eq, sql } from "drizzle-orm";

export const productsRouter = createTRPCRouter({
    delete: protectedProcedure
        .input(
            z.object({
                id: z.number(),
            })
        )
        .mutation(
            async ({ input }) => {
                const {
                    id: productId
                } = input;

                await db.delete(products)
                    .where(
                        eq(
                            products.id,
                            productId
                        )
                    )
                
                await db.delete(productsToCategories)
                    .where(
                        eq(
                            productsToCategories.productId,
                            productId
                        )
                    )
            }
        ),
    update: protectedProcedure
        .input(
            z.object({
                data: z.object({
                    id: z.number(),
                    name: z.string(),
                    basePrice: z.number(),
                    description: z.string(),
                    quantity: z.number(),
                    categories: z.array(z.string()),
                    images: z.array(z.string()),
                    discount: z.object({
                        type: z.enum(['percentage', 'fixed']),
                        value: z.number()
                    }).optional()
                }),
            })
        )
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
                    discount: sourceDiscount,
                    ...insertValues
                } = input.data;
                const images = {
                    images: sourceImages
                };

                const discount = sourceDiscount ? {
                    discountType: sourceDiscount.type,
                    discountValue: sourceDiscount.value
                } : null;

                const {
                    basePrice
                } = insertValues;

                // TODO: double check if calculations are correct
                const discountAmount = discount ? discount.discountType === 'percentage' ? Math.floor(basePrice * discount.discountValue / 100) : discount.discountValue : 0;
                const discountPercentage = discount ? discount.discountType === 'percentage' ? discount.discountValue : Math.ceil(discount.discountValue * 100 / basePrice) : 0;
                const finalPrice = basePrice - discountAmount;

                await db.update(products)
                    .set({
                        ...insertValues,
                        images: JSON.stringify(images),
                        userId,
                        discountAmount,
                        discountPercentage,
                        finalPrice
                    })
                    .where(eq(products.id, input.data.id))

                await db.delete(productsToCategories)
                    .where(
                        eq(
                            productsToCategories.productId,
                            input.data.id  
                        )
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
    create: protectedProcedure
        .input(z.object({
            data: z.object({
                name: z.string(),
                basePrice: z.number(),
                description: z.string(),
                quantity: z.number(),
                categories: z.array(z.string()),
                images: z.array(z.string()),
                discount: z.object({
                    type: z.enum(['percentage', 'fixed']),
                    value: z.number()
                }).optional()
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
                    discount: sourceDiscount,
                    ...insertValues
                } = input.data;
                const images = {
                    images: sourceImages
                };

                const discount = sourceDiscount ? {
                    discountType: sourceDiscount.type,
                    discountValue: sourceDiscount.value
                } : null;

                const {
                    basePrice
                } = insertValues;

                // TODO: double check if calculations are correct
                const discountAmount = discount ? discount.discountType === 'percentage' ? Math.floor(basePrice * discount.discountValue / 100) : discount.discountValue : 0;
                const discountPercentage = discount ? discount.discountType === 'percentage' ? discount.discountValue : Math.ceil(discount.discountValue * 100 / basePrice) : 0;
                const finalPrice = basePrice - discountAmount;

                await db.insert(products)
                    .values({
                        ...insertValues,
                        images: JSON.stringify(images),
                        userId,
                        discountAmount,
                        discountPercentage,
                        finalPrice
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