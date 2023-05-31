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
                    className="text-foreground/80"
                >
                    <ShoppingBag
                        size={24}
                    />
                </Button>
            </SheetTrigger>
            <SheetContent
                className="pt-10"
            >
                <Suspense fallback={<div>Loading...</div>}>
                    <Cart />
                </Suspense>
            </SheetContent>
        </Sheet>
    );
}