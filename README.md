# 계탉닭 (Gyetakdak) 프랜차이즈 랜딩페이지

철판 닭갈비 프랜차이즈 계탉닭의 가맹문의 전환 랜딩페이지. Next.js App Router + TypeScript + Tailwind CSS로 구현되었습니다.

## 시작하기

```bash
npm install
npm run dev
```

http://localhost:3000 에서 확인할 수 있습니다.

## 페이지 구조

| 경로 | 설명 |
|---|---|
| `/` | 홈 — 히어로, 브랜드 소개, 메뉴, 창업절차, 성공사례, FAQ |
| `/brand` | 브랜드 스토리 |
| `/menu` | 전체 메뉴 |
| `/startup` | 창업절차 6단계 · 개설비용 · FAQ |
| `/success` | 성공사례 · 월매출 추이 · 전국매장 현황 |
| `/contact` | 가맹문의 폼 |
| `/admin` | 창업문의 목록 (비밀번호 보호) |

## 환경변수

`.env.example`을 `.env.local`로 복사해 채워 넣으세요. 모든 연동은 **선택 사항**이며, 미설정 시 해당 기능은 조용히 no-op 처리됩니다(빌드/런타임 에러 없음).

- **ADMIN_PASSWORD / SESSION_SECRET** — `/admin` 접근에 필요. 설정하지 않으면 로그인 불가.
- **SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY** — 문의 DB 저장. 미설정 시 `.data/inquiries.json`에 로컬 저장(개발용, 대부분의 서버리스 배포 환경에서는 영속되지 않음). 프로덕션에서는 `supabase/schema.sql`을 실행 후 반드시 설정하세요.
- **GOOGLE_SHEET_ID / GOOGLE_SERVICE_ACCOUNT_EMAIL / GOOGLE_PRIVATE_KEY** — 관리자가 로그인 없이 실시간으로 문의를 확인할 수 있는 구글 시트 연동.
- **RESEND_API_KEY 또는 SMTP_\*** + **INQUIRY_ADMIN_EMAIL** — 신규 문의 접수 시 관리자 이메일 알림.
- **NEXT_PUBLIC_GA_ID / GTM_ID / META_PIXEL_ID / NAVER_ANALYTICS_ID** — 마케팅 분석 태그.
- **NEXT_PUBLIC_KAKAO_MAP_KEY** — 추후 `/success` 페이지에 지도 기반 매장 찾기를 추가할 때 사용.

## 문의 처리 흐름

`POST /api/inquiry` → 입력값 검증(Zod) → Supabase(또는 로컬 파일) 저장 → 구글 시트 append → 관리자 이메일 발송 → 성공 응답 → 클라이언트에서 GA 이벤트(`inquiry_submit`) 발생.

Sheets/이메일 실패는 접수 자체를 막지 않도록 `Promise.allSettled`로 격리되어 있습니다.

## 남은 작업 (실제 인프라/콘텐츠 필요)

- **사진/영상**: 메뉴·매장 실사진, 유튜브 영상, SNS 후기 캡처 등 실제 브랜드 자산으로 교체 필요 (`src/lib/constants.ts`의 이미지 관련 부분은 현재 그라디언트 플레이스홀더).
- **Kakao Maps**: `/success` 전국매장은 현재 권역별 숫자 요약만 제공. 지도 기반 매장 찾기는 `NEXT_PUBLIC_KAKAO_MAP_KEY` 발급 후 추가 구현 필요.
- **콘텐츠 CMS**: 브리핑에 명시된 배너/유튜브/SNS후기/공지사항 등 전체 콘텐츠 관리 UI는 별도 CMS 백엔드(Supabase 테이블 확장 또는 Strapi/Sanity) 선정이 필요해 이번 범위에서는 제외했습니다. `/admin`은 우선순위가 가장 높은 창업문의 목록만 제공합니다.
- **OG 이미지**: `public/og-image.jpg` 및 `public/logo.png`를 실제 브랜드 자산으로 추가해주세요 (현재 미존재 — 소셜 공유 시 깨짐).
- **실제 사업자 정보**: 푸터의 사업자등록번호/대표자/통신판매업신고번호는 플레이스홀더입니다.

## 빌드 / 검증

```bash
npm run lint
npx tsc --noEmit
npm run build
```
