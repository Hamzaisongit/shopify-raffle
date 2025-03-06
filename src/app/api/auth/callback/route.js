import { supabase } from "@/lib/supabase";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const shop = searchParams.get("shop");
    const code = searchParams.get("code");

    if (!shop || !code) {
        return new Response("Missing shop or code parameter", { status: 400 });
    }

    // Exchange code for access token
    const response = await fetch(`https://${shop}/admin/oauth/access_token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            client_id: process.env.SHOPIFY_API_KEY,
            client_secret: process.env.SHOPIFY_API_SECRET,
            code
        })
    });

    const data = await response.json();
    if (!data.access_token) {
        return new Response("Failed to fetch access token", { status: 500 });
    }

    const shopMetaDataResponse = await fetch(`https://${shop}/admin/api/2023-10/shop.json`,{
        method: 'GET',
        headers: {
            "X-Shopify-Access-Token": data.access_token,
            "Content-Type": "application/json"
        }
    })

const shopMetaData = await shopMetaDataResponse.json()


    // Store the access token in Supabase (upsert = insert or update)
    const { error } = await supabase.from("store").insert({
        email: shopMetaData.shop.email,
        store_domain: shop,
        access_token: data.access_token
    });

    if (error) {
        console.log(error)
        return new Response(`Error saving to Supabase: ${error}`, { status: 500 });
    }

    // Redirect to admin page with store context
    return Response.redirect(`https://${process.env.MY_DOMAIN}/signup?shop=${shop}`);
}
