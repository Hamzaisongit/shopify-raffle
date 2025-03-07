// app/api/proxy/route.js
import { NextResponse } from 'next/server';
import crypto from 'crypto';

// Your Shopify secret from environment variables
const SHOPIFY_API_SECRET = process.env.SHOPIFY_API_SECRET;

// Handle GET requests to display event data
export async function GET(request) {
    console.log(request)
  try {
    // Validate the request is coming from Shopify
    const searchParams = request.nextUrl.searchParams;
    const query = Object.fromEntries(searchParams.entries());
    
    // For debugging
    console.log("🔹 Received Shopify Query:", query);
    
    // Check for required Shopify API secret
    if (!SHOPIFY_API_SECRET) {
      console.error('SHOPIFY_API_SECRET is not set in environment variables');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }
    
    // Verify this is a valid Shopify store
    const shop = query.shop || '';
    if (!shop || !shop.includes('myshopify.com')) {
      return NextResponse.json({ error: 'Invalid shop parameter' }, { status: 400 });
    }
    
    // Validate the signature (mandatory for security)
    if (!validateRequest(query)) {
      return NextResponse.json({ error: 'Invalid request signature' }, { status: 401 });
    }
    
    // Get event data
    // In a real app, you would fetch this from your database or an API
    const events = [
      {
        id: 1,
        title: "Summer Sale Launch",
        date: "2025-03-15",
        startTime: "10:00 AM",
        endTime: "6:00 PM",
        description: "Kickoff event for our annual summer sale with special discounts and promotions."
      },
      {
        id: 2,
        title: "New Collection Preview",
        date: "2025-03-20",
        startTime: "2:00 PM",
        endTime: "4:00 PM",
        description: "Exclusive preview of our spring collection with refreshments and special guest designers."
      },
      {
        id: 3,
        title: "Customer Appreciation Day",
        date: "2025-03-25",
        startTime: "12:00 PM",
        endTime: "8:00 PM",
        description: "A special day to thank our loyal customers with gifts, discounts, and entertainment."
      }
    ];
    
    // Return HTML content to display on the Shopify store
    return new NextResponse(generateEventHtml(events), {
      headers: {
        'Content-Type': 'text/html',
      },
    });
    
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

// Validate Shopify App Proxy request signature
function validateRequest(query) {
  if (!SHOPIFY_API_SECRET) {
    console.warn('SHOPIFY_API_SECRET is not set');
    return false;
  }

  const signature = query.signature; // Shopify App Proxy uses 'signature', NOT 'hmac'
  if (!signature) {
    return false; // No signature means request is invalid
  }

  // Remove 'signature' key from the query before hashing
  const queryWithoutSignature = { ...query };
  delete queryWithoutSignature.signature;

  // Convert query parameters to a format Shopify expects (no sorting)
  const queryString = Object.keys(queryWithoutSignature)
    .map(key => `${key}=${decodeURIComponent(queryWithoutSignature[key])}`)
    .join('');

  // Calculate expected HMAC signature
  const expectedSignature = crypto
    .createHmac('sha256', SHOPIFY_API_SECRET)
    .update(queryString)
    .digest('hex');

  // For debugging
  console.log("🔹 Expected Signature:", expectedSignature);
  console.log("🔹 Received Signature:", signature);

  return expectedSignature === signature;
}

// Generate HTML to display the events
function generateEventHtml(events) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Upcoming Events</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica Neue, sans-serif;
            line-height: 1.5;
            padding: 20px;
            max-width: 800px;
            margin: 0 auto;
          }
          h1 {
            color: #212B36;
            margin-bottom: 20px;
          }
          .event-card {
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          }
          .event-title {
            font-size: 20px;
            font-weight: 600;
            color: #008060;
            margin-top: 0;
          }
          .event-date {
            font-weight: 500;
            margin-bottom: 10px;
          }
          .event-description {
            color: #637381;
          }
        </style>
      </head>
      <body>
        <h1>Upcoming Events</h1>
        ${events.map(event => `
          <div class="event-card">
            <h2 class="event-title">${event.title}</h2>
            <p class="event-date">${event.date} | ${event.startTime} - ${event.endTime}</p>
            <p class="event-description">${event.description}</p>
          </div>
        `).join('')}
      </body>
    </html>
  `;
}