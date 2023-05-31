'use client';

import { useCallback } from "react";
import { Button } from "~/components/ui/button";
import { PlusCircle, Loader2 } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { useToast } from "~/components/ui/use-toast";
import { api } from "~/utils/api";
import { trpc } from "~/utils/trpc";

export default function QuickAddButton({
    productId
}: {
    productId: number
}) {
    const { isSignedIn } = useUser();
    const { toast } = useToast();
    const utils = trpc.useContext();
    const {
        mutate,
        isLoading
    } = api.cart.addToCart.useMutation({
        onSuccess: async () => {
            await utils.cart.getCart.invalidate();
            utils.cart.getCart.refetch();
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
    }, []);

    return (
        <Button
            onClick={onClick}
            variant="secondary"
            className="mt-4 text-foreground/70"
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