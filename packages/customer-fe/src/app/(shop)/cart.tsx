import { kv } from "@vercel/kv";
import { auth } from "@clerk/nextjs";
import CartItems from "./cart-items";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { CreditCard } from "lucide-react";

export default async function Cart() {
    const { userId } = auth();

    if (!userId) {
        return (
            <div
                className="text-foreground/90"
            >
                Sign in to view your cart
            </div>
        );
    }

    const redisCart = await kv.get(`cart-${userId}`);

    if (!redisCart) {
        await kv.set(`cart-${userId}`, JSON.stringify({
            items: [],
            total: 0
        }));

        return (
            <div
                className="text-foreground/90"
            >
                Your cart is empty
            </div>
        );
    }

    const { items = [], total } = redisCart as any;

    const isCartEmpty = items.length === 0;

    return (
        <div
            className="text-foreground/90 relative h-full"
        >
            {
                !isCartEmpty ? (
                    <CartItems
                        items={items}
                        total={total}
                    />
                ) : (
                    <div
                        className="text-foreground/90"
                    >
                        Your cart is empty
                    </div>
                )
            }
        </div>
    );
}