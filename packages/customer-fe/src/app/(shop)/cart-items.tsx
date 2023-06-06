'use client';
import { api } from "~/utils/api";
import CartItem from "./cart-item";
import { atom, useAtom } from "jotai";
import { useEffect } from "react";
import { CreditCard, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { useRouter } from "next/navigation";

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
    const router = useRouter();

    useEffect(() => {
        setRefetch({
            refetch
        });

        router.prefetch('/checkout');
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
                        className="font-bold text-orange-400"
                    >
                        ${new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(total/100)}
                    </div>
                </div>
                <div
                    className="flex-grow"
                >
                    <Button
                        className="w-full"
                        disabled={isFetching || !items.length}
                        onClick={() => {
                            router.push('/checkout');
                        }}
                    >
                        <CreditCard
                            size={24}
                            className="mr-2"
                        />
                        Checkout
                    </Button>
                </div>
            </div>
        </>
    );
}