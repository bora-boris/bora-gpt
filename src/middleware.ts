import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
//import { parse, serialize } from "cookie";

export function middleware(req: NextRequest) {
  const sessionCookie = req.cookies.get("session-id");

  if (!sessionCookie) {
    const sessionId = crypto.randomUUID();
    const res = NextResponse.next();
    res.cookies.set("session-id", sessionId, {
      path: "/",
    });
    return res;
  }

  return NextResponse.next();
}
