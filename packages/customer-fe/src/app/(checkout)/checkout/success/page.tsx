import { Button } from "~/components/ui/button";
import { ArrowLeftCircle } from "lucide-react";
import Link from "next/link";

export default async function Page() {
    return (
        <div
            className="w-full flex flex-col items-center justify-center min-h-screen"
        >
            <div
                className="text-foreground/90 scroll-m-20 pb-2 text-5xl font-semibold tracking-tight transition-colors first:mt-0"
            >
                Success
            </div>
            <h2
                className="text-foreground/90 scroll-m-20 pb-2 text-5xl font-semibold tracking-tight transition-colors first:mt-0"
            >
                Your order has been placed
            </h2>
            <div
                className="grid grid-cols-2 gap-4 mt-6"
            >
                <Link
                    href="/"
                >
                    <Button
                        variant="secondary"
                        className="w-full"
                    >
                        <ArrowLeftCircle
                            size={24}
                            className="mr-2"
                        />
                        Back to Shop
                    </Button>
                </Link>
                <Link
                    href="/my-account/orders"
                >
                    <Button
                        className="w-full"
                    >
                        View Order
                    </Button>
                </Link>
            </div>
        </div>
    );
}