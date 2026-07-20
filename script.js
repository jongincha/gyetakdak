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

// ---------- 차트 (Chart.js) — 예시 데이터, 실제 수치로 교체 필요 ----------
function initCharts() {
  if (typeof Chart === 'undefined') return;

  const revenueEl = document.getElementById('revenueChart');
  if (revenueEl) {
    new Chart(revenueEl, {
      type: 'line',
      data: {
        labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
        datasets: [
          {
            label: '월별 매출 (만원, 예시)',
            data: [7200, 7500, 8100, 8400, 8900, 9200, 9600, 9800, 9500, 9300, 9100, 9800],
            borderColor: '#c8213c',
            backgroundColor: 'rgba(200, 33, 60, 0.15)',
            tension: 0.35,
            fill: true,
          },
          {
            label: '월별 순이익 (만원, 예시)',
            data: [1900, 2000, 2200, 2350, 2500, 2600, 2750, 2900, 2700, 2600, 2500, 2900],
            borderColor: '#c9a227',
            backgroundColor: 'rgba(201, 162, 39, 0.12)',
            tension: 0.35,
            fill: true,
          },
        ],
      },
      options: chartBaseOptions(),
    });
  }

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

function chartBaseOptions() {
  return {
    responsive: true,
    plugins: {
      legend: { labels: { color: '#b9b6b0' } },
    },
    scales: {
      x: { ticks: { color: '#817e79' }, grid: { color: 'rgba(255,255,255,0.06)' } },
      y: { ticks: { color: '#817e79' }, grid: { color: 'rgba(255,255,255,0.06)' } },
    },
  };
}

// ---------- 창업 문의 폼 ----------
// 구글 Apps Script 웹 앱(구글 시트 저장용)으로 문의 내용을 전송합니다.
// 2단계에서 발급받은 본인의 Apps Script 웹 앱 URL로 교체하세요.
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz0DgXSYvnHRx86hYWRci84gtFsiOCR5A1SNV9z_8qDzUv2akVN0l9aDUOraQDLXWH-2A/exec';

function initInquiryForm() {
  const form = document.getElementById('inquiryForm');
  const status = document.getElementById('formStatus');
  const submitBtn = form ? form.querySelector('button[type="submit"]') : null;
  if (!form || !status) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const sources = Array.from(form.querySelectorAll('input[name="source"]:checked')).map((el) => el.value);
    const formData = {
      name: document.getElementById('f-name').value,
      phone: document.getElementById('f-phone').value,
      email: document.getElementById('f-email').value,
      region: document.getElementById('f-region').value,
      hasStore: (form.querySelector('input[name="hasStore"]:checked') || {}).value || '',
      budget: document.getElementById('f-budget').value,
      source: sources.join(', '),
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
          status.textContent = '창업 문의가 접수되었습니다. 담당자가 1~2일 내로 연락드리겠습니다.';
          form.reset();
        } else {
          status.textContent = '접수 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';
        }
      })
      .catch((error) => {
        console.error('Inquiry submit error:', error);
        status.textContent = '전송에 실패했습니다. 네트워크 상태를 확인하고 다시 시도해 주세요.';
      })
      .finally(() => {
        submitBtn.disabled = false;
      });
  });
}
