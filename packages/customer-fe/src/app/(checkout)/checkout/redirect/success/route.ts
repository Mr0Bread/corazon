import Stripe from "stripe";
import { env } from "~/env.mjs";
import { redirect } from 'next/navigation';

export const GET = async (req: Request) => {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
        return redirect('/');
    }

    const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
        apiVersion: '2022-11-15',
    });

    const session = await stripe.checkout.sessions.retrieve(sessionId);
}