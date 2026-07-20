"use server";

import { redirect } from "next/navigation";
import { createAdminSession, deleteAdminSession } from "@/lib/session";

export interface LoginState {
  error?: string;
}

export async function loginAction(_state: LoginState, formData: FormData): Promise<LoginState> {
  const password = formData.get("password");
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return { error: "관리자 비밀번호가 설정되지 않았습니다. ADMIN_PASSWORD 환경변수를 확인해주세요." };
  }

  if (typeof password !== "string" || password !== adminPassword) {
    return { error: "비밀번호가 올바르지 않습니다." };
  }

  await createAdminSession();
  redirect("/admin");
}

export async function logoutAction() {
  await deleteAdminSession();
  redirect("/admin/login");
}
