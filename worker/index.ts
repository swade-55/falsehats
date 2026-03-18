interface Env {
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
  RESEND_API_KEY: string;
  NOTIFY_EMAIL: string;
  CLIENT_URL: string;
}

interface CartItem {
  name: string;
  price: number;
  quantity: number;
  image: string;
}

function getCorsHeaders(env: Env) {
  return {
    'Access-Control-Allow-Origin': env.CLIENT_URL,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const corsHeaders = getCorsHeaders(env);

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);

    if (url.pathname === '/create-checkout-session' && request.method === 'POST') {
      return handleCheckout(request, env, corsHeaders);
    }

    if (url.pathname === '/webhook' && request.method === 'POST') {
      return handleWebhook(request, env);
    }

    if (url.pathname === '/contact' && request.method === 'POST') {
      return handleContact(request, env, corsHeaders);
    }

    return new Response('Not found', { status: 404, headers: corsHeaders });
  },
};

async function handleCheckout(request: Request, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
  try {
    const { items }: { items: CartItem[] } = await request.json();

    if (!items || items.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Cart is empty' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const line_items = items.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          images: [item.image],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: encodeStripeParams({
        'mode': 'payment',
        'success_url': `${env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        'cancel_url': `${env.CLIENT_URL}/shop`,
        'shipping_address_collection[allowed_countries][0]': 'US',
        'shipping_options[0][shipping_rate_data][type]': 'fixed_amount',
        'shipping_options[0][shipping_rate_data][fixed_amount][amount]': '0',
        'shipping_options[0][shipping_rate_data][fixed_amount][currency]': 'usd',
        'shipping_options[0][shipping_rate_data][display_name]': 'Free shipping (orders $55+)',
        'shipping_options[0][shipping_rate_data][delivery_estimate][minimum][unit]': 'business_day',
        'shipping_options[0][shipping_rate_data][delivery_estimate][minimum][value]': '5',
        'shipping_options[0][shipping_rate_data][delivery_estimate][maximum][unit]': 'business_day',
        'shipping_options[0][shipping_rate_data][delivery_estimate][maximum][value]': '7',
        'shipping_options[1][shipping_rate_data][type]': 'fixed_amount',
        'shipping_options[1][shipping_rate_data][fixed_amount][amount]': '795',
        'shipping_options[1][shipping_rate_data][fixed_amount][currency]': 'usd',
        'shipping_options[1][shipping_rate_data][display_name]': 'Standard shipping',
        'shipping_options[1][shipping_rate_data][delivery_estimate][minimum][unit]': 'business_day',
        'shipping_options[1][shipping_rate_data][delivery_estimate][minimum][value]': '5',
        'shipping_options[1][shipping_rate_data][delivery_estimate][maximum][unit]': 'business_day',
        'shipping_options[1][shipping_rate_data][delivery_estimate][maximum][value]': '7',
        ...flattenLineItems(line_items),
      }),
    });

    const session = await response.json();

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: session.error?.message || 'Failed to create session' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ url: session.url }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch {
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

async function handleContact(request: Request, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
  try {
    const { name, email, message }: { name: string; email: string; message: string } = await request.json();

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: 'All fields are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Send email via Resend
    if (env.RESEND_API_KEY) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'CORAM DEO SUPPLY <onboarding@resend.dev>',
          to: [env.NOTIFY_EMAIL],
          subject: `Contact Form: ${name}`,
          reply_to: email,
          html: `
            <div style="font-family: 'Archivo Narrow', Arial, sans-serif; max-width: 600px;">
              <h2 style="letter-spacing: 0.18em; text-transform: uppercase;">New Contact Message</h2>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Message:</strong></p>
              <p>${message.replace(/\n/g, '<br/>')}</p>
            </div>
          `,
        }),
      });
    }

    return new Response(
      JSON.stringify({ ok: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch {
    return new Response(
      JSON.stringify({ error: 'Failed to send message' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

async function handleWebhook(request: Request, env: Env): Promise<Response> {
  try {
    const body = await request.text();
    const sig = request.headers.get('stripe-signature');

    if (!sig) {
      return new Response('Missing signature', { status: 400 });
    }

    // Verify webhook signature
    const verified = await verifyStripeSignature(body, sig, env.STRIPE_WEBHOOK_SECRET);
    if (!verified) {
      return new Response('Invalid signature', { status: 400 });
    }

    const event = JSON.parse(body);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;

      // Fetch line items for this session
      const lineItemsRes = await fetch(
        `https://api.stripe.com/v1/checkout/sessions/${session.id}/line_items`,
        {
          headers: { 'Authorization': `Bearer ${env.STRIPE_SECRET_KEY}` },
        }
      );
      const lineItemsData = await lineItemsRes.json();

      const shipping = session.shipping_details;
      const customerEmail = session.customer_details?.email || 'N/A';
      const customerName = session.customer_details?.name || 'N/A';
      const amountTotal = (session.amount_total / 100).toFixed(2);

      const itemsList = lineItemsData.data
        ?.map((item: any) => `• ${item.description} x${item.quantity} — $${(item.amount_total / 100).toFixed(2)}`)
        .join('\n') || 'Could not fetch items';

      const shippingAddress = shipping?.address
        ? [
            shipping.name,
            shipping.address.line1,
            shipping.address.line2,
            `${shipping.address.city}, ${shipping.address.state} ${shipping.address.postal_code}`,
            shipping.address.country,
          ].filter(Boolean).join('\n')
        : 'No shipping address';

      const emailHtml = `
        <div style="font-family: 'Archivo Narrow', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="font-size: 24px; letter-spacing: 0.18em; text-transform: uppercase; border-bottom: 2px solid #1c1c1c; padding-bottom: 16px;">
            New Order — CORAM DEO SUPPLY
          </h1>

          <h2 style="font-size: 16px; letter-spacing: 0.18em; text-transform: uppercase; margin-top: 24px;">Customer</h2>
          <p><strong>${customerName}</strong><br/>${customerEmail}</p>

          <h2 style="font-size: 16px; letter-spacing: 0.18em; text-transform: uppercase; margin-top: 24px;">Shipping Address</h2>
          <p>${shippingAddress.replace(/\n/g, '<br/>')}</p>

          <h2 style="font-size: 16px; letter-spacing: 0.18em; text-transform: uppercase; margin-top: 24px;">Items</h2>
          <pre style="font-family: monospace; background: #f5f5f5; padding: 16px;">${itemsList}</pre>

          <h2 style="font-size: 16px; letter-spacing: 0.18em; text-transform: uppercase; margin-top: 24px;">Total</h2>
          <p style="font-size: 24px; font-weight: bold;">$${amountTotal}</p>

          <hr style="margin-top: 32px; border: none; border-top: 1px solid #ddd;" />
          <p style="font-size: 12px; color: #999;">
            Payment ID: ${session.payment_intent}<br/>
            Session ID: ${session.id}
          </p>
        </div>
      `;

      // Send email via Resend
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'CORAM DEO SUPPLY Orders <onboarding@resend.dev>',
          to: [env.NOTIFY_EMAIL],
          subject: `New Order: $${amountTotal} from ${customerName}`,
          html: emailHtml,
        }),
      });
    }

    return new Response('OK', { status: 200 });
  } catch {
    return new Response('Webhook error', { status: 500 });
  }
}

