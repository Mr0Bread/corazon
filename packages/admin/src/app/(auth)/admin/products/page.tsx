import PageContent from "./page-content";
import { db } from '@corazon/sale-fe/src/server/db'
import { products as productsTable } from "@corazon/sale-fe/src/server/schema";

export default async function Page() {
    const products = await db
        .select()
        .from(productsTable)
        .limit(20)

    return (
        <PageContent
            products={products}
        />
    );
}