'use client';

import { useCallback } from "react";
import { Button } from "~/components/ui/button";
import { PlusCircle, Loader2 } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { useToast } from "~/components/ui/use-toast";
import { api } from "~/utils/api";
import { useAtomValue } from "jotai";
import { refetchCartAtom } from "../../cart-items";

export default function QuickAddButton({
    productId
}: {
    productId: number
}) {
    const { refetch: refetchCart } = useAtomValue(refetchCartAtom);
    const { isSignedIn } = useUser();
    const { toast } = useToast();
    const {
        mutate,
        isLoading
    } = api.cart.addToCart.useMutation({
        onSuccess: async () => {
            refetchCart();

            toast({
                title: 'Product has been added to cart',
                className: 'text-foreground/90'
            });
        }
    });
    const onClick = useCallback(async () => {
        if (!isSignedIn) {
            toast({
                title: 'Please sign in to add to cart',
                className: 'text-foreground/90'
            });

            return;
        }

        mutate({
            productId,
            quantity: 1
        });
    }, [isSignedIn]);

    return (
        <Button
            onClick={onClick}
            variant="secondary"
            className="text-foreground/70 hover:text-foreground/90"
        >
            {
                isLoading ? (
                    <Loader2
                        size={24}
                        className="animate-spin mr-2"
                    />
                ) : (
                    <PlusCircle
                        size={24}
                        className="mr-2"
                    />
                )
            }
            Add to cart
        </Button>
    );
}