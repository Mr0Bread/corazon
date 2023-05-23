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

    await new Promise(resolve => setTimeout(resolve, 1000));

    return (
        <Card
            className="flex flex-col h-[400px]"
        >
            <CardHeader
                className="px-3"
            >
                <CardTitle>
                    {product.name}
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
                className="px-3 flex flex-col items-start"
            >
                <div>
                    {`${product.price}$`}
                </div>
                <CardDescription>
                    {product.description}
                </CardDescription>
            </CardFooter>
        </Card>
    );
}