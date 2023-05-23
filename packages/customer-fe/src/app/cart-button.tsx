import { ShoppingBag } from 'lucide-react'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from '~/components/ui/button';

export default function CartButton() {
    return (
        <Sheet>
            <SheetTrigger>
                <Button
                    variant="outline"
                    className="text-foreground/80"
                >
                    <ShoppingBag
                        size={24}
                    />
                </Button>
            </SheetTrigger>
            <SheetContent>
                Cart
            </SheetContent>
        </Sheet>
    );
}