import { z } from "zod";
import {
    createTRPCRouter,
    publicProcedure
} from "~/server/api/trpc";
import { db } from "@corazon/sale-fe/src/server/db";
import { kv } from '@vercel/kv';
import { products as productsTable } from "@corazon/sale-fe/src/server/schema";
import { eq } from "drizzle-orm";

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
    addToCart: publicProcedure
        .input(
            z.object({
                productId: z.number(),
                quantity: z.number(),
            })
        )
        .mutation(async ({ input: { productId, quantity }, ctx: { auth: { userId } } }) => {
            const cart = await kv.get(`cart-${userId}`);
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
                    price: product.price,
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
        }),
});