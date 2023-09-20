import { db } from "@corazon/sale-fe/src/server/db";
import { products as productsTable } from "@corazon/sale-fe/src/server/schema";
import { eq } from "drizzle-orm";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '~/components/ui/card';
import Image from "next/image";
import QuickAddButton from "../../products/[...slug]/quick-add-button";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

export default async function ProductCard({
    id
}: {
    id: number
}) {
    const products = await db
        .select()
        .from(productsTable)
        .where(
            eq(
                productsTable.id,
                id
            )
        );

    if (!products || !products.length || !products[0]) {
        return (
            <div>
                {`Product: ${id} not found`}
            </div>
        );
    }

    const product = products[0];

    const images = JSON.parse(product.images as string) as { images: string[] };

    return (
        <Card
            className="flex flex-col h-[400px]"
        >
            <CardHeader
                className="px-2"
            >
                <CardTitle>
                    <Link
                        href={`/product/${product.name.replace(/\s/g, '-').toLowerCase()}-${product.id}`}
                    >
                        <span
                            className="hover:underline"
                        >
                            {product.name}
                            <ExternalLink
                                className="inline-block ml-1"
                                size={16}
                            />
                        </span>
                    </Link>
                </CardTitle>
            </CardHeader>
            <CardContent
                className="px-0 flex-grow relative h-36 mb-4"
            >
                {
                    images && images.images && Boolean(images.images.length) && (
                        <Image
                            src={images.images[0] as string}
                            fill
                            alt="Product image"
                            style={{
                                objectFit: 'cover'
                            }}
                            priority
                        />
                    )
                }
            </CardContent>
            <CardFooter
                className="px-2 flex flex-col items-start pb-2"
            >
                <div>
                    {`${new Intl.NumberFormat('en-US').format(product.finalPrice / 100)}$`}
                </div>
                <CardDescription>
                    {product.description}
                </CardDescription>
                <div
                    className="mt-4"
                >
                    <QuickAddButton
                        productId={product.id}
                    />
                </div>
            </CardFooter>
        </Card>
    );
}