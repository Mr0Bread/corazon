import { currentUser } from "@clerk/nextjs";
import { db } from "@corazon/sale-fe/src/server/db";
import { wishlistedProducts as wishlistedProductsTable } from "@corazon/sale-fe/src/server/schema";
import { eq } from "drizzle-orm";
import { Suspense } from 'react';
import ProductCardFallback from "../../products/[...slug]/product-card-fallback";
import ProductCard from "./product-card";

export default async function Page() {
    const user = await currentUser();

    if (!user) {
        return (
            <div>
                {`You must be logged in to view this page`}
            </div>
        );
    }

    const products = await db
        .select({
            productId: wishlistedProductsTable.productId
        })
        .from(wishlistedProductsTable)
        .where(
            eq(wishlistedProductsTable.userId, user.id)
        )

    return (
        <div>
            <h2
                className="text-foreground/90 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
            >
                Wishlist
            </h2>
            <div
                className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
                {
                    products.map(
                        ({ productId }) => (
                            <Suspense
                                key={productId}
                                fallback={<ProductCardFallback />}
                            >
                                <ProductCard
                                    id={productId}
                                />
                            </Suspense>
                        )
                    )
                }
            </div>
        </div>
    );
}

export const dynamic = 'force-dynamic';
