// ========================================================================
// 계탉닭 홈페이지 — 공용 스크립트 (캐러셀, 스크롤 reveal, 차트, 폼)
// ========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initTopbar();
  initReveal();
  initCarousels();
  initCharts();
  initInquiryForm();
  document.getElementById('year').textContent = new Date().getFullYear();
});

// ---------- 상단바: 스크롤 시 배경 진하게 ----------
function initTopbar() {
  const topbar = document.getElementById('topbar');
  if (!topbar) return;
  const onScroll = () => topbar.classList.toggle('is-scrolled', window.scrollY > 12);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

// ---------- 스크롤 등장 애니메이션 ----------
function initReveal() {
  const targets = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.05 }
  );
  targets.forEach((el) => observer.observe(el));
}

// ---------- 캐러셀 (히어로 슬라이드 / 성공사례) ----------
function initCarousels() {
  document.querySelectorAll('[data-carousel]').forEach((root) => {
    const interval = Number(root.dataset.autoplay) || 5000;
    const isHero = root.classList.contains('hero__slides');
    const slides = Array.from(
      root.querySelectorAll(isHero ? '.hero__slide' : '.case-card')
    );
    if (slides.length < 2) return;

    let index = Math.max(0, slides.findIndex((s) => s.classList.contains('is-active')));
    let dotButtons = [];

    if (isHero) {
      const dotsWrap = document.querySelector('.hero__dots');
      if (dotsWrap) {
        dotsWrap.innerHTML = '';
        slides.forEach((slide, i) => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.setAttribute('aria-label', slide.dataset.caption || `슬라이드 ${i + 1}`);
          btn.className = i === index ? 'is-active' : '';
          btn.addEventListener('click', () => goTo(i));
          dotsWrap.appendChild(btn);
        });
        dotButtons = Array.from(dotsWrap.children);
      }
    }

    function goTo(next) {
      slides[index].classList.remove('is-active');
      if (dotButtons[index]) dotButtons[index].classList.remove('is-active');
      index = (next + slides.length) % slides.length;
      slides[index].classList.add('is-active');
      if (dotButtons[index]) dotButtons[index].classList.add('is-active');
    }

    let timer = setInterval(() => goTo(index + 1), interval);

    root.addEventListener('mouseenter', () => clearInterval(timer));
    root.addEventListener('mouseleave', () => {
      timer = setInterval(() => goTo(index + 1), interval);
    });
  });
}

// ---------- 차트 (Chart.js) ----------
// 3월/4월 매출은 계탉닭 본점의 실제 일별 매출 데이터입니다 (2026.03 / 2026.04).
function initCharts() {
  if (typeof Chart === 'undefined') return;

  const marchDaily = [
    4066000, 2418000, 2120000, 2511000, 1878000, 3046000, 4518000,
    4877000, 3404000, 3796000, 3415000, 3185000, 3976500, 4869000,
    5123000, 4331000, 3633000, 3637000, 3340000, 3634000, 5720000,
    5635000, 3949000, 3565000, 3717000, 3333000, 3870000, 5535000,
    5603000, 3897000, 4068000,
  ];
  const marchTop3 = [20, 21, 28]; // 3/21, 3/22, 3/29 (0-indexed)

  const aprilDaily = [
    3319500, 3864000, 4153500, 5822500,
    5308500, 3487000, 3663500, 3537000, 2927000, 3160000, 5717500,
    5010500, 3468500, 3428500, 3810500, 3123000, 3653500, 5948000,
    5295500, 2879000, 3051500, 2534000, 3761000, 4130500, 5031000,
    4485000, 3065000, 3117500, 2692500, 4066500,
  ];
  const aprilTop3 = [3, 10, 17]; // 4/4, 4/11, 4/18 (0-indexed)

  renderDailyRevenueChart('revenueChartMarch', marchDaily, marchTop3);
  renderDailyRevenueChart('revenueChartApril', aprilDaily, aprilTop3);

  const touristEl = document.getElementById('touristChart');
  if (touristEl) {
    new Chart(touristEl, {
      type: 'bar',
      data: {
        labels: ['2022', '2023', '2024', '2025', '2026(예상)'],
        datasets: [
          {
            label: '방한 외국인 관광객 (만명, 예시)',
            data: [320, 1100, 1650, 1894, 2000],
            backgroundColor: '#c9a227',
            borderRadius: 6,
          },
        ],
      },
      options: chartBaseOptions(),
    });
  }
}

