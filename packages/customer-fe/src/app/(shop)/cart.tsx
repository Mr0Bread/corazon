import { kv } from "@vercel/kv";
import { auth } from "@clerk/nextjs";
import CartItems from "./cart-items";

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
                className="text-foreground/90 relative h-full"
            >
                <CartItems
                    items={[]}
                    total={0}
                />
            </div>
        );
    }

    const { items = [], total = 0 } = redisCart as any;

    return (
        <div
            className="text-foreground/90 relative h-full"
        >
            <CartItems
                items={items}
                total={total}
            />
        </div>
    );
}