import Link from "next/link";
import { Button } from "~/components/ui/button";
import { db } from "~/server/db";
import { products } from "~/server/schema";
import GoodsTable from "./table";
import { currentUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";

export default async function Page() {
    const user = await currentUser();

    if (!user) {
        return (
            <div>
                {`You must be logged in to view this page`}
            </div>
        );
    }

    const goods = await db
        .select()
        .from(products)
        .where(
            eq(products.userId, user.id)
        )
        .limit(10);

    return (
        <div>
            <div
                className="flex justify-between items-center"
            >
                <Link
                    href="/dashboard/goods/new"
                >
                    <Button
                        variant="outline"
                        className="text-gray-300 hover:text-white hover:bg-slate-800 border-slate-800 transition-all"
                    >
                        Add new
                    </Button>
                </Link>
            </div>
            <div
                className="mt-4 text-gray-200"
            >
                <GoodsTable
                    goods={goods}
                />
            </div>
        </div>
    );
}