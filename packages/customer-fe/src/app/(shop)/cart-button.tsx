import { ShoppingBag } from 'lucide-react'
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from '~/components/ui/button';
import Cart from './cart';
import { Suspense } from 'react';

export default function CartButton() {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    variant="outline"
                    className="text-foreground/80 bg-background"
                    test-id="cart-button"
                >
                    <ShoppingBag
                        size={24}
                    />
                </Button>
            </SheetTrigger>
            <SheetContent
                className="pt-10 w-full md:w-1/2 lg:w-1/3"
                closeProps={{
                    "test-id": 'cart-close-button'
                }}
            >
                <Suspense fallback={<div>Loading...</div>}>
                    <Cart />
                </Suspense>
            </SheetContent>
        </Sheet>
    );
}