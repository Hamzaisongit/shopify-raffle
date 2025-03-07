// app/api/proxy/route.js
import { NextResponse } from 'next/server';
import crypto from 'crypto';

// Your Shopify secret from environment variables
const SHOPIFY_API_SECRET = process.env.SHOPIFY_API_SECRET || '';

// Handle GET requests to display event data
export async function GET(request) {
    console.log(request)
  try {
    // Validate the request is coming from Shopify
    const searchParams = request.nextUrl.searchParams;
    const query = Object.fromEntries(searchParams.entries());
    
    // Basic validation that the request is legitimate
    const shop = query.shop || '';
    if (!shop || !shop.includes('myshopify.com')) {
      return NextResponse.json({ error: 'Invalid shop parameter' }, { status: 400 });
    }
    
    // Optional: Validate HMAC signature if security is important
    if (query.hmac && !validateRequest(query)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
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

// Helper function to validate the request is from Shopify
function validateRequest(query) {
  if (!SHOPIFY_API_SECRET) {
    console.warn('SHOPIFY_API_SECRET is not set');
    return false;
  }
  
  const hmac = query.hmac;
  const queryWithoutHmac = { ...query };
  delete queryWithoutHmac.hmac;
  
  // Sort and join the parameters
  const sortedParams = Object.keys(queryWithoutHmac)
    .sort()
    .map(key => `${key}=${queryWithoutHmac[key]}`)
    .join('&');
  
  // Calculate the HMAC
  const calculatedHmac = crypto
    .createHmac('sha256', SHOPIFY_API_SECRET)
    .update(sortedParams)
    .digest('hex');
  
  return hmac === calculatedHmac;
}

// Generate HTML to display the events
function generateEventHtml(events) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Upcoming Events</title>
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