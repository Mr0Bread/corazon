import { z } from "zod";
import {
    createTRPCRouter,
    publicProcedure
} from "~/server/api/trpc";
import { db } from "@corazon/sale-fe/src/server/db";
import { kv } from '@vercel/kv';
import { products as productsTable } from "@corazon/sale-fe/src/server/schema";
import { eq, inArray } from "drizzle-orm";
import { log } from 'next-axiom'
import { measure } from "~/utils/measure";

const cartSchema = z.object({
    items: z.array(
        z.object({
            productId: z.number(),
            quantity: z.number(),
            name: z.string(),
            price: z.number(),
            image: z.string(),
        })
    ),
    total: z.number(),
});

export const cartRouter = createTRPCRouter({
    getCart: publicProcedure
        .output(
            cartSchema
        )
        .query(async ({ ctx: { auth: { userId } } }) => {
            const cart = await kv.get(`cart-${userId}`);

            return cart as z.infer<typeof cartSchema>;
        }),
    removeItem: publicProcedure
        .input(
            z.object({
                productId: z.number(),
            })
        )
        .mutation(async ({ input: { productId }, ctx: { auth: { userId } } }) => {
            const cart = await kv.get(`cart-${userId}`);
            const { items = [] } = cart as any;

            const newItems = items.filter((item: any) => item.productId !== productId);

            // calculate total
            const total = newItems.reduce((acc: number, item: any) => {
                return acc + (item.price * item.quantity);
            }, 0);

            await kv.set(`cart-${userId}`, JSON.stringify({
                items: newItems,
                total
            }));
        }),
    removeItems: publicProcedure
        .input(
            z.object({
                productIds: z.array(
                    z.number()
                ),
            })
        )
        .mutation(async ({ input: { productIds }, ctx: { auth: { userId } } }) => {
            const cart = await kv.get(`cart-${userId}`) as z.infer<typeof cartSchema>;
            const { items = [] } = cart;

            const newItems = items.filter((item: any) => !productIds.includes(item.productId));

            // calculate total
            const total = newItems.reduce((acc: number, item: any) => {
                return acc + (item.price * item.quantity);
            }, 0);

            await kv.set(`cart-${userId}`, JSON.stringify({
                items: newItems,
                total
            }));
        }),
    decreaseQuantity: publicProcedure
        .input(
            z.object({
                productId: z.number(),
            })
        )
        .mutation(async ({ input: { productId }, ctx: { auth: { userId } } }) => {
            const cart = await kv.get(`cart-${userId}`);
            const { items = [] } = cart as any;

            const newItems = items
                .map((item: any) => {
                    if (item.productId === productId) {
                        item.quantity -= 1;
                    }

                    return item;
                })
                .filter((item: any) => item.quantity > 0);

            // calculate total
            const total = newItems.reduce((acc: number, item: any) => {
                return acc + (item.price * item.quantity);
            }, 0);

            await kv.set(`cart-${userId}`, JSON.stringify({
                items: newItems,
                total
            }));
        }),
    setQuantity: publicProcedure
        .input(
            z.object({
                productId: z.number(),
                quantity: z.number(),
            })
        )
        .mutation(async ({ input: { productId, quantity }, ctx: { auth: { userId } } }) => {
            const cart = await kv.get(`cart-${userId}`);
            const { items = [] } = cart as any;

            const newItems = items
                .map((item: any) => {
                    if (item.productId === productId) {
                        item.quantity = quantity;
                    }

                    return item;
                }
                )

            // calculate total
            const total = newItems.reduce((acc: number, item: any) => {
                return acc + (item.price * item.quantity);
            }, 0);

            await kv.set(`cart-${userId}`, JSON.stringify({
                items: newItems,
                total
            }));

        }),
    addToCart: publicProcedure
        .input(
            z.object({
                productId: z.number(),
                quantity: z.number(),
            })
        )
        .mutation(async ({ input: { productId, quantity }, ctx: { auth: { userId } } }) => {
            await measure(
                async () => {
                    const products = await db
                        .select()
                        .from(productsTable)
                        .where(
                            eq(productsTable.id, productId)
                        )

                    const product = products[0];

                    if (!product) {
                        throw new Error('Product not found');
                    }

                    const cart = await measure(() => kv.get(`cart-${userId}`), (duration) => {
                        log.info(`KV getCart took: ${parseInt(duration.toString())}`)
                    })

                    const { items = [] } = cart as any;
                    const images = JSON.parse(product.images as string) as { images: string[] };
                    const image = images?.images[0] || '';

                    // if item exists, increment quantity
                    const item = items.find((item: any) => item.productId === productId);

                    if (item) {
                        item.quantity += quantity;
                    } else {
                        items.push({
                            productId,
                            quantity,
                            name: product.name,
                            price: product.finalPrice,
                            image
                        });
                    }

                    // calculate total
                    const total = items.reduce((acc: number, item: any) => {
                        return acc + (item.price * item.quantity);
                    }, 0);

                    await kv.set(`cart-${userId}`, JSON.stringify({
                        items,
                        total
                    }));
                },
                (duration) => {
                    log.info(`KV addToCart took: ${parseInt(duration.toString())}`)
                }
            )
        }),
    getMissingItems: publicProcedure
        .output(
            z.object({
                missingItems: z.array(z.number())
            })
        )
        .query(
            async ({
                ctx: {
                    auth: {
                        userId
                    }
                }
            }) => {
                const {
                    items
                } = await kv.get(`cart-${userId}`) as z.infer<typeof cartSchema>;

                const itemsIds = items
                    .map(
                        (item) => item.productId
                    )

                const products = await db
                    .select({
                        id: productsTable.id
                    })
                    .from(productsTable)
                    .where(
                        inArray(
                            productsTable.id,
                            itemsIds
                        )
                    )

                const missingItems = itemsIds
                    .filter(
                        (id) => !Boolean(
                            products.find(
                                (product) => product.id === id
                            )
                        )
                    )

                return {
                    missingItems
                };
            }
        )
});