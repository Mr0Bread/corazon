import PageContent from "./page-content";
import { db } from '@corazon/sale-fe/src/server/db'
import { categories as categoriesTable } from "@corazon/sale-fe/src/server/schema";
import { isNull } from 'drizzle-orm'

export default async function Page() {
    const rootCategory = (await db
        .select()
        .from(categoriesTable)
        .where(
            isNull(categoriesTable.parentId)
        ))[0]

    if (!rootCategory) {
        return (
            <div>
                {`Root category not found`}
            </div>
        );
    }

    const categories = await db
        .select()
        .from(categoriesTable)

    return (
        <PageContent
            rootCategory={rootCategory}
            categories={categories}
        />
    );
}