import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import {createNewProductsProducer} from "~/server/kafka";

export const productsRouter = createTRPCRouter({
    findMany: protectedProcedure
        .input(z.object({
            where: z.object({
                userId: z.string().optional(),
            }),
            take: z.number().optional(),
        }))
        .query(
            ({ ctx, input }) => {
                return ctx.prisma.product.findMany(
                    {
                        where: input.where,
                        take: input.take,
                    }
                );
            }
        ),
    create: protectedProcedure
        .input(z.object({
            data: z.object({
                name: z.string(),
                price: z.number(),
                description: z.string(),
                quantity: z.number(),
                status: z.enum(['pending', 'enabled', 'disabled']),
            }),
        }))
        .mutation(
            async ({ ctx, input }) => {
                const {
                    auth: {
                        userId
                    }
                } = ctx

                const product = await ctx.prisma.product.create({
                    data: {
                        ...input.data,
                        userId,
                        slug: input.data.name.toLowerCase().replace(/ /g, "-"),
                    },
                });

                return createNewProductsProducer().produce(
                    'new-products',
                    {
                        productId: product.id,
                    }
                );
            }
        ),
});