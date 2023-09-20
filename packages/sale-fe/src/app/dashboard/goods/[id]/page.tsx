import { and, eq } from "drizzle-orm";
import ProductForm from "./form";
import { db } from "~/server/db";
import { 
    categories as categoriesTable,
    products as productsTable,
    productsToCategories as productsToCategoriesTable
} from "~/server/schema";
import { currentUser } from "@clerk/nextjs";

export default async function Page({
    params: {
        id
    }
}: {
    params: {
        id: string
    }
}) {
    const user = await currentUser();

    if (!user) {
        return (
            <div>
                {`You must be logged in to view this page`}
            </div>
        );
    }

    const categories = await db
        .select()
        .from(categoriesTable)
        .execute();
    const product = (await db
        .select()
        .from(productsTable)
        .where(
            and(
                eq(productsTable.id, Number(id)),
                eq(productsTable.userId, user.id)
            )
        ))[0]

    if (!product) {
        return (
            <div>
                {`Product: ${id} not found`}
            </div>
        );
    }

    const productToCategories = await db
        .select()
        .from(productsToCategoriesTable)
        .leftJoin(
            categoriesTable,
            eq(categoriesTable.id, productsToCategoriesTable.categoryId)
        )
        .where(
            eq(productsToCategoriesTable.productId, product.id)
        )
    const assignedCategories = productToCategories
            .map(
                ({ categories }) => {
                    if (!categories) {
                        return null;
                    }

                    const { id } = categories;

                    return String(id);
                }
            )
            .filter(Boolean)
    const imagesJson = JSON.parse(product.images as string) as { images: string[] };

    return (
        <div>
            <h2
                className="text-foreground/90 mb-4 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
            >
                {`Edit Product: ${product.name}`}
            </h2>
            <ProductForm
                categories={categories}
                product={{
                    ...product,
                    categories: assignedCategories as string[],
                    basePrice: String(product.basePrice),
                    quantity: String(product.quantity),
                    images: imagesJson.images
                }}
            />
        </div>
    );
}