import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { decrypt } from "@/lib/session";

export const verifyAdminSession = cache(async () => {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("admin_session")?.value;
  const session = await decrypt(cookie);

  if (!session || session.role !== "admin") {
    redirect("/admin/login");
  }

  return { isAuth: true };
});
