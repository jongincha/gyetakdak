// ========================================================================
// 계탉닭 홈페이지 — 공용 스크립트 (캐러셀, 스크롤 reveal, 차트, 폼)
// ========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // 각 기능을 개별적으로 초기화합니다. 하나가 실패해도(예: 외부 스크립트 로딩 지연)
  // 나머지 기능이 함께 멈추지 않도록 실행 단위를 분리합니다.
  [
    initTopbar,
    initReveal,
    initStaggerReveal,
    initCarousels,
    initGallerySliders,
    initFactoryGallery,
    initReviewFanCarousel,
    initVideoModal,
    initPhotoModal,
    initBackgroundVideoMotion,
    initScrollSpy,
    initBackToTop,
    initCharts,
    initCountUp,
    initInquiryForm,
  ].forEach((fn) => {
    try {
      fn();
    } catch (err) {
      console.error(`[계탉닭] ${fn.name} 초기화 중 오류:`, err);
    }
  });

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
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

// ---------- 문단/문장이 위에서 아래로 순차적으로 페이드인되는 효과 ----------
// .stagger-group의 직계 자식(문장/줄)마다 순차 transition-delay를 부여한 뒤,
// 그룹이 스크롤로 화면에 들어오면 한 번에 .is-visible을 붙여 위→아래
// 순서대로 Fade-in Up 되도록 합니다.
function initStaggerReveal() {
  const groups = Array.from(document.querySelectorAll('.stagger-group'));
  if (!groups.length) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const STEP_SECONDS = 0.18;

  groups.forEach((group) => {
    Array.from(group.children).forEach((line, i) => {
      line.classList.add('stagger-line');
      if (!reduceMotion) line.style.transitionDelay = `${(i * STEP_SECONDS).toFixed(2)}s`;
    });
  });

  if (reduceMotion || !('IntersectionObserver' in window)) {
    groups.forEach((group) => group.classList.add('is-visible'));
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
    // 화면 하단에 살짝 걸치기만 해도 바로 나타나던 문제를 막기 위해, 요소가
    // 뷰포트 아래쪽 35% 안까지 들어와야(=조금 더 스크롤을 내려야) 트리거되게 함
    { rootMargin: '0px 0px -35% 0px', threshold: 0.15 }
  );
  groups.forEach((group) => observer.observe(group));
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

// ---------- 자체 공장 사진 슬라이드 갤러리 ----------
// 메인 사진 + 하단 썸네일, 4초 자동 재생, 마우스 드래그/터치 스와이프로 전환.
function initFactoryGallery() {
  const root = document.querySelector('.factory-gallery');
  if (!root) return;

  const slides = Array.from(root.querySelectorAll('.factory-gallery__slide'));
  const thumbs = Array.from(root.querySelectorAll('.factory-gallery__thumb'));
  const stage = root.querySelector('.factory-gallery__stage');
  if (slides.length < 2 || !stage) return;

  let index = Math.max(0, slides.findIndex((s) => s.classList.contains('is-active')));
  const AUTOPLAY_MS = Number(root.dataset.autoplay) || 4000;

  const thumbsWrap = root.querySelector('.factory-gallery__thumbs');

  // 썸네일이 화면 밖에 있으면 가로로만 스크롤해서 보여줍니다.
  // scrollIntoView는 세로축(문서 전체) 스크롤까지 건드려 모바일에서
  // 페이지가 튀는 원인이 되므로 쓰지 않습니다.
  function scrollThumbIntoView(thumb) {
    if (!thumbsWrap || !thumb) return;
    const wrapRect = thumbsWrap.getBoundingClientRect();
    const thumbRect = thumb.getBoundingClientRect();
    const offset = thumbRect.left - wrapRect.left - wrapRect.width / 2 + thumbRect.width / 2;
    thumbsWrap.scrollBy({ left: offset, behavior: 'smooth' });
  }

  function setActive(next) {
    slides[index].classList.remove('is-active');
    thumbs[index]?.classList.remove('is-active');
    thumbs[index]?.setAttribute('aria-selected', 'false');

    index = (next + slides.length) % slides.length;

    slides[index].classList.add('is-active');
    thumbs[index]?.classList.add('is-active');
    thumbs[index]?.setAttribute('aria-selected', 'true');
    scrollThumbIntoView(thumbs[index]);
  }

  function goTo(next) {
    setActive(next);
  }

  let timer = setInterval(() => goTo(index + 1), AUTOPLAY_MS);
  function restartTimer() {
    clearInterval(timer);
    timer = setInterval(() => goTo(index + 1), AUTOPLAY_MS);
  }

  thumbs.forEach((thumb, i) => {
    thumb.addEventListener('click', () => {
      goTo(i);
      restartTimer();
    });
  });

  root.addEventListener('mouseenter', () => clearInterval(timer));
  root.addEventListener('mouseleave', restartTimer);

  // 터치 스와이프 / 마우스 드래그로 슬라이드 전환
  const SWIPE_THRESHOLD = 40;
  let dragStartX = 0;
  let isDragging = false;

  function handleDragEnd(endX) {
    if (!isDragging) return;
    isDragging = false;
    const delta = endX - dragStartX;
    if (delta > SWIPE_THRESHOLD) {
      goTo(index - 1);
      restartTimer();
    } else if (delta < -SWIPE_THRESHOLD) {
      goTo(index + 1);
      restartTimer();
    }
  }

  stage.addEventListener(
    'touchstart',
    (e) => {
      dragStartX = e.touches[0].clientX;
      isDragging = true;
    },
    { passive: true }
  );
  stage.addEventListener(
    'touchend',
    (e) => handleDragEnd(e.changedTouches[0].clientX),
    { passive: true }
  );

  stage.addEventListener('mousedown', (e) => {
    e.preventDefault();
    dragStartX = e.clientX;
    isDragging = true;
  });
  window.addEventListener('mouseup', (e) => handleDragEnd(e.clientX));

  // 하단 썸네일 줄: 마우스로 클릭+드래그해서 가로로 넘겨볼 수 있게 함
  // (터치는 overflow-x: auto의 기본 스와이프 스크롤을 그대로 사용).
  if (thumbsWrap) {
    let thumbDragStartX = 0;
    let thumbScrollStart = 0;
    let thumbIsDragging = false;
    let thumbDragMoved = false;

    thumbsWrap.addEventListener('mousedown', (e) => {
      thumbIsDragging = true;
      thumbDragMoved = false;
      thumbDragStartX = e.clientX;
      thumbScrollStart = thumbsWrap.scrollLeft;
    });

    window.addEventListener('mousemove', (e) => {
      if (!thumbIsDragging) return;
      const delta = e.clientX - thumbDragStartX;
      if (Math.abs(delta) > 5) thumbDragMoved = true;
      thumbsWrap.scrollLeft = thumbScrollStart - delta;
    });

    window.addEventListener('mouseup', () => {
      thumbIsDragging = false;
    });

    // 드래그가 일어났다면 클릭(썸네일 선택)으로 처리하지 않도록 캡처 단계에서 막음
    thumbsWrap.addEventListener(
      'click',
      (e) => {
        if (thumbDragMoved) {
          e.stopPropagation();
          e.preventDefault();
        }
      },
      true
    );
  }
}

// ---------- SNS 후기 부채꼴 카드 캐러셀 ----------
// GSAP으로 카드를 부채꼴로 배치하고, 호버 시 카드가 좌우로 밀리며
// 반응하는 인터랙션을 구현합니다. GSAP CDN 로딩이 늦어질 수 있으므로
// initCharts()와 동일하게 재시도 방식으로 기다립니다.
function initReviewFanCarousel(retriesLeft = 10) {
  const container = document.getElementById('reviewFan');
  if (!container) return;

  if (typeof gsap === 'undefined') {
    if (retriesLeft <= 0) {
      console.error('[계탉닭] GSAP 로딩 실패로 후기 카드를 정적으로 표시합니다.');
      container.querySelectorAll('.fan-card').forEach((card) => {
        card.style.opacity = '1';
      });
      return;
    }
    setTimeout(() => initReviewFanCarousel(retriesLeft - 1), 300);
    return;
  }

  const MAX_VISIBLE = 7;
  const HALF = 3;
  const FAN_POSITIONS = [
    { rot: -21, scale: 0.7756, x: -30, y: 7.3, zIndex: 1 },
    { rot: -14, scale: 0.8498, x: -22, y: 4.0, zIndex: 2 },
    { rot: -7, scale: 0.9346, x: -11, y: 1.3, zIndex: 3 },
    { rot: 0, scale: 1.0, x: 0, y: 0.0, zIndex: 10 },
    { rot: 7, scale: 0.9346, x: 11, y: 1.3, zIndex: 3 },
    { rot: 14, scale: 0.8498, x: 22, y: 4.0, zIndex: 2 },
    { rot: 21, scale: 0.7756, x: 30, y: 7.3, zIndex: 1 },
  ];

  function getResponsiveMultiplier(width) {
    if (width < 480) return 0.28;
    if (width < 640) return 0.38;
    if (width < 768) return 0.5;
    if (width < 1024) return 0.75;
    return 1.0;
  }

  function getHeightMultiplier(width) {
    let idealPx;
    if (width < 480) idealPx = 22 * 16;
    else if (width < 640) idealPx = 26 * 16;
    else if (width < 768) idealPx = 28 * 16;
    else if (width < 1024) idealPx = 34 * 16;
    else idealPx = 38 * 16;
    const available = window.innerHeight * 0.7;
    if (available >= idealPx) return 1;
    return available / idealPx;
  }

  function getSlotConfig(totalCards, slot) {
    if (totalCards >= MAX_VISIBLE) return FAN_POSITIONS[slot];
    const center = totalCards >> 1;
    const distance = totalCards > 1 ? (slot - center) / center : 0;
    const absDistance = Math.abs(distance);
    return {
      rot: distance * 21,
      scale: 1.0 - 0.2244 * absDistance * absDistance,
      x: distance * 30,
      y: absDistance * absDistance * 7.3,
      zIndex: 10 - Math.abs(slot - center),
    };
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cardElements = Array.from(container.querySelectorAll('.fan-card'));
  const totalCards = cardElements.length;
  if (!totalCards) return;

  const needsPagination = totalCards > MAX_VISIBLE;
  const navEl = document.getElementById('reviewFanNav');
  const dotsEl = document.getElementById('reviewFanDots');
  const prevBtn = navEl ? navEl.querySelector('[data-fan-prev]') : null;
  const nextBtn = navEl ? navEl.querySelector('[data-fan-next]') : null;

  if (needsPagination && navEl) {
    navEl.hidden = false;
    cardElements.forEach(() => {
      const dot = document.createElement('span');
      dot.className = 'fan-nav__dot';
      dotsEl.appendChild(dot);
    });
  }

  let centerIndex = needsPagination ? HALF : totalCards >> 1;
  let isAnimating = false;
  let hasEntered = false;
  let direction = null;
  let prevVisible = new Set();
  let hoverCleanup = null;

  function getVisibleMap(center) {
    const map = new Map();
    if (!needsPagination) {
      cardElements.forEach((_, i) => map.set(i, i));
      return map;
    }
    for (let slot = 0; slot < MAX_VISIBLE; slot++) {
      map.set((((center + slot - HALF) % totalCards) + totalCards) % totalCards, slot);
    }
    return map;
  }

  function updateDots() {
    if (!dotsEl) return;
    Array.from(dotsEl.children).forEach((dot, i) => {
      dot.classList.toggle('is-active', i === centerIndex);
    });
  }

  function setupHover(visibleMap, config) {
    if (hoverCleanup) hoverCleanup();
    if (reduceMotion) return;

    const visibleEntries = [];
    cardElements.forEach((el, i) => {
      const slot = visibleMap.get(i);
      if (slot !== undefined) visibleEntries.push({ el, slot });
    });
    visibleEntries.sort((a, b) => a.slot - b.slot);

    let activeSlot = null;
    let leaveTimer = null;
    const centerSlot = visibleEntries.length >> 1;

    function updateHoverLayout(hoveredSlot) {
      const mult = getResponsiveMultiplier(window.innerWidth);
      const hM = getHeightMultiplier(window.innerWidth);

      visibleEntries.forEach(({ el, slot }) => {
        const base = config(slot);
        let targetX = base.x * mult;
        let targetY = base.y * hM;
        let targetRot = base.rot;
        let targetScale = base.scale;
        let delay = 0;

        if (hoveredSlot !== null) {
          const distance = Math.abs(slot - hoveredSlot);
          delay = distance * 0.02;

          if (slot === hoveredSlot) {
            targetY -= 2.5 * hM;
            targetScale *= 1.08;
          } else {
            const normalized = centerSlot > 0 ? (slot - centerSlot) / centerSlot : 0;
            const pushStrength = 8 * (1 - Math.abs(normalized)) * (1 + 0.2 * Math.max(0, 3 - distance));

            if (slot < hoveredSlot) {
              targetX -= pushStrength * mult;
              targetRot -= 3 / (distance + 1);
            } else {
              targetX += pushStrength * mult;
              targetRot += 3 / (distance + 1);
            }

            if (slot === visibleEntries.length - 1 && hoveredSlot < centerSlot) targetY -= 1 * hM;
            if (slot === 0 && hoveredSlot > centerSlot) targetY -= 1 * hM;
          }
        } else {
          delay = Math.abs(slot - centerSlot) * 0.02;
        }

        gsap.to(el, {
          x: `${targetX}rem`,
          y: `${targetY}rem`,
          rotation: targetRot,
          scale: targetScale,
          duration: 0.5,
          delay,
          ease: 'elastic.out(1,.75)',
          overwrite: 'auto',
        });
        gsap.set(el, { zIndex: base.zIndex });
      });
    }

    const enterHandlers = visibleEntries.map(({ el, slot }) => {
      const handler = () => {
        if (isAnimating) return;
        if (leaveTimer) {
          clearTimeout(leaveTimer);
          leaveTimer = null;
        }
        if (activeSlot !== slot) {
          activeSlot = slot;
          updateHoverLayout(slot);
        }
      };
      el.addEventListener('mouseenter', handler);
      return { el, handler };
    });

    const onMouseLeave = () => {
      if (isAnimating) return;
      if (leaveTimer) clearTimeout(leaveTimer);
      leaveTimer = setTimeout(() => {
        activeSlot = null;
        updateHoverLayout(null);
      }, 50);
    };
    container.addEventListener('mouseleave', onMouseLeave);

    const onResize = () => {
      if (!isAnimating) updateHoverLayout(activeSlot);
    };
    window.addEventListener('resize', onResize);

    hoverCleanup = () => {
      enterHandlers.forEach(({ el, handler }) => el.removeEventListener('mouseenter', handler));
      container.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('resize', onResize);
      if (leaveTimer) clearTimeout(leaveTimer);
    };
  }

  function render() {
    const visibleMap = getVisibleMap(centerIndex);
    const previouslyVisible = prevVisible;
    const isFirstMount = !hasEntered;
    const multiplier = getResponsiveMultiplier(window.innerWidth);
    const hMult = getHeightMultiplier(window.innerWidth);
    const slotCount = needsPagination ? MAX_VISIBLE : totalCards;
    const config = (slot) => getSlotConfig(slotCount, slot);

    if (isFirstMount) isAnimating = true;

    let completedCount = 0;
    const visibleCount = visibleMap.size;
    const onCardDone = () => {
      completedCount += 1;
      if (completedCount >= visibleCount) {
        isAnimating = false;
        if (isFirstMount) hasEntered = true;
      }
    };

    cardElements.forEach((card, cardIndex) => {
      const slot = visibleMap.get(cardIndex);
      const wasVisible = previouslyVisible.has(cardIndex);

      if (slot !== undefined) {
        const { x, y, rot, scale, zIndex } = config(slot);
        const target = {
          x: `${x * multiplier}rem`,
          y: `${y * hMult}rem`,
          rotation: rot,
          scale,
          opacity: 1,
          zIndex,
        };

        if (reduceMotion) {
          gsap.set(card, target);
          onCardDone();
        } else if (isFirstMount) {
          gsap.set(card, { x: 0, y: `${12 * hMult}rem`, rotation: 0, scale: 0.5, opacity: 0 });
          gsap.to(card, { ...target, duration: 1.2, ease: 'elastic.out(1.05,.78)', delay: 0.2 + slot * 0.06, onComplete: onCardDone });
        } else if (!wasVisible) {
          const enterX = direction === 'right' ? 40 : -40;
          gsap.set(card, { x: `${enterX}rem`, y: `${y * hMult}rem`, rotation: direction === 'right' ? 30 : -30, scale: 0.5, opacity: 0 });
          gsap.to(card, { ...target, duration: 0.6, ease: 'power2.out', onComplete: onCardDone });
        } else {
          gsap.to(card, { ...target, duration: 0.5, ease: 'power2.out', onComplete: onCardDone });
        }
      } else if (wasVisible) {
        const exitX = direction === 'right' ? -40 : 40;
        gsap.to(card, { x: `${exitX}rem`, opacity: 0, scale: 0.5, rotation: direction === 'right' ? -30 : 30, duration: 0.4, ease: 'power2.in', zIndex: 0 });
      } else if (isFirstMount) {
        gsap.set(card, { opacity: 0, scale: 0.3, x: 0, y: 0, zIndex: 0 });
      }
    });

    prevVisible = new Set(visibleMap.keys());
    updateDots();
    setupHover(visibleMap, config);
  }

  function cycle(dir) {
    if (isAnimating || !needsPagination) return;
    isAnimating = true;
    direction = dir;
    centerIndex = dir === 'right' ? (centerIndex + 1) % totalCards : (centerIndex - 1 + totalCards) % totalCards;
    render();
  }

  if (prevBtn) prevBtn.addEventListener('click', () => cycle('left'));
  if (nextBtn) nextBtn.addEventListener('click', () => cycle('right'));

  render();
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

// ---------- 통계 숫자 카운트업 애니메이션 ----------
// 스크롤로 화면에 들어올 때, 낮은 숫자에서 실제 값까지 빠르게 올라가며 표시합니다.
function initCountUp() {
  const targets = document.querySelectorAll('.stat-tile__value[data-count-to]');
  if (!targets.length) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function format(value, suffix) {
    return `${Math.round(value).toLocaleString('ko-KR')}${suffix}`;
  }

  function animate(el) {
    const to = Number(el.dataset.countTo);
    const suffix = el.dataset.countSuffix || '';
    if (reduceMotion || Number.isNaN(to)) {
      el.textContent = format(to, suffix);
      return;
    }

    const duration = 1100;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic: 처음엔 빠르게, 끝에서 서서히
      el.textContent = format(to * eased, suffix);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  if (!('IntersectionObserver' in window)) {
    targets.forEach(animate);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animate(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.4 }
  );

  targets.forEach((el) => observer.observe(el));
}

// ---------- 차트 (Chart.js) ----------
// 3월/4월 매출은 계탉닭 본점의 실제 일별 매출 데이터입니다 (2026.03 / 2026.04).
// CDN 로딩이 늦어질 수 있으므로, Chart가 아직 없으면 잠시 후 다시 시도합니다.
function initCharts(retriesLeft = 10) {
  if (typeof Chart === 'undefined') {
    if (retriesLeft <= 0) {
      console.error('[계탉닭] Chart.js를 불러오지 못해 매출/관광객 차트를 표시할 수 없습니다.');
      return;
    }
    setTimeout(() => initCharts(retriesLeft - 1), 300);
    return;
  }

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

  // 스크롤로 화면에 들어올 때 막대가 아래에서 위로 자라나는 효과가 보이도록,
  // 차트는 페이지 로드 시 바로 그리지 않고 각 캔버스가 실제로 보일 때 생성합니다.
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const chartJobs = [
    { id: 'revenueChartMarch', render: () => renderDailyRevenueChart('revenueChartMarch', marchDaily, marchTop3, reduceMotion) },
    { id: 'revenueChartApril', render: () => renderDailyRevenueChart('revenueChartApril', aprilDaily, aprilTop3, reduceMotion) },
    { id: 'touristChart', render: () => renderTouristChart(reduceMotion) },
  ];

  if (!('IntersectionObserver' in window)) {
    chartJobs.forEach((job) => job.render());
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const job = chartJobs.find((j) => j.id === entry.target.id);
        if (job) {
          job.render();
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
  );

  chartJobs.forEach((job) => {
    const el = document.getElementById(job.id);
    if (el) observer.observe(el);
  });
}

function renderDailyRevenueChart(canvasId, dailyWon, top3Indexes, reduceMotion) {
  const el = document.getElementById(canvasId);
  if (!el) return;

  const values = dailyWon.map((won) => Math.round(won / 1000)); // 천원 단위
  const colors = dailyWon.map((_, i) => (top3Indexes.includes(i) ? '#d32f2f' : '#d8c39a'));

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
    options: chartBaseOptions(reduceMotion),
  });
}

function renderTouristChart(reduceMotion) {
  const touristEl = document.getElementById('touristChart');
  if (!touristEl) return;

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
    options: chartBaseOptions(reduceMotion),
  });
}

function chartBaseOptions(reduceMotion) {
  return {
    responsive: true,
    animation: reduceMotion ? false : { duration: 1500, easing: 'easeOutQuart' },
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
