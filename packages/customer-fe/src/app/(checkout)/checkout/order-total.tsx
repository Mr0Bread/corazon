'use client';

import { shipmentPriceAtom } from "./checkout-form";
import { useAtomValue } from "jotai";

export default function OrderTotal({
    total
}: {
    total: number
}) {
    const shipmentPrice = useAtomValue(shipmentPriceAtom);

    const grandTotal = total + shipmentPrice;

    return (
        <div
            className="flex justify-between items-center mt-4 text-foreground/90 text-2xl font-semibold"
        >
            <div>
                Total
            </div>
            <div>
                {`${new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format((grandTotal/100).toFixed(2))}$`}
            </div>
        </div>
    );
}