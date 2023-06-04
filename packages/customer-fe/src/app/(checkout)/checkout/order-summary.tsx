import { auth } from "@clerk/nextjs";
import { kv } from "@vercel/kv";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { ExternalLink, X } from "lucide-react";
import Image from "next/image";
import OrderTotal from "./order-total";

export default async function OrderSummary() {
    const cart = await kv.get(`cart-${auth().userId}`);

    const {
        items,
        total
    } = cart as {
        items: {
            productId: number;
            quantity: number;
            name: string;
            image: string;
            price: number;
        }[], total: number
    };

    return (
        <>
            <h3
                className="text-foreground/90 scroll-m-20 text-2xl font-semibold tracking-tight mb-6"
            >
                Order Summary
            </h3>
            <div
                className="flex flex-col justify-between"
            >
                <div
                    className="flex flex-col gap-3"
                >
                    {
                        items.map(
                            ({ image, productId, name, quantity, price }) => (
                                <div
                                    className="rounded border border-foreground/10 h-[100px] overflow-hidden"
                                >
                                    <div
                                        className="flex h-full"
                                    >
                                        <div
                                            className="relative h-full w-20 mr-3"
                                        >
                                            <Image
                                                src={image}
                                                fill
                                                style={{
                                                    objectFit: 'cover'
                                                }}
                                                alt="cart item image"
                                            />
                                        </div>
                                        <div
                                            className="pt-2 flex-grow pr-2"
                                        >
                                            <div
                                                className="flex justify-between items-center"
                                            >
                                                <Link
                                                    href={`/product/${productId}`}
                                                >
                                                    <Button
                                                        variant="link"
                                                        className="p-0 h-auto text-foreground/90"
                                                    >
                                                        {name}
                                                        <ExternalLink
                                                            size={12}
                                                            className="inline-block ml-1"
                                                        />
                                                    </Button>
                                                </Link>
                                            </div>
                                            <div
                                                className="flex items-center gap-2"
                                            >
                                                <div
                                                    className="rounded border p-1 w-8 text-center text-sm text-foreground/90"
                                                >
                                                    {quantity}
                                                </div>
                                                <X
                                                    className="text-foreground/90"
                                                    size={12}
                                                />
                                                <div
                                                    className="text-sm text-foreground/90"
                                                >
                                                    {`${new Intl.NumberFormat('en-US').format(price)}$`}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        )
                    }
                </div>
                <OrderTotal total={total} />
            </div>
        </>
    );
}