import Link from "next/link";
import { Button } from "~/components/ui/button";
import { db } from "~/server/db";
import { products } from "~/server/schema";

export default async function Page() {
    const goods = await db.select().from(products).limit(10);
    
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
            <div>
                {
                    goods.map((good) => (
                        <div
                            key={good.id}
                        >
                            {good.name}
                        </div>
                    ))
                }
            </div>
        </div>
    );
}