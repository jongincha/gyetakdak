import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/session";

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  if (path === "/admin/login") {
    return NextResponse.next();
  }

  const cookie = req.cookies.get("admin_session")?.value;
  const session = await decrypt(cookie);

  if (!session || session.role !== "admin") {
    return NextResponse.redirect(new URL("/admin/login", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
