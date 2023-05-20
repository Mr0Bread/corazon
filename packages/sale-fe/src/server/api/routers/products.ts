import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { db } from "~/server/db";
import { products } from "~/server/schema";

export const productsRouter = createTRPCRouter({
    create: protectedProcedure
        .input(z.object({
            data: z.object({
                name: z.string(),
                price: z.number(),
                description: z.string(),
                quantity: z.number()
            }),
        }))
        .mutation(
            async ({ ctx, input }) => {
                const {
                    auth: {
                        userId
                    }
                } = ctx

                await db.insert(products)
                    .values({
                        ...input.data,
                        userId
                    });
            }
        ),
});