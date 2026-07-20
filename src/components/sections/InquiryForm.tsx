"use client";

import { FormEvent, useState } from "react";
import { BUDGET_OPTIONS, CHANNEL_OPTIONS, REGION_OPTIONS, STORE_OPTIONS } from "@/lib/inquiry";
import { trackEvent } from "@/lib/analytics";

type SubmitState = "idle" | "submitting" | "success" | "error";

const inputClass =
  "w-full rounded-xl border border-iron-900/15 bg-white px-4 py-3.5 text-iron-950 placeholder:text-iron-400 focus:border-ember-500 focus:outline-none focus:ring-2 focus:ring-ember-500/20";

function readUtmFromLocation() {
  if (typeof window === "undefined") {
    return { utmSource: "", utmMedium: "", utmCampaign: "" };
  }
  const params = new URLSearchParams(window.location.search);
  return {
    utmSource: params.get("utm_source") ?? "",
    utmMedium: params.get("utm_medium") ?? "",
    utmCampaign: params.get("utm_campaign") ?? "",
  };
}

export default function InquiryForm() {
  const [state, setState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [utm] = useState(readUtmFromLocation);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("submitting");
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get("name"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      region: formData.get("region"),
      store: formData.get("store"),
      budget: formData.get("budget"),
      channel: formData.get("channel"),
      memo: formData.get("memo"),
      privacyConsent: formData.get("privacyConsent") === "on",
      website: formData.get("website"),
      ...utm,
    };

    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setState("error");
        setErrorMessage(data.message ?? "잠시 후 다시 시도해주세요.");
        return;
      }

      trackEvent("inquiry_submit", { region: String(payload.region ?? "") });
      setState("success");
    } catch {
      setState("error");
      setErrorMessage("네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }
  }

  if (state === "success") {
    return (
      <div className="rounded-2xl border border-ember-500/20 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-ember-500/10 text-2xl">
          ✅
        </div>
        <h3 className="mt-4 font-display text-2xl text-iron-950">문의가 정상 접수되었습니다</h3>
        <p className="mt-2 text-sm leading-relaxed text-iron-700">
          담당자가 확인 후 영업일 기준 1일 이내로 입력하신 연락처로 안내드리겠습니다.
          <br />
          빠른 상담을 원하시면 전화 또는 카카오톡으로도 문의해주세요.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-iron-900/8 bg-white p-6 shadow-sm md:p-8">
      {/* Honeypot field — hidden from real users, catches simple bots */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
        aria-hidden="true"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-iron-800">
            이름 <span className="text-ember-500">*</span>
          </label>
          <input id="name" name="name" type="text" required maxLength={30} placeholder="홍길동" className={inputClass} />
        </div>
        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-semibold text-iron-800">
            연락처 <span className="text-ember-500">*</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            placeholder="010-1234-5678"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-iron-800">
          이메일
        </label>
        <input id="email" name="email" type="email" placeholder="example@email.com" className={inputClass} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="region" className="mb-1.5 block text-sm font-semibold text-iron-800">
            희망 창업지역 <span className="text-ember-500">*</span>
          </label>
          <select id="region" name="region" required defaultValue="" className={inputClass}>
            <option value="" disabled>
              선택해주세요
            </option>
            {REGION_OPTIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="budget" className="mb-1.5 block text-sm font-semibold text-iron-800">
            예상 창업비용 <span className="text-ember-500">*</span>
          </label>
          <select id="budget" name="budget" required defaultValue="" className={inputClass}>
            <option value="" disabled>
              선택해주세요
            </option>
            {BUDGET_OPTIONS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <span className="mb-1.5 block text-sm font-semibold text-iron-800">
          점포 보유 여부 <span className="text-ember-500">*</span>
        </span>
        <div className="grid grid-cols-3 gap-2">
          {STORE_OPTIONS.map((opt, i) => (
            <label
              key={opt.value}
              className="flex cursor-pointer items-center justify-center rounded-xl border border-iron-900/15 px-2 py-3 text-center text-sm font-medium text-iron-800 has-checked:border-ember-500 has-checked:bg-ember-500/10 has-checked:text-ember-600"
            >
              <input type="radio" name="store" value={opt.value} required defaultChecked={i === 2} className="sr-only" />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="channel" className="mb-1.5 block text-sm font-semibold text-iron-800">
          유입 경로
        </label>
        <select id="channel" name="channel" defaultValue="" className={inputClass}>
          <option value="">선택해주세요</option>
          {CHANNEL_OPTIONS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="memo" className="mb-1.5 block text-sm font-semibold text-iron-800">
          문의 내용
        </label>
        <textarea
          id="memo"
          name="memo"
          rows={4}
          maxLength={1000}
          placeholder="궁금하신 점을 자유롭게 남겨주세요."
          className={inputClass}
        />
      </div>

      <label className="flex items-start gap-2.5 text-xs leading-relaxed text-iron-600">
        <input
          type="checkbox"
          name="privacyConsent"
          required
          className="mt-0.5 h-5 w-5 shrink-0 accent-ember-500"
        />
        <span>
          [필수] 개인정보 수집·이용에 동의합니다. 수집된 정보는 가맹 상담 목적으로만 사용되며 상담 완료 후
          관련 법령에 따라 안전하게 보관·파기됩니다.
        </span>
      </label>

      {state === "error" && (
        <p role="alert" className="rounded-lg bg-gochujang-500/10 px-4 py-3 text-sm font-medium text-gochujang-500">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={state === "submitting"}
        className="flex w-full items-center justify-center rounded-xl bg-ember-500 text-base font-bold text-white transition-colors hover:bg-ember-600 disabled:opacity-60"
        style={{ minHeight: 56 }}
      >
        {state === "submitting" ? "접수 중..." : "무료 창업 상담 신청하기"}
      </button>
    </form>
  );
}
