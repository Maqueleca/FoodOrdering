import Stripe from 'https://esm.sh/stripe@12.4.0';

export default async function handler(req: any, res: any) {
  const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
    apiVersion: '2022-11-15',
  });

  const { amount } = await req.json();

  if (!amount) {
    return res.json({ error: 'Amount is required' });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
    });

    return res.json({
      paymentIntent: paymentIntent.client_secret,
      publishableKey: Deno.env.get('STRIPE_PUBLISHABLE_KEY'),
    });
  } catch (error) {
    console.error(error);
    return res.json({ error: error.message });
  }
}
