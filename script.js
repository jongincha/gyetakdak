// ========================================================================
// 계탉닭 홈페이지 — 공용 스크립트 (캐러셀, 스크롤 reveal, 차트, 폼)
// ========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initTopbar();
  initReveal();
  initCarousels();
  initGallerySliders();
  initVideoModal();
  initPhotoModal();
  initBackgroundVideoMotion();
  initScrollSpy();
  initBackToTop();
  initCharts();
  initInquiryForm();
  document.getElementById('year').textContent = new Date().getFullYear();
});

// ---------- 배경 영상: 항상 자동재생 유지 ----------
// 브라우저 자동재생 정책, 탭 전환 등으로 일시정지될 경우를 대비해 재생 상태를 계속 보정합니다.
function initBackgroundVideoMotion() {
  const videos = document.querySelectorAll('.hero__video, .intro__video-el');
  if (!videos.length) return;

  videos.forEach((video) => {
    const tryPlay = () => video.play().catch(() => {});
    tryPlay();
    video.addEventListener('loadeddata', tryPlay);
    video.addEventListener('canplay', tryPlay);
    video.addEventListener('pause', tryPlay);
  });
}

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

// ---------- 사진 갤러리 슬라이더 (화살표 + 도트) ----------
function initGallerySliders() {
  document.querySelectorAll('[data-gallery]').forEach((root) => {
    const slides = Array.from(root.querySelectorAll('.gallery-slider__slide'));
    if (slides.length < 2) return;

    let index = Math.max(0, slides.findIndex((s) => s.classList.contains('is-active')));
    const dotsWrap = root.querySelector('.gallery-slider__dots');
    let dots = [];

    if (dotsWrap) {
      dotsWrap.innerHTML = '';
      slides.forEach((_, i) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.setAttribute('aria-label', `사진 ${i + 1}`);
        btn.className = i === index ? 'is-active' : '';
        btn.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(btn);
      });
      dots = Array.from(dotsWrap.children);
    }

    function goTo(next) {
      slides[index].classList.remove('is-active');
      if (dots[index]) dots[index].classList.remove('is-active');
      index = (next + slides.length) % slides.length;
      slides[index].classList.add('is-active');
      if (dots[index]) dots[index].classList.add('is-active');
    }

    const prevBtn = root.querySelector('.gallery-slider__arrow--prev');
    const nextBtn = root.querySelector('.gallery-slider__arrow--next');
    if (prevBtn) prevBtn.addEventListener('click', () => goTo(index - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goTo(index + 1));
  });
}

// ---------- 유튜브 재생 모달 ----------
function initVideoModal() {
  const modal = document.getElementById('videoModal');
  const frame = document.getElementById('videoModalFrame');
  if (!modal || !frame) return;

  function openModal(videoId) {
    frame.innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1" title="영상 재생" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    frame.innerHTML = ''; // iframe 제거로 재생 정지
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-video-trigger]').forEach((trigger) => {
    trigger.addEventListener('click', () => openModal(trigger.dataset.videoId));
  });

  modal.querySelectorAll('[data-video-close]').forEach((el) => {
    el.addEventListener('click', closeModal);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });
}

// ---------- 메뉴 카드 클릭 시 사진 확대 모달 ----------
function initPhotoModal() {
  const modal = document.getElementById('photoModal');
  const img = document.getElementById('photoModalImg');
  const caption = document.getElementById('photoModalCaption');
  if (!modal || !img || !caption) return;

  let lastFocused = null;

  function openModal(src, title) {
    lastFocused = document.activeElement;
    img.src = src;
    img.alt = title;
    caption.textContent = title;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    modal.querySelector('.photo-modal__close').focus();
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }

  document.querySelectorAll('[data-photo-trigger]').forEach((card) => {
    const cardImg = card.querySelector('img');
    const title = card.querySelector('.menu-photo-card__title')?.textContent.trim() || '';
    if (!cardImg) return;

    const open = () => openModal(cardImg.currentSrc || cardImg.src, title);
    card.addEventListener('click', open);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open();
      }
    });
  });

  modal.querySelectorAll('[data-photo-close]').forEach((el) => {
    el.addEventListener('click', closeModal);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });
}

// ---------- 스크롤에 따른 상단 네비 활성 표시 ----------
function initScrollSpy() {
  const navLinks = Array.from(document.querySelectorAll('.topbar__nav a[href^="#"]'));
  if (!navLinks.length) return;

  const sections = navLinks
    .map((a) => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);
  if (!sections.length) return;

  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = `#${entry.target.id}`;
        navLinks.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === id));
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );
  sections.forEach((s) => observer.observe(s));
}

// ---------- 맨 위로 버튼 ----------
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  const onScroll = () => btn.classList.toggle('is-visible', window.scrollY > window.innerHeight);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw8kSQQLZYhs3QH6x5t4fal8PmG0X_Eo3J-VkL1dm2sWTldIbraOMc5UX6iHzBuBAy13Q/exec';

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

    // 이 Apps Script 배포는 CORS 응답 헤더를 정상적으로 보내므로 응답을 읽어
    // data.result 값으로 성공/실패를 판단합니다. (Content-Type을 text/plain으로
    // 보내 CORS preflight(OPTIONS) 자체가 발생하지 않게 합니다.)
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
          status.textContent = '접수 중 오류가 발생했습니다' + (data.error ? `: ${data.error}` : '. 잠시 후 다시 시도해 주세요.');
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
