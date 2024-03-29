import { db } from "@corazon/sale-fe/src/server/db";
import { auth } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { ArrowRightCircle } from "lucide-react";
import { redirect } from "next/navigation";
import {
    orders as ordersTable,
} from "@corazon/sale-fe/src/server/schema";
import { eq } from "drizzle-orm";

export default async function Page() {
    const { userId } = auth();

    if (!userId) {
        return redirect('/sign-in')
    }

    const orders = await db
        .select()
        .from(ordersTable)
        .where(
            eq(ordersTable.userId, userId)
        )

    return (
        <div>
            <h2
                className="text-foreground/90 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
            >
                Orders
            </h2>
            <div
                className="mt-5 flex flex-col gap-3"
            >
                {
                    orders.map(
                        ({ id, status, productsAmount, shippingPrice }) => (
                            <div
                                className="border rounded p-2"
                            >
                                <div
                                    className="text-foreground/90 flex justify-between items-center"
                                >
                                    <div
                                        className="font-semibold"
                                    >
                                        Order #{id}
                                    </div>
                                    <Link
                                        href={`/my-account/orders/${id}`}
                                    >
                                        <Button
                                            variant="link"
                                            className="py-0 px-0 h-auto"
                                        >
                                            View details
                                            <ArrowRightCircle
                                                className="inline-block ml-1"
                                                size={16}
                                            />
                                        </Button>
                                    </Link>
                                </div>
                                <div
                                    className="text-foreground/90"
                                >
                                    Amount: <span className="font-semibold">${(new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })).format((productsAmount + shippingPrice)/100)}</span>
                                </div>
                                <div
                                    className="text-foreground/90"
                                >
                                    Status: <span className="capitalize font-semibold text-orange-400">{status}</span>
                                </div>
                            </div>
                        )
                    )
                }
            </div>
        </div>
    );
}

export const dynamic = 'force-dynamic';