// Verify Stripe webhook signature using Web Crypto API
async function verifyStripeSignature(
  payload: string,
  header: string,
  secret: string
): Promise<boolean> {
  try {
    const parts = header.split(',').reduce((acc: Record<string, string>, part) => {
      const [key, value] = part.split('=');
      acc[key.trim()] = value;
      return acc;
    }, {});

    const timestamp = parts['t'];
    const signature = parts['v1'];

    if (!timestamp || !signature) return false;

    // Check timestamp is within 5 minutes
    const now = Math.floor(Date.now() / 1000);
    if (Math.abs(now - parseInt(timestamp)) > 300) return false;

    const signedPayload = `${timestamp}.${payload}`;
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(signedPayload));
    const expectedSig = Array.from(new Uint8Array(sig))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    return expectedSig === signature;
  } catch {
    return false;
  }
}

function flattenLineItems(lineItems: any[]): Record<string, string> {
  const params: Record<string, string> = {};
  lineItems.forEach((item, i) => {
    params[`line_items[${i}][price_data][currency]`] = item.price_data.currency;
    params[`line_items[${i}][price_data][product_data][name]`] = item.price_data.product_data.name;
    if (item.price_data.product_data.images?.[0]) {
      params[`line_items[${i}][price_data][product_data][images][0]`] = item.price_data.product_data.images[0];
    }
    params[`line_items[${i}][price_data][unit_amount]`] = String(item.price_data.unit_amount);
    params[`line_items[${i}][quantity]`] = String(item.quantity);
  });
  return params;
}

function encodeStripeParams(params: Record<string, string>): string {
  return Object.entries(params)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
}
