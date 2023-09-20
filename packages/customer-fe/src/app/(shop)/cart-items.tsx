'use client';
import { api } from "~/utils/api";
import CartItem from "./cart-item";
import { atom, useAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import { CreditCard, Loader2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useRouter } from "next/navigation";
import { debounce } from "~/utils/debounce";

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
    const [isLoading, setIsLoading] = useState(false);
    const { data: { items, total }, refetch, isFetching } = api.cart.getCart.useQuery(undefined, {
        initialData: {
            items: initialItems,
            total: initialTotal
        },
        enabled: false
    })
    const {
        mutate: removeItems,
        isLoading: isRemoving
    } = api.cart.removeItems.useMutation({
        onSuccess() {
            refetch();
        }
    })
    const {
        refetch: checkMissingItems
    } = api.cart.getMissingItems.useQuery(
        undefined,
        {
            enabled: false,
            onSuccess(data) {
                const {
                    missingItems
                } = data;

                if (!missingItems.length) {
                    return null
                }

                removeItems({
                    productIds: missingItems
                })
            },
        }
    )
    const [, setRefetch] = useAtom(refetchCartAtom);
    const router = useRouter();

    const checkItemAvailability = async () => {
        if (!items.length) {
            return;
        }

        await checkMissingItems()
    }

    useEffect(() => {
        setRefetch({
            refetch
        });
        checkItemAvailability()
            .then(
                () => {
                    refetch()
                }
            );

        router.prefetch('/checkout');
    }, [])

    useEffect(
        () => {
            if (isRemoving) {
                setIsLoading(true)

                return;
            }

            setIsLoading(false)
        },
        [isRemoving]
    )

    const loaderTimeout = useRef<NodeJS.Timeout>()

    useEffect(
        () => {
            if (isFetching) {
                loaderTimeout.current = setTimeout(
                    () => {
                        setIsLoading(true)
                    },
                    300
                )

                return;
            }

            if (!isFetching && loaderTimeout.current) {
                clearTimeout(loaderTimeout.current)
                setIsLoading(false)
            }
        },
        [isFetching]
    )

    return (
        <>
            <div
                className="flex flex-col gap-2 relative"
            >
                {
                    isLoading && (
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
                        ${new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(total / 100)}
                    </div>
                </div>
                <div
                    className="flex-grow"
                >
                    <Button
                        className="w-full"
                        disabled={isFetching || isRemoving || !items.length}
                        onClick={() => {
                            router.push('/checkout');
                        }}
                        test-id="checkout-button"
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