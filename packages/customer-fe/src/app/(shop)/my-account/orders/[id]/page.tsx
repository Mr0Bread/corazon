import { db } from "@corazon/sale-fe/src/server/db";
import {
    orders as ordersTable,
    orderItems as orderItemsTable,
    products as productsTable
} from "@corazon/sale-fe/src/server/schema";
import { eq } from "drizzle-orm";

export default async function Page({
    params: {
        id
    }
}: {
    params: {
        id: string
    }
}) {
    const order = (await db
        .select()
        .from(ordersTable)
        .where(
            eq(ordersTable.id, Number(id))
        ))[0]

    if (!order) {
        return (
            <div>
                Order not found
            </div>
        )
    }

    const {
        productsAmount,
        shippingPrice
    } = order

    const grandTotal = productsAmount + shippingPrice

    return (
        <div>
            <h2
                className="text-foreground/90 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
            >
                Order #{id}
            </h2>
            <div
                className="mt-5 text-base text-foreground/90"
            >
                Order total: <span className="text-orange-300">${(new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })).format(grandTotal/100)}</span>
            </div>
        </div>
    );
}