import { NextResponse } from "next/server";

export async function middleware(req) {
  const res = NextResponse.next();

  return res; // Continue if authenticated
}

export const config = {
  // matcher: ["/admin", "/admin/:path*"], 
};
