export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gyetakdak.co.kr";
export const BRAND_NAME = "계탉닭";
export const BRAND_NAME_EN = "Gyetakdak";
export const BRAND_TAGLINE = "철판 위에서 완성하는 프리미엄 닭갈비";

export const CONTACT = {
  phone: "1544-0000",
  phoneHref: "tel:15440000",
  kakaoUrl: "https://pf.kakao.com/_gyetakdak/chat",
  kakaoHandle: "@gyetakdak",
  email: "franchise@gyetakdak.co.kr",
  hqAddress: "서울특별시 성동구 성수이로 12길 34, 계탉닭 본사",
  businessHours: "평일 09:00 - 18:00 (주말/공휴일 휴무)",
};

export const NAV_LINKS = [
  { href: "/brand", label: "브랜드" },
  { href: "/menu", label: "메뉴" },
  { href: "/startup", label: "창업안내" },
  { href: "/success", label: "성공사례" },
  { href: "/contact", label: "가맹문의" },
];

export const MENU_ITEMS = [
  {
    slug: "mala",
    name: "마라 철판 닭갈비",
    nameEn: "Mala Griddle Dakgalbi",
    description: "얼얼한 마라 향신과 불맛을 입힌 계탉닭 시그니처 메뉴. 마라 마니아를 겨냥한 매운맛 스코빌 조절이 특징입니다.",
    price: "19,900원 (2인)",
    tag: "시그니처",
    spice: 3,
  },
  {
    slug: "hanbang-soy",
    name: "한방 간장 닭갈비",
    nameEn: "Herbal Soy Dakgalbi",
    description: "한방 재료로 우려낸 육수와 간장 베이스로 깊고 은은한 감칠맛을 살린 순한 맛 메뉴. 아이와 함께 즐기기 좋습니다.",
    price: "18,900원 (2인)",
    tag: "순한맛",
    spice: 0,
  },
  {
    slug: "yakgochujang",
    name: "약고추장 철판 닭갈비",
    nameEn: "Yakgochujang Griddle Dakgalbi",
    description: "전통 약고추장 방식으로 숙성한 소스로 매콤달콤한 표준 한국식 닭갈비 맛을 구현한 스테디셀러.",
    price: "18,900원 (2인)",
    tag: "베스트",
    spice: 2,
  },
  {
    slug: "cheese-galbi",
    name: "치즈 철판 닭갈비",
    nameEn: "Cheese Griddle Dakgalbi",
    description: "매콤한 약고추장 닭갈비 위에 모짜렐라 치즈를 듬뿍 올려 완성하는 인기 사이드 메뉴.",
    price: "21,900원 (2인)",
    tag: "인기",
    spice: 2,
  },
] as const;

export const STARTUP_STEPS = [
  { step: "01", title: "가맹 상담 신청", desc: "홈페이지·전화·카카오톡으로 창업 상담을 신청합니다.", duration: "1일" },
  { step: "02", title: "사업설명회 & 상권분석", desc: "본사 사업설명회 참석 후 희망 지역 상권을 분석합니다.", duration: "3~5일" },
  { step: "03", title: "가맹 계약 체결", desc: "상권 확정 후 가맹계약서를 작성하고 상권보호를 확정합니다.", duration: "3일" },
  { step: "04", title: "점포 인테리어 & 시공", desc: "본사 표준 매뉴얼에 따라 인테리어·설비·워크업 창구를 시공합니다.", duration: "20~30일" },
  { step: "05", title: "가맹점주 교육", desc: "조리·운영·서비스 교육을 본사 직영 교육장에서 이수합니다.", duration: "5~7일" },
  { step: "06", title: "오픈 & 본사 지원", desc: "오픈 전후 본사 슈퍼바이저가 현장에 방문해 초기 운영을 지원합니다.", duration: "오픈일 기준 -3일 ~ +7일" },
] as const;

export const COST_ITEMS = [
  { label: "가맹비", amount: "10,000,000원", note: "계약 시 1회 납부" },
  { label: "교육비", amount: "3,000,000원", note: "조리·운영 교육 포함" },
  { label: "인테리어 (33㎡ 기준)", amount: "38,000,000원", note: "평당 시공비 기준, 평수별 변동" },
  { label: "주방설비 & 철판시설", amount: "22,000,000원", note: "본사 표준 장비 일체" },
  { label: "간판 & 사인물", amount: "5,000,000원", note: "외부/내부 사인 포함" },
  { label: "초도물품", amount: "4,000,000원", note: "오픈 초기 식자재·소모품" },
] as const;

