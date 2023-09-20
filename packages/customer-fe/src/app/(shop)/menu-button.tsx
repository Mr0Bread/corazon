'use client';

import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from '~/components/ui/button';
import MenuContent from "./menu-content";
import { Suspense } from 'react';

export default function MenuButton() {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    variant="outline"
                    className="text-foreground/80 bg-background"
                >
                    Menu
                </Button>
            </SheetTrigger>
            <SheetContent
                className="pt-10 w-full md:w-1/2 lg:w-1/3"
                position="left"
            >
                <Suspense fallback={<div>Loading...</div>}>
                    <MenuContent />
                </Suspense>
            </SheetContent>
        </Sheet>
    );
}