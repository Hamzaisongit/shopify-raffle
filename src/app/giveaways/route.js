import { NextResponse } from "next/server";

export async function GET(req) {
    return NextResponse("<h1>✅ SIGNATURE MATCHES!</h1>", { headers: { "Content-Type": "text/html" } })
}