function renderDailyRevenueChart(canvasId, dailyWon, top3Indexes) {
  const el = document.getElementById(canvasId);
  if (!el) return;

  const values = dailyWon.map((won) => Math.round(won / 1000)); // 천원 단위
  const colors = dailyWon.map((_, i) => (top3Indexes.includes(i) ? '#9c3b2a' : '#d8c39a'));

  new Chart(el, {
    type: 'bar',
    data: {
      labels: dailyWon.map((_, i) => i + 1),
      datasets: [
        {
          label: '일별 매출 (천원)',
          data: values,
          backgroundColor: colors,
          borderRadius: 3,
        },
      ],
    },
    options: chartBaseOptions(),
  });
}

function chartBaseOptions() {
  return {
    responsive: true,
    plugins: {
      legend: { labels: { color: '#6b5636' } },
    },
    scales: {
      x: { ticks: { color: '#9c8563' }, grid: { display: false } },
      y: { ticks: { color: '#9c8563' }, grid: { color: 'rgba(46, 32, 19, 0.08)' } },
    },
  };
}

// ---------- 창업 문의 폼 ----------
// 구글 Apps Script 웹 앱(구글 시트 저장용)으로 문의 내용을 전송합니다.
// 2단계에서 발급받은 본인의 Apps Script 웹 앱 URL로 교체하세요.
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw5YRTT2pAMbH20I8hJjIcinXLCcgkhlzQC1pV-q-00aZ-JMImXlIbDezUDp11ZnsHXXw/exec';

function initInquiryForm() {
  const form = document.getElementById('inquiryForm');
  const status = document.getElementById('formStatus');
  const submitBtn = form ? form.querySelector('button[type="submit"]') : null;
  if (!form || !status) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const consent = (form.querySelector('input[name="privacyConsent"]:checked') || {}).value;
    if (consent !== 'yes') {
      status.classList.add('is-error');
      status.textContent = '개인정보 수집·이용에 동의하셔야 문의를 접수할 수 있습니다.';
      return;
    }

    const sources = Array.from(form.querySelectorAll('input[name="source"]:checked')).map((el) => el.value);
    if (sources.length === 0) {
      status.classList.add('is-error');
      status.textContent = '유입경로를 최소 하나 이상 선택해 주세요.';
      return;
    }
    status.classList.remove('is-error');

    const formData = {
      name: document.getElementById('f-name').value,
      phone: document.getElementById('f-phone').value,
      email: document.getElementById('f-email').value,
      location: document.getElementById('f-region').value,
      storeExist: (form.querySelector('input[name="hasStore"]:checked') || {}).value || '',
      budget: document.getElementById('f-budget').value,
      channel: sources.join(', '),
    };

    submitBtn.disabled = true;
    status.textContent = '전송 중…';

    // Apps Script는 CORS preflight(OPTIONS)를 지원하지 않으므로
    // Content-Type을 text/plain으로 보내 preflight 자체가 발생하지 않게 합니다.
    fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result === 'success') {
          status.classList.remove('is-error');
          status.textContent = '창업 문의가 접수되었습니다. 담당자가 1~2일 내로 연락드리겠습니다.';
          form.reset();
        } else {
          status.classList.add('is-error');
          status.textContent = '접수 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';
        }
      })
      .catch((error) => {
        console.error('Inquiry submit error:', error);
        status.classList.add('is-error');
        status.textContent = '전송에 실패했습니다. 네트워크 상태를 확인하고 다시 시도해 주세요.';
      })
      .finally(() => {
        submitBtn.disabled = false;
      });
  });
}
