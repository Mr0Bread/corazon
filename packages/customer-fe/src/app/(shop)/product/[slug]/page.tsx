import { db } from "@corazon/sale-fe/src/server/db";
import {
    products as productsTable,
    wishlistedProducts as wishlistedProductsTable
} from "@corazon/sale-fe/src/server/schema";
import { eq, and } from "drizzle-orm";
import Gallery from "./image-gallery";
import QuickAddButton from "../../products/[...slug]/quick-add-button";
import WishProductButton from "./wish-product-button";
import { currentUser } from "@clerk/nextjs";

export default async function Page({
    params: {
        slug
    }
}: {
    params: {
        slug: string
    }
}) {
    const user = await currentUser();

    const productId = Number(slug.split('-').pop());

    const product = (await db
        .select()
        .from(productsTable)
        .where(
            eq(
                productsTable.id,
                productId
            )
        ))[0]

    if (!product) {
        return (
            <div>
                {`Product: ${productId} not found`}
            </div>
        );
    }

    const wishlistedProduct = user ? (await db
        .select()
        .from(wishlistedProductsTable)
        .where(
            and(
                eq(wishlistedProductsTable.productId, productId),
                eq(wishlistedProductsTable.userId, user.id)
            )
        ))[0] : null;
    const isWished = Boolean(wishlistedProduct);

    const {
        name,
        images: imagesJson,
        description,
        basePrice,
        discountAmount,
        finalPrice
    } = product;

    const images = JSON.parse(imagesJson as string) as { images: string[] };

    return (
        <div
            className="max-w-7xl px-10"
        >
            <h2
                className="text-foreground/90 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
            >
                {name}
            </h2>
            <div
                className="grid grid-cols-2 mt-6 gap-5"
            >
                <Gallery
                    images={
                        images.images.map(
                            (image) => ({
                                original: image,
                                thumbnail: image
                            })
                        )
                    }
                />
                <div>
                    <div
                        className="text-xl font-semibold text-foreground/90"
                    >
                        {description}
                    </div>
                    {
                        discountAmount > 0 ? (
                            <div
                                className="grid grid-cols-[max-content_auto] grid-rows-2 gap-x-2 mt-4"
                            >
                                <div
                                    className="line-through text-foreground/60 col-start-2"
                                >
                                    {`$${new Intl.NumberFormat('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(basePrice / 100)}`}
                                </div>
                                <div
                                    className="text-xl font-semibold text-foreground/90 col-start-1 row-start-2"
                                >
                                    Price:
                                </div>
                                <div
                                    className="text-orange-300 text-xl col-start-2 row-start-2"
                                >
                                {`$${new Intl.NumberFormat('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(finalPrice / 100)}`}
                                </div>
                            </div>
                        ) : (
                            <div
                                className="text-xl font-semibold text-foreground/90 mt-4"
                            >
                                Price: <span className="text-orange-400">{`$${new Intl.NumberFormat('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(finalPrice / 100)}`}</span>
                            </div>
                        )
                    }
                    <div
                        className="flex gap-4 items-center mt-4"
                    >
                        <QuickAddButton
                            productId={productId}
                        />
                        <WishProductButton
                            productId={productId}
                            isWished={isWished}
                        />
                    </div>
                </div>
            </div>
        </div >
    )
}