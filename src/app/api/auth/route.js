export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const shop = searchParams.get("shop");

    if (!shop) {
        return new Response("Missing shop parameter", { status: 400 });
    }

    const redirectUrl = `https://${shop}/admin/oauth/authorize?client_id=${process.env.SHOPIFY_API_KEY}&scope=${process.env.SHOPIFY_SCOPES}&redirect_uri=${process.env.SHOPIFY_REDIRECT_URI}`;

    return Response.redirect(redirectUrl);
}
