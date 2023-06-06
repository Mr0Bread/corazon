import { createTRPCRouter } from "~/server/api/trpc";
import { cartRouter } from '~/server/api/routers/cart';
import { checkoutRouter } from "./routers/checkout";
import { wishlistRouter } from "./routers/wishlist";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  cart: cartRouter,
  checkout: checkoutRouter,
  wishlist: wishlistRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
