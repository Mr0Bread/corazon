'use client'

import { Button } from "~/components/ui/button"
import { Heart, HeartOff, Loader2 } from "lucide-react"
import { api } from "~/utils/api"
import { useState } from "react"

export default function WishProductButton({
    productId,
    isWished: initialIsWished
}: {
    productId: number,
    isWished: boolean
}) {
    const [isWished, setIsWished] = useState(initialIsWished)
    const {
        mutate: wishProduct,
        isLoading: isWishing
    } = api.wishlist.wishlistProduct.useMutation({
        onSuccess: () => {
            setIsWished(true)
        }
    })
    const {
        mutate: unwishProduct,
        isLoading: isUnwishing
    } = api.wishlist.unwishlistProduct.useMutation({
        onSuccess: () => {
            setIsWished(false)
        }
    })

    return (
        <Button
            variant="secondary"
            onClick={
                () => {
                    if (isWished) {
                        unwishProduct({ productId })
                    } else {
                        wishProduct({ productId })
                    }
                }
            }
        >
            {
                (isWishing || isUnwishing)
                    ? (
                        <Loader2
                            className="animate-spin"
                            size={24}
                        />
                    )
                    : (
                        isWished
                            ? (
                                <HeartOff
                                    size={24}
                                />
                            )
                            : (
                                <Heart
                                    size={24}
                                />
                            )
                    )
            }
        </Button>
    );
}