import { db } from '@corazon/sale-fe/src/server/db'
import {
    categories as categoriesTable,
    productsToCategories,
    categoriesToChildren as categoriesToChildrenTable,
} from '@corazon/sale-fe/src/server/schema'
import { eq, inArray, or, sql } from 'drizzle-orm'
import { Suspense } from 'react';
import ProductCard from './product-card';
import ProductCardFallback from './product-card-fallback';
import Link from 'next/link';

export default async function Page({
    params,
    searchParams: {
        page = '1'
    }
}: {
    params: { slug: string[] },
    searchParams: {
        page?: string,
    }
}) {
    const slug = params.slug.join('/');
    const categories = await db
        .select()
        .from(categoriesTable)
        .where(eq(
            categoriesTable.slug,
            slug
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
        .select({
            productId: productsToCategories.productId
        })
        .from(productsToCategories)
        .where(
            or(
                inArray(
                    productsToCategories.categoryId,
                    db
                        .select({
                            childId: categoriesToChildrenTable.childId
                        })
                        .from(categoriesToChildrenTable)
                        .where(
                            eq(categoriesToChildrenTable.parentId, category.id)
                        )
                ),
                eq(
                    productsToCategories.categoryId,
                    category.id
                )
            )
        )
        .groupBy(productsToCategories.productId)
        .limit(20)
        .offset((parseInt(page) - 1) * 20);

    const { count } = (await db
        .select({
            count: sql`COUNT(*)`.mapWith(Number)
        })
        .from(
            db
                .select({
                    productId: productsToCategories.productId
                })
                .from(productsToCategories)
                .where(
                    or(
                        inArray(
                            productsToCategories.categoryId,
                            db
                                .select({
                                    childId: categoriesToChildrenTable.childId
                                })
                                .from(categoriesToChildrenTable)
                                .where(
                                    eq(categoriesToChildrenTable.parentId, category.id)
                                )
                        ),
                        eq(
                            productsToCategories.categoryId,
                            category.id
                        )
                    )
                )
                .groupBy(productsToCategories.productId)
                .as('linkedProducts')
        ))[0] || { count: 0 };

    const numberOfPages = Math.ceil(count / 20);

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
                            <ProductCard
                                id={linkedProduct.productId}
                            />
                        </Suspense>
                    ))
                }
            </div>
            {
                numberOfPages > 1 && (
                    <div
                        className='mt-6 flex flex-row gap-4'
                    >
                        {
                            Array
                                .from({ length: numberOfPages })
                                .map((_, index) => (
                                    <Link
                                        href={`/products/${slug}?page=${index + 1}`}
                                        className='py-2 px-3 border rounded text-foreground/90 hover:bg-accent hover:text-accent-foreground transition-colors'
                                    >
                                        {index + 1}
                                    </Link>
                                ))
                        }
                    </div>
                )
            }
        </div>
    );
}
