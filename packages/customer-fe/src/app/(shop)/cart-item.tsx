import { X, ExternalLink } from "lucide-react";
import Image from "next/image";
import DeleteCartItemButton from "./detele-cart-item-button";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import QuantityButtons from "./quantity-buttons";

export default function CartItem({
    name,
    image,
    quantity,
    price,
    productId
}: {
    productId: number,
    quantity: number,
    price: number,
    name: string,
    image: string
}) {
    return (
        <div
            className="rounded border border-foreground/10 h-[110px] overflow-hidden"
        >
            <div
                className="flex h-full"
            >
                <div
                    className="relative h-full w-20 mr-3"
                >
                    <Image
                        src={image}
                        fill
                        style={{
                            objectFit: 'cover'
                        }}
                        alt="cart item image"
                    />
                </div>
                <div
                    className="pt-2 flex-grow pr-2"
                >
                    <div
                        className="flex justify-between items-center"
                    >
                        <Link
                            href={`/product/${name.replace(/\s/g, '-').toLowerCase()}-${productId}`}
                        >
                            <Button
                                variant="link"
                                className="p-0 h-auto"
                            >
                                {name}
                                <ExternalLink
                                    size={12}
                                    className="inline-block ml-1"
                                />
                            </Button>
                        </Link>
                        <DeleteCartItemButton
                            productId={productId}
                        />
                    </div>
                    <QuantityButtons
                        price={price}
                        quantity={quantity}
                        productId={productId}
                    />
                </div>
            </div>
        </div>
    );
}