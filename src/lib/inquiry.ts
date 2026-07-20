import { z } from "zod";

export const REGION_OPTIONS = [
  "서울",
  "경기·인천",
  "부산·경남",
  "대구·경북",
  "대전·충청",
  "광주·전라",
  "강원·제주",
  "미정",
] as const;

export const STORE_OPTIONS = [
  { value: "have", label: "보유 점포 있음" },
  { value: "searching", label: "점포 물색 중" },
  { value: "none", label: "아직 정하지 않음" },
] as const;

export const BUDGET_OPTIONS = [
  "5천만원 미만",
  "5천만원 ~ 1억원",
  "1억원 ~ 1억 5천만원",
  "1억 5천만원 이상",
  "상담 후 결정",
] as const;

export const CHANNEL_OPTIONS = [
  "네이버 검색",
  "구글 검색",
  "인스타그램/SNS",
  "유튜브",
  "지인 추천",
  "매장 방문",
  "기타",
] as const;

const phoneRegex = /^0\d{1,2}-?\d{3,4}-?\d{4}$/;

export const inquirySchema = z.object({
  name: z.string().trim().min(2, "이름을 2자 이상 입력해주세요.").max(30),
  phone: z
    .string()
    .trim()
    .regex(phoneRegex, "연락처 형식이 올바르지 않습니다. 예: 010-1234-5678"),
  email: z.string().trim().email("이메일 형식이 올바르지 않습니다.").optional().or(z.literal("")),
  region: z.enum(REGION_OPTIONS, { message: "희망 창업지역을 선택해주세요." }),
  store: z.enum(["have", "searching", "none"], { message: "점포 보유 여부를 선택해주세요." }),
  budget: z.enum(BUDGET_OPTIONS, { message: "예상 창업비용을 선택해주세요." }),
  channel: z.enum(CHANNEL_OPTIONS).optional().or(z.literal("")),
  memo: z.string().trim().max(1000).optional().or(z.literal("")),
  privacyConsent: z.literal(true, {
    error: () => ({ message: "개인정보 수집·이용에 동의해주세요." }),
  }),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
});

export type InquiryInput = z.infer<typeof inquirySchema>;

export interface StoredInquiry extends InquiryInput {
  id: string;
  createdAt: string;
  ip: string;
  userAgent: string;
  device: "mobile" | "desktop" | "tablet";
}

export function detectDevice(userAgent: string): "mobile" | "desktop" | "tablet" {
  const ua = userAgent.toLowerCase();
  if (/ipad|tablet/.test(ua)) return "tablet";
  if (/mobi|android|iphone/.test(ua)) return "mobile";
  return "desktop";
}