export const FAQ_ITEMS = [
  {
    q: "왜 계탉닭 창업인가요?",
    a: "계탉닭은 철판 조리 방식으로 조리 시간을 표준화해 초보 창업자도 균일한 맛을 낼 수 있습니다. 마라·한방간장·약고추장 등 차별화된 메뉴 라인업으로 반경 상권 내 대체 불가능한 포지셔닝을 확보합니다.",
  },
  {
    q: "초보도 운영 가능한가요?",
    a: "네. 본사 표준 레시피와 계량화된 소스, 5~7일 집중 교육 프로그램을 통해 조리 경험이 없어도 오픈 첫날부터 동일한 맛을 재현할 수 있도록 지원합니다.",
  },
  {
    q: "투자금 회수기간은?",
    a: "상권과 매장 규모에 따라 차이가 있으나, 기존 가맹점 평균 데이터 기준 약 18~24개월 내 투자금 회수를 목표로 상권 분석 및 매출 시뮬레이션을 제공합니다.",
  },
  {
    q: "본사 지원은 무엇인가요?",
    a: "상권 분석, 인테리어 표준 시공, 조리·운영 교육, 오픈 전후 슈퍼바이저 현장 지원, 식자재 공동구매, 마케팅·SNS 콘텐츠 지원까지 창업 전 과정을 함께합니다.",
  },
  {
    q: "상권 보호는 어떻게 되나요?",
    a: "가맹계약 체결 시 반경 기준 상권보호 범위를 계약서에 명시하며, 해당 범위 내 동일 브랜드 추가 출점을 제한하여 가맹점의 안정적인 운영을 보장합니다.",
  },
] as const;

export const NATIONWIDE_STORE_COUNT = 87;
export const AVG_MONTHLY_REVENUE = "4,280만원";
export const YEARS_IN_BUSINESS = 6;

export const SUCCESS_CASES = [
  {
    name: "성수점 이◯◯ 점주",
    region: "서울 성동구",
    openedAt: "2022년 8월 오픈",
    quote: "약고추장 레시피 하나만 제대로 익혀도 오픈 첫 주부터 본점과 똑같은 맛이 나왔어요. 조리 경험이 없던 제게 가장 큰 자신감이었습니다.",
    revenueGrowth: "오픈 3개월차 대비 월매출 62% 상승",
  },
  {
    name: "홍대점 박◯◯ 점주",
    region: "서울 마포구",
    openedAt: "2023년 3월 오픈",
    quote: "마라 메뉴 덕분에 20대 손님 재방문율이 눈에 띄게 늘었어요. 상권 특성을 미리 분석해준 본사 데이터가 정확했습니다.",
    revenueGrowth: "1년차 평균 월매출 4,600만원",
  },
  {
    name: "대전 둔산점 최◯◯ 점주",
    region: "대전 서구",
    openedAt: "2021년 11월 오픈",
    quote: "본사 슈퍼바이저가 오픈 첫 주 내내 상주하면서 서비스 동선까지 잡아준 게 정말 큰 도움이 됐습니다.",
    revenueGrowth: "투자금 회수기간 17개월",
  },
] as const;

export const MONTHLY_REVENUE_TREND = [
  { month: "1월", value: 3820 },
  { month: "2월", value: 3650 },
  { month: "3월", value: 4010 },
  { month: "4월", value: 4180 },
  { month: "5월", value: 4390 },
  { month: "6월", value: 4520 },
  { month: "7월", value: 4680 },
  { month: "8월", value: 4590 },
  { month: "9월", value: 4410 },
  { month: "10월", value: 4460 },
  { month: "11월", value: 4520 },
  { month: "12월", value: 4820 },
] as const;

export const REGIONAL_STORES = [
  { region: "서울", count: 28 },
  { region: "경기·인천", count: 21 },
  { region: "부산·경남", count: 12 },
  { region: "대구·경북", count: 8 },
  { region: "대전·충청", count: 9 },
  { region: "광주·전라", count: 6 },
  { region: "강원·제주", count: 3 },
] as const;
