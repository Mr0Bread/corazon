import ProductForm from "./form";
import { db } from "~/server/db";
import { categories } from "~/server/schema";
import { CategoriesSelectSchema } from "~/server/schema";

export default async function Page() {
    const res = await db.select().from(categories).execute();

    return (
        <div>
            <ProductForm
                categories={res as CategoriesSelectSchema[]}
            />
        </div>
    );
}