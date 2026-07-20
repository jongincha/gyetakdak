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
// NOTE: 백엔드 엔드포인트가 없어 현재는 제출 시 브라우저에서만 확인 메시지를 표시합니다.
// 실제 서비스 연동 시 fetch('/api/inquiry', { method: 'POST', body: ... }) 형태로 교체하세요.
function initInquiryForm() {
  const form = document.getElementById('inquiryForm');
  const status = document.getElementById('formStatus');
  if (!form || !status) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    status.textContent = '문의가 접수되었습니다. 담당자가 곧 연락드리겠습니다. (임시 확인 메시지 — 실제 접수를 위해서는 서버 연동이 필요합니다)';
    form.reset();
  });
}
