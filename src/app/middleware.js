import { NextResponse } from "next/server";

export async function middleware(req){

    // const { pathname } = req.nextUrl;

    // if (pathname === "/" || pathname.startsWith("/signup")) {
    //   return NextResponse.next();
    // }

    // const { data: { user } } = await supabase.auth.getUser();

    // if (!user) {
    //  return NextResponse.redirect(new URL("/login",req.url))
    // } 

   return NextResponse.next()
}

export const config = {
matcher: "/:path*"
}