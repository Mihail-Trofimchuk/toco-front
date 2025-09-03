import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req: NextRequest) {
  let token = req.cookies.get("token")?.value;

  if (token && token?.startsWith("Bearer ")) {
    token = token.slice(7);
  }
  const { pathname } = req.nextUrl;

  const publicPaths = [
    "/auth/login",
    "/auth/register",
    "/auth/logout",
    "/favicon.ico",
    "/_next/",
  ];

  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  try {

    const { uuid }  = jwt.verify(token, process.env.JWT_SECRET!) as { uuid: string};
    console.log("middleware ~ uuid:", uuid)
    return NextResponse.next(); 
  } catch (err) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }
}

export const config = {
  matcher: [
    "/available",
    "/transactions",
    "/wallet",
    "/dashboard",
  ],
  runtime: "nodejs", 
};
