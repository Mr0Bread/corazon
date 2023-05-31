'use client';
import { api } from "~/utils/api";
import CartItem from "./cart-item";
import { atom, useAtom } from "jotai";
import { useEffect } from "react";
import { CreditCard, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";

export const refetchCartAtom = atom<{ refetch: Function }>({
    refetch: () => null
});

export default function CartItems({
    items: initialItems,
    total: initialTotal
}: {
    items: {
        productId: number,
        quantity: number,
        price: number,
        name: string,
        image: string
    }[],
    total: number
}) {
    const { data: { items, total }, refetch, isFetching } = api.cart.getCart.useQuery(undefined, {
        initialData: {
            items: initialItems,
            total: initialTotal
        },
        enabled: false
    })
    const [, setRefetch] = useAtom(refetchCartAtom);

    useEffect(() => {
        setRefetch({
            refetch
        });
    }, [])

    return (
        <>
            <div
                className="flex flex-col gap-2 relative"
            >
                {
                    isFetching && (
                        <div
                            className="absolute inset-0 flex justify-center items-center bg-background/50"
                        >
                            <Loader2
                                size={32}
                                className="animate-spin"
                            />
                        </div>
                    )
                }
                {
                    items.map((item: any) => {
                        return (
                            <CartItem
                                key={item.productId}
                                {...item}
                            />
                        );
                    }
                    )
                }
            </div>
            <div
                className="absolute bottom-0 w-full flex flex-col gap-4"
            >
                <div
                    className="flex justify-between text-lg"
                >
                    <div>
                        Total:
                    </div>
                    <div
                        className="font-bold"
                    >
                        ${new Intl.NumberFormat('en-US').format(total)}
                    </div>
                </div>
                <div
                    className="flex-grow"
                >
                    <Link
                        href="/checkout"
                    >
                        <Button
                            className="w-full"
                        >
                            <CreditCard
                                size={24}
                                className="mr-2"
                            />
                            Checkout
                        </Button>
                    </Link>
                </div>
            </div>
        </>
    );
}