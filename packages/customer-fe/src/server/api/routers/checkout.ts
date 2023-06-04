import { z } from "zod";
import {
    createTRPCRouter,
    publicProcedure
} from "~/server/api/trpc";
import Stripe from "stripe";
import { env } from "~/env.mjs";
import { currentUser } from "@clerk/nextjs";
import { kv } from "@vercel/kv";
import { db } from "@corazon/sale-fe/src/server/db";
import {
    configs as configsTable,
    parcelLocations as parcelLocationsTable,
    orderItems as orderItemsTable,
    orders as ordersTable,
    orderAddresses as orderAddressesTable
} from "@corazon/sale-fe/src/server/schema";
import { like, eq, and, inArray, sql, desc } from "drizzle-orm";

export const checkoutRouter = createTRPCRouter({
    getParcelLocations: publicProcedure
        .input(
            z.object({
                country: z.string(),
            })
        )
        .output(
            z.object({
                parcelLocations: z.array(
                    z.object({
                        id: z.number(),
                        name: z.string(),
                        address: z.string(),
                        city: z.string(),
                        postcode: z.string(),
                    })
                ),
            })
        )
        .query(
            async ({ input: { country } }) => {
                const parcelLocations = await db
                    .select()
                    .from(parcelLocationsTable)
                    .where(
                        eq(parcelLocationsTable.country, country)
                    );

                return {
                    parcelLocations
                }
            }
        ),
    getShippingMethods: publicProcedure
        .input(
            z.object({
                country: z.string(),
            })
        )
        .output(
            z.object({
                shippingMethods: z.array(
                    z.object({
                        name: z.string(),
                        price: z.number(),
                        code: z.string(),
                        estimatedShippingTime: z.string(),
                    })
                ),
            })
        )
        .mutation(
            async ({ input: { country } }) => {
                const enabledShippingMethods = await db
                    .select()
                    .from(configsTable)
                    .where(
                        and(
                            like(configsTable.key, 'carriers/%/active'),
                            eq(configsTable.value, '1')
                        )
                    );

                if (!enabledShippingMethods.length) {
                    throw new Error('No enabled shipping methods');
                }

                const enabledShippingMethodsCodes = enabledShippingMethods.map(({ key }) => key.split('/')[1]) as string[];

                const shippingMethodsConfigs = await db
                    .select({
                        value: configsTable.value,
                        key: configsTable.key
                    })
                    .from(configsTable)
                    .where(
                        inArray(
                            configsTable.key,
                            enabledShippingMethodsCodes.map((code) => `carriers/${code}/configuration`)
                        )
                    )

                const shippingConfigsForCountry = shippingMethodsConfigs
                    .filter(Boolean)
                    .map(
                        ({ value, key }) => {
                            const config = JSON.parse(value as string);
                            config.code = key.split('/')[1];

                            return config;
                        }
                    )
                    .filter(
                        ({ countries }) => countries.includes(country)
                    ) as { price: number, title: string, countries: string[], code: string }[]

                return {
                    shippingMethods: shippingConfigsForCountry.map(
                        ({ price, title, code }) => ({
                            name: title,
                            price,
                            code,
                            estimatedShippingTime: '1-2 days'
                        })
                    )
                }
            }
        ),
    proceedToPayment: publicProcedure
        .output(z.object({
            redirectUrl: z.string()
        }))
        .input(z.object({
            shipmentPrice: z.number(),
            shippingMethod: z.string(),
            shippingAddress: z.object({
                firstName: z.string(),
                lastName: z.string(),
                address: z.string(),
                city: z.string(),
                postcode: z.string(),
                country: z.string(),
                phoneNumber: z.string(),
            })
        }))
        .mutation(
            async ({ input: { shippingAddress, shippingMethod, shipmentPrice } }) => {
                const stripe = new Stripe(
                    env.STRIPE_SECRET_KEY,
                    {
                        apiVersion: '2022-11-15'
                    }
                );

                const user = await currentUser();

                if (!user) throw new Error('No user');

                const { id: userId, emailAddresses } = user;

                const cart = await kv.get(`cart-${userId}`);

                const { items, total } = cart as { items: { name: string, quantity: number, price: number, productId: number }[], total: number };
                const url = process.env.NEXT_PUBLIC_VERCEL_URL || 'http://localhost:3100';
                const lineItems: { price: string, quantity: number }[] = [];

                const lineItemPromises = items.map(
                    ({ name, price: unit_amount, quantity }) => {
                        const fn = async () => {
                            console.log('creating price for product');
                            
                            const { id: productId } = await stripe.products.create({
                                name
                            });
    
                            const { id: priceId } = await stripe.prices.create({
                                product: productId,
                                unit_amount: unit_amount,
                                currency: 'usd',
                            });
    
                            lineItems.push({
                                price: priceId,
                                quantity: quantity,
                            });
                        }

                        return fn();
                    }
                );

                lineItemPromises
                    .push(
                        (async () => {
                            // create price for shipment
                            const { id: productId } = await stripe.products.create({
                                name: 'Shipment'
                            });
    
                            const { id: shipmentPriceId } = await stripe.prices.create({
                                product: productId,
                                unit_amount: 1 * shipmentPrice,
                                currency: 'usd',
                            });
    
                            lineItems.push({
                                price: shipmentPriceId,
                                quantity: 1,
                            });
                        })()
                    )

                await Promise.all(lineItemPromises)

                const newOrderId = await db.transaction(
                    async (trx) => {
                        await trx
                            .insert(ordersTable)
                            .values({
                                userId,
                                status: 'pending',
                                productsAmount: total,
                                shippingPrice: shipmentPrice,
                                shippingMethod: shippingMethod
                            })

                        await trx.execute(
                            sql`SET @order_id = LAST_INSERT_ID();`
                        );

                        await trx
                            .insert(orderItemsTable)
                            .values(
                                items.map(
                                    ({ productId, quantity, price }) => ({
                                        orderId: sql`@order_id`,
                                        productId,
                                        quantity,
                                        unitPrice: price,
                                    })
                                )
                            )

                        await trx
                            .insert(orderAddressesTable)
                            .values({
                                orderId: sql`@order_id`,
                                country: shippingAddress.country,
                                city: shippingAddress.city,
                                address: shippingAddress.address,
                                postcode: shippingAddress.postcode,
                                phone: shippingAddress.phoneNumber
                            })

                        const [lastOrder] = await trx
                            .select({
                                id: ordersTable.id
                            })
                            .from(ordersTable)
                            .where(
                                eq(ordersTable.userId, userId)
                            )
                            .orderBy(
                                desc(ordersTable.createdAt)
                            )
                            .limit(1)

                        const { id } = lastOrder as { id: number };

                        return id;
                    }
                )

                const session = await stripe.checkout.sessions.create({
                    mode: 'payment',
                    line_items: lineItems,
                    success_url: `${url}/checkout/redirect/success?session_id={CHECKOUT_SESSION_ID}`,
                    cancel_url: `${url}/checkout/redirect/cancel?session_id={CHECKOUT_SESSION_ID}`,
                    customer_email: emailAddresses?.[0]?.emailAddress,
                    metadata: {
                        orderId: newOrderId
                    }
                });

                if (!session.url) throw new Error('No session url');

                return {
                    redirectUrl: session.url
                };
            }
        )
})