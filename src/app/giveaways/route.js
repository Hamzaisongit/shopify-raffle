import crypto from "crypto";
import { NextResponse } from "next/server";

const SHOPIFY_API_SECRET = process.env.SHOPIFY_API_SECRET; // Replace with actual secret

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  // 🔹 Convert SearchParams to an Object
  const query = Object.fromEntries(searchParams.entries());

  console.log("\n🔹 Shopify Raw Query Object:", JSON.stringify(query, null, 2));
  console.log("\n🔹 Shopify Request Headers:", JSON.stringify(request.headers, null, 2));

  // 🔹 Shopify sends 'signature', remove it before hashing
  const queryWithoutSignature = { ...query };
  delete queryWithoutSignature.signature;

  // 🔹 Remove empty values (Shopify ignores them in India)
  const filteredQuery = Object.fromEntries(
    Object.entries(queryWithoutSignature).filter(([_, value]) => value !== "")
  );

  // 🔹 Shopify sorts parameters before hashing
  const sortedParams = Object.keys(filteredQuery).sort();

  // 🔹 Construct the exact query string Shopify expects (🔥 NO "&" between values!)
  const formattedParams = sortedParams
    .map(key => `${key}=${filteredQuery[key]}`)
    .join("");  // 🔥 Shopify does NOT use "&" separators for App Proxy

  console.log("\n🔹 Corrected Query String for HMAC:", formattedParams);

  // 🔹 Compute HMAC Signature
  const expectedSignature = crypto
    .createHmac("sha256", SHOPIFY_API_SECRET)
    .update(formattedParams, "utf8")
    .digest("hex");

  console.log("\n🔹 Computed Signature:", expectedSignature);
  console.log("🔹 Shopify Provided Signature:", query.signature);

  if (expectedSignature === query.signature) {
    return new NextResponse.redirect('/giveaways/r');
  } else {
    return new NextResponse("<h1>❌ SIGNATURE MISMATCH!</h1>", { status: 401 });
  }
}
