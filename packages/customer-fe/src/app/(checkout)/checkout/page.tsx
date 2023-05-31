import CheckoutForm from "./checkout-form";
import OrderSummary from "./order-summary";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { ArrowLeftCircle } from "lucide-react";
import { db } from "@corazon/sale-fe/src/server/db";
import { configs as configsTable, countries as countriesTable } from "@corazon/sale-fe/src/server/schema";
import { eq, inArray } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function Page() {
    const allowedCountries = await db
        .select()
        .from(configsTable)
        .where(
            eq(configsTable.key, "checkout/general/allowed_countries")
        )

    if (!allowedCountries || !allowedCountries[0]) {
        console.log("No config for allowed countries found");
        
        return redirect("/cart");
    }

    const { value } = allowedCountries[0];

    if (!value) {
        console.log("Config for countries is empty");

        return redirect("/cart");
    }

    const allowedCountriesList = value.split(",");

    const countries = await db
        .select({
            name: countriesTable.name,
            code: countriesTable.code
        })
        .from(countriesTable)
        .where(
            inArray(countriesTable.code, allowedCountriesList)
        )

    return (
        <div
            className="max-w-7xl w-full px-10 flex min-h-screen flex-col justify-start pt-10 pb-8"
        >
            <div
                className="flex justify-center"
            >
                <div
                    className="max-w-5xl flex-grow"
                >
                    <Link
                        href="/products/all"
                    >
                        <Button
                            variant="link"
                            className="px-0 mb-4"
                        >
                            <ArrowLeftCircle
                                size={24}
                                className="mr-2"
                            />
                            Back to Shop
                        </Button>
                    </Link>
                    <h2
                        className="text-foreground/90 first-letter:scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0 mb-8 max-w-5xl flex-grow"
                    >
                        Checkout
                    </h2>
                </div>
            </div>
            <div
                className="flex justify-center w-full"
            >
                <div
                    className="grid grid-cols-[3fr_2fr] gap-6 max-w-5xl flex-grow"
                >
                    <div>
                        <CheckoutForm
                            countries={countries}
                        />
                    </div>
                    <div
                        className="relative"
                    >
                        <OrderSummary />
                    </div>
                </div>
            </div>
        </div>
    );
}