import { Delete } from "lucide-react"
import { Button } from "~/components/ui/button"
import { api } from "~/utils/api"
import { trpc } from "~/utils/trpc"
import { Loader2 } from "lucide-react"
import { useAtom } from "jotai"
import { refetchCartAtom } from "./cart-items"

export default function DeleteCartItemButton({
    productId
}: {
    productId: number
}) {
    const [{ refetch: refetchCart }] = useAtom(refetchCartAtom);
    const utils = trpc.useContext();
    const {
        mutate,
        isLoading
    } = api.cart.removeItem.useMutation({
        onSuccess: async () => {
            await utils.cart.getCart.invalidate();
            refetchCart();
        }
    });

    const onClick = () => {
        mutate({
            productId
        });
    };

    return (
        <Button
            variant="ghost"
            onClick={onClick}
            className="py-1 h-8"
        >
            {isLoading ? (
                <Loader2
                    size={22}
                    className="animate-spin"
                />
            ) : (
                <Delete
                    size={22}
                />
            )}
        </Button>
    )
}