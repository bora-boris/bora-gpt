import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
//import { parse, serialize } from "cookie";

export function middleware(req: NextRequest) {
  console.log("reaching middleware");
  const sessionCookie = req.cookies.get("session-id");
  console.log("sessionCookie", sessionCookie);

  if (!sessionCookie) {
    const sessionId = crypto.randomUUID();
    const res = NextResponse.next();
    res.cookies.set("session-id", sessionId, {
      path: "/",
      //maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  }

  return NextResponse.next();
}
