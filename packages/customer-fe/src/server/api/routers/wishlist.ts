import { z } from "zod";
import {
    createTRPCRouter,
    publicProcedure
} from "~/server/api/trpc";
import { currentUser } from "@clerk/nextjs";
import { db } from "@corazon/sale-fe/src/server/db";
import { wishlistedProducts } from "@corazon/sale-fe/src/server/schema";
import { eq, and } from 'drizzle-orm'

export const wishlistRouter = createTRPCRouter({
    wishlistProduct: publicProcedure
        .input(z.object({ productId: z.number() }))
        .mutation(async ({ input: { productId } }) => {
            const user = await currentUser();

            if (!user) {
                throw new Error("User not found");
            }

            const { id } = user;

            await db
                .insert(wishlistedProducts)
                .values({
                    userId: id,
                    productId
                })
        }),
    unwishlistProduct: publicProcedure
        .input(z.object({ productId: z.number() }))
        .mutation(async ({ input: { productId } }) => {
            const user = await currentUser();

            if (!user) {
                throw new Error("User not found");
            }

            const { id } = user;

            await db
                .delete(wishlistedProducts)
                .where(
                    and(
                        eq(wishlistedProducts.userId, id),
                        eq(wishlistedProducts.productId, productId)
                    )
                )
        }
        )
})