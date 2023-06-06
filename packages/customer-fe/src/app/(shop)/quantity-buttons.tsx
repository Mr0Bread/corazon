'use client'

import { useState, useEffect, useCallback } from "react"
import { api } from "~/utils/api"
import { Button } from "~/components/ui/button"
import { Loader2 } from "lucide-react"
import { useAtomValue } from "jotai"
import { refetchCartAtom } from "./cart-items"
import { Plus, Minus } from "lucide-react"
import { Input } from "~/components/ui/input"

function debounce(callback, delay = 500) {
    var time;

    return (...args) => {
        clearTimeout(time);
        time = setTimeout(() => {
            callback(...args);
        }, delay);
    };
}

export default function QuantityButtons({
    productId,
    quantity,
    price
}: {
    productId: number,
    quantity: number,
    price: number
}) {
    const [quantityState, setQuantityState] = useState(String(quantity))
    const { refetch: refetchCart } = useAtomValue(refetchCartAtom)
    const {
        mutate: increaseQuantity,
        isLoading: isIncreasing
    } = api.cart.addToCart.useMutation({
        onSuccess: () => {
            refetchCart()
        }
    })
    const {
        mutate: decreaseQuantity,
        isLoading: isDecreasing
    } = api.cart.decreaseQuantity.useMutation({
        onSuccess: () => {
            refetchCart()
        }
    })
    const {
        mutate: setQuantity,
        isLoading: isSettingQuantity
    } = api.cart.setQuantity.useMutation({
        onSuccess: () => {
            refetchCart()
        }
    })

    const isLoading = isIncreasing || isDecreasing || isSettingQuantity

    useEffect(() => {
        setQuantityState(quantity)
    }, [quantity])

    const debouncedSetQuantity = debounce(
        (newQuantityNumber) => setQuantity({
            productId,
            quantity: newQuantityNumber
        })
    )
    const onInputChange = useCallback(
        (e) => {
            const newQuantity = e.target.value

            if (newQuantity === '') {
                setQuantityState('')
                return
            }

            const newQuantityNumber = Number(newQuantity)

            if (isNaN(newQuantityNumber)) {
                return
            }

            setQuantityState(newQuantity)
            debouncedSetQuantity(newQuantityNumber)
        },
        [productId]
    )

    return (
        <div
            className="relative flex justify-between gap-2 items-center mt-2"
        >
            {
                isLoading && (
                    <div
                        className="w-full h-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center bg-slate-900 bg-opacity-30"
                    >
                        <Loader2
                            size={24}
                            className="animate-spin text-foreground/90"
                        />
                    </div>
                )
            }
            <div
                className="flex justify-start gap-2 items-center"
            >
                <Button
                    className="p-0 h-auto"
                    variant="outline"
                    onClick={() => decreaseQuantity({ productId })}
                >
                    <Minus
                        size={20}
                    />
                </Button>
                <Input
                    type="number"
                    min={1}
                    step={1}
                    value={quantityState}
                    className="w-8 px-1 text-center"
                    onChange={onInputChange}
                />
                <Button
                    className="p-0 h-auto"
                    variant="outline"
                    onClick={() => increaseQuantity({ productId, quantity: 1 })}
                >
                    <Plus
                        size={20}
                    />
                </Button>
            </div>
            <div
                className="text-orange-300"
            >
                ${(new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format((price * quantity) / 100))}
            </div>
        </div>
    );
}