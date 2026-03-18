var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// index.ts
function getCorsHeaders(env) {
  return {
    "Access-Control-Allow-Origin": env.CLIENT_URL,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
}
__name(getCorsHeaders, "getCorsHeaders");
var index_default = {
  async fetch(request, env) {
    const corsHeaders = getCorsHeaders(env);
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }
    const url = new URL(request.url);
    if (url.pathname === "/create-checkout-session" && request.method === "POST") {
      return handleCheckout(request, env, corsHeaders);
    }
    if (url.pathname === "/webhook" && request.method === "POST") {
      return handleWebhook(request, env);
    }
    if (url.pathname === "/contact" && request.method === "POST") {
      return handleContact(request, env, corsHeaders);
    }
    return new Response("Not found", { status: 404, headers: corsHeaders });
  }
};
async function handleCheckout(request, env, corsHeaders) {
  try {
    const { items } = await request.json();
    if (!items || items.length === 0) {
      return new Response(
        JSON.stringify({ error: "Cart is empty" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    const line_items = items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          images: [item.image]
        },
        unit_amount: Math.round(item.price * 100)
      },
      quantity: item.quantity
    }));
    const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.STRIPE_SECRET_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: encodeStripeParams({
        "mode": "payment",
        "success_url": `${env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        "cancel_url": `${env.CLIENT_URL}/shop`,
        "shipping_address_collection[allowed_countries][0]": "US",
        "shipping_options[0][shipping_rate_data][type]": "fixed_amount",
        "shipping_options[0][shipping_rate_data][fixed_amount][amount]": "0",
        "shipping_options[0][shipping_rate_data][fixed_amount][currency]": "usd",
        "shipping_options[0][shipping_rate_data][display_name]": "Free shipping (orders $55+)",
        "shipping_options[0][shipping_rate_data][delivery_estimate][minimum][unit]": "business_day",
        "shipping_options[0][shipping_rate_data][delivery_estimate][minimum][value]": "5",
        "shipping_options[0][shipping_rate_data][delivery_estimate][maximum][unit]": "business_day",
        "shipping_options[0][shipping_rate_data][delivery_estimate][maximum][value]": "7",
        "shipping_options[1][shipping_rate_data][type]": "fixed_amount",
        "shipping_options[1][shipping_rate_data][fixed_amount][amount]": "795",
        "shipping_options[1][shipping_rate_data][fixed_amount][currency]": "usd",
        "shipping_options[1][shipping_rate_data][display_name]": "Standard shipping",
        "shipping_options[1][shipping_rate_data][delivery_estimate][minimum][unit]": "business_day",
        "shipping_options[1][shipping_rate_data][delivery_estimate][minimum][value]": "5",
        "shipping_options[1][shipping_rate_data][delivery_estimate][maximum][unit]": "business_day",
        "shipping_options[1][shipping_rate_data][delivery_estimate][maximum][value]": "7",
        ...flattenLineItems(line_items)
      })
    });
    const session = await response.json();
    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: session.error?.message || "Failed to create session" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    return new Response(
      JSON.stringify({ url: session.url }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch {
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
}
__name(handleCheckout, "handleCheckout");
async function handleContact(request, env, corsHeaders) {
  try {
    const { name, email, message } = await request.json();
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (env.RESEND_API_KEY) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env.RESEND_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from: "CORAM DEO SUPPLY <onboarding@resend.dev>",
          to: [env.NOTIFY_EMAIL],
          subject: `Contact Form: ${name}`,
          reply_to: email,
          html: `
            <div style="font-family: 'Archivo Narrow', Arial, sans-serif; max-width: 600px;">
              <h2 style="letter-spacing: 0.18em; text-transform: uppercase;">New Contact Message</h2>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Message:</strong></p>
              <p>${message.replace(/\n/g, "<br/>")}</p>
            </div>
          `
        })
      });
    }
    return new Response(
      JSON.stringify({ ok: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch {
    return new Response(
      JSON.stringify({ error: "Failed to send message" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
}
__name(handleContact, "handleContact");
async function handleWebhook(request, env) {
  try {
    const body = await request.text();
    const sig = request.headers.get("stripe-signature");
    if (!sig) {
      return new Response("Missing signature", { status: 400 });
    }
    const verified = await verifyStripeSignature(body, sig, env.STRIPE_WEBHOOK_SECRET);
    if (!verified) {
      return new Response("Invalid signature", { status: 400 });
    }
    const event = JSON.parse(body);
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const lineItemsRes = await fetch(
        `https://api.stripe.com/v1/checkout/sessions/${session.id}/line_items`,
        {
          headers: { "Authorization": `Bearer ${env.STRIPE_SECRET_KEY}` }
        }
      );
      const lineItemsData = await lineItemsRes.json();
      const shipping = session.shipping_details;
      const customerEmail = session.customer_details?.email || "N/A";
      const customerName = session.customer_details?.name || "N/A";
      const amountTotal = (session.amount_total / 100).toFixed(2);
      const itemsList = lineItemsData.data?.map((item) => `\u2022 ${item.description} x${item.quantity} \u2014 $${(item.amount_total / 100).toFixed(2)}`).join("\n") || "Could not fetch items";
      const shippingAddress = shipping?.address ? [
        shipping.name,
        shipping.address.line1,
        shipping.address.line2,
        `${shipping.address.city}, ${shipping.address.state} ${shipping.address.postal_code}`,
        shipping.address.country
      ].filter(Boolean).join("\n") : "No shipping address";
      const emailHtml = `
        <div style="font-family: 'Archivo Narrow', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="font-size: 24px; letter-spacing: 0.18em; text-transform: uppercase; border-bottom: 2px solid #1c1c1c; padding-bottom: 16px;">
            New Order \u2014 CORAM DEO SUPPLY
          </h1>

          <h2 style="font-size: 16px; letter-spacing: 0.18em; text-transform: uppercase; margin-top: 24px;">Customer</h2>
          <p><strong>${customerName}</strong><br/>${customerEmail}</p>

          <h2 style="font-size: 16px; letter-spacing: 0.18em; text-transform: uppercase; margin-top: 24px;">Shipping Address</h2>
          <p>${shippingAddress.replace(/\n/g, "<br/>")}</p>

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
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env.RESEND_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from: "CORAM DEO SUPPLY Orders <onboarding@resend.dev>",
          to: [env.NOTIFY_EMAIL],
          subject: `New Order: $${amountTotal} from ${customerName}`,
          html: emailHtml
        })
      });
    }
    return new Response("OK", { status: 200 });
  } catch {
    return new Response("Webhook error", { status: 500 });
  }
}
__name(handleWebhook, "handleWebhook");
async function verifyStripeSignature(payload, header, secret) {
  try {
    const parts = header.split(",").reduce((acc, part) => {
      const [key2, value] = part.split("=");
      acc[key2.trim()] = value;
      return acc;
    }, {});
    const timestamp = parts["t"];
    const signature = parts["v1"];
    if (!timestamp || !signature) return false;
    const now = Math.floor(Date.now() / 1e3);
    if (Math.abs(now - parseInt(timestamp)) > 300) return false;
    const signedPayload = `${timestamp}.${payload}`;
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(signedPayload));
    const expectedSig = Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join("");
    return expectedSig === signature;
  } catch {
    return false;
  }
}
__name(verifyStripeSignature, "verifyStripeSignature");
function flattenLineItems(lineItems) {
  const params = {};
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
__name(flattenLineItems, "flattenLineItems");
function encodeStripeParams(params) {
  return Object.entries(params).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join("&");
}
__name(encodeStripeParams, "encodeStripeParams");

// ../node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// ../node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-pKYIhI/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = index_default;

// ../node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-pKYIhI/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
