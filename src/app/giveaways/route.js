import crypto from "crypto";
import { NextResponse } from "next/server";

const SHOPIFY_SHARED_SECRET = process.env.SHOPIFY_API_SECRET; // Store this securely

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const shop = searchParams.get("shop");
  const timestamp = searchParams.get("timestamp");
  const signature = searchParams.get("signature");

  // 🔐 Step 1: Verify Shopify Request (HMAC Validation)
  const params = [...searchParams]
    .filter(([key]) => key !== "signature")
    .sort()
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  const expectedSignature = crypto
    .createHmac("sha256", SHOPIFY_SHARED_SECRET)
    .update(params)
    .digest("hex");

  if (expectedSignature !== signature) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 🏆 Step 2: Fetch giveaway details for the store (You can store this in a DB)
  const giveawayData = {
    title: "Mega Giveaway!",
    description: "Win exciting prizes for shopping with us!",
    endDate: "March 30, 2025",
  };

  // 🖼️ Step 3: Return an HTML page dynamically
  return new NextResponse(
    `
      <html>
        <head><title>${giveawayData.title}</title></head>
        <body style="font-family: Arial, sans-serif; text-align: center;">
          <h1>${giveawayData.title}</h1>
          <p>${giveawayData.description}</p>
          <p><strong>Ends on:</strong> ${giveawayData.endDate}</p>
        </body>
      </html>
    `,
    {
      headers: { "Content-Type": "text/html" },
    }
  );
}
