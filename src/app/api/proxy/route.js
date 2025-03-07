import { NextResponse } from 'next/server';

export async function GET() {
  return new NextResponse(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Shopify Giveaway</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 50px;
          }
          h1 {
            color: #008060;
          }
          p {
            color: #666;
          }
        </style>
      </head>
      <body>
        <h1>🎉 Welcome to the Giveaway! 🎉</h1>
        <p>Check back soon for exciting rewards.</p>
      </body>
    </html>
  `, {
    headers: { "Content-Type": "text/html" },
  });
}
