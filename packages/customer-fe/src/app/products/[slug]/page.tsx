import { db } from '@corazon/sale-fe/src/server/db'
import { categories as categoriesTable, productsToCategories } from '@corazon/sale-fe/src/server/schema'
import { eq } from 'drizzle-orm'
import { Suspense } from 'react';
import ProductCard from './product-card';
import ProductCardFallback from './product-card-fallback';

export default async function Page({ params }: { params: { slug: string } }) {
    const categories = await db
        .select()
        .from(categoriesTable)
        .where(eq(
            categoriesTable.slug,
            params.slug
        ));

    if (!categories || !categories.length || !categories[0]) {
        return (
            <div>
                {`Category: ${params.slug} not found`}
            </div>
        );
    }

    const category = categories[0];

    const linkedProducts = await db
        .select()
        .from(productsToCategories)
        .where(
            eq(
                productsToCategories.categoryId,
                // I have condition to check that category is present
                // but for some reason typescript still thinks that it can be undefined
                category.id
            )
        );

    return (
        <div
            className="w-full"
        >
            <h2
                className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0 text-foreground/90 w-full"
            >
                {category.name}
            </h2>
            <p
                className="text-lg text-foreground/80"
            >
                {category.description}
            </p>
            <div
                className='grid grid-cols-1 gap-10 mt-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            >
                {
                    linkedProducts.map(linkedProduct => (
                        <Suspense
                            key={linkedProduct.productId}
                            fallback={<ProductCardFallback />}
                        >
                            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                            {/* @ts-expect-error */}
                            <ProductCard
                                id={linkedProduct.productId}
                            />
                        </Suspense>
                    ))
                }
            </div>
        </div>
    );
}
