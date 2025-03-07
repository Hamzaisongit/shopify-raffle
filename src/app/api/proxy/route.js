import { NextResponse } from 'next/server';

export async function GET() {
  return new NextResponse(`
    {% layout none %}
    <h1>🎉 Welcome, {{ shop.name }}! 🎉</h1>
    <p>Your customer ID: {{ customer.id }}</p>
    <p>Today's Date: {{ "now" | date: "%Y-%m-%d" }}</p>
  `, {
    headers: {
      'Content-Type': 'application/liquid',
    },
  });
}
