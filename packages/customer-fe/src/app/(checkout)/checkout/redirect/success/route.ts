import Stripe from "stripe";
import { env } from "~/env.mjs";
import { redirect } from 'next/navigation';
import { db } from "@corazon/sale-fe/src/server/db";
import { orders as ordersTable } from "@corazon/sale-fe/src/server/schema";
import { eq } from "drizzle-orm";

export const GET = async (req: Request) => {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
        return redirect('/');
    }

    const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
        apiVersion: '2022-11-15',
    });

    const {
        metadata
    } = await stripe.checkout.sessions.retrieve(sessionId);

    if (!metadata) {
        console.log('No metadata found for session', sessionId);

        return redirect('/');
    }

    const { orderId } = metadata;

    if (!orderId) {
        console.log('No orderId found in metadata for session', sessionId);

        return redirect('/');
    }

    await db
        .update(ordersTable)
        .set({
            status: 'paid'
        })
        .where(
            eq(ordersTable.id, Number(orderId))
        )

    return redirect(`/checkout/success`);
}