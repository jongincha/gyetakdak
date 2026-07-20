"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "@/app/admin/actions";
import { BRAND_NAME } from "@/lib/constants";

const initialState: LoginState = {};

export default function AdminLoginPage() {
  const [state, action, pending] = useActionState(loginAction, initialState);

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-ash-100 px-4 py-16">
      <form action={action} className="w-full max-w-sm rounded-2xl border border-iron-900/8 bg-white p-8 shadow-sm">
        <p className="font-display text-2xl text-iron-950">{BRAND_NAME} 관리자</p>
        <p className="mt-1 text-sm text-iron-600">창업문의 목록을 확인하려면 비밀번호를 입력해주세요.</p>

        <label htmlFor="password" className="mt-6 mb-1.5 block text-sm font-semibold text-iron-800">
          비밀번호
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="w-full rounded-xl border border-iron-900/15 px-4 py-3.5 focus:border-ember-500 focus:outline-none focus:ring-2 focus:ring-ember-500/20"
        />

        {state.error && (
          <p role="alert" className="mt-3 text-sm font-medium text-gochujang-500">
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="mt-6 flex w-full items-center justify-center rounded-xl bg-ember-500 text-base font-bold text-white transition-colors hover:bg-ember-600 disabled:opacity-60"
          style={{ minHeight: 56 }}
        >
          {pending ? "확인 중..." : "로그인"}
        </button>
      </form>
    </div>
  );
}
