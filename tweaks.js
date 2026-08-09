// ==========================================================================
// 디자인 트윅 패널 — 색상/여백 CSS 변수를 화면에서 실시간으로 조절해보는
// 미리보기 전용 도구입니다. 실제 방문자에게는 절대 노출되지 않고,
// index.html?tweaks=1 로 한 번 접속했을 때만 활성화되며 이후 이 브라우저에
// localStorage로 기억됩니다. styles.css에는 아무것도 추가하지 않고
// 패널 자체 스타일은 이 파일에서 <style>로 주입합니다.
// ==========================================================================
(function () {
  const STORAGE_ENABLED = 'gyetakdak-tweaks-enabled';
  const STORAGE_VALUES = 'gyetakdak-tweaks-values';

  const params = new URLSearchParams(location.search);
  if (params.get('tweaks') === '1') {
    localStorage.setItem(STORAGE_ENABLED, '1');
  }
  if (params.get('tweaks') === '0') {
    localStorage.removeItem(STORAGE_ENABLED);
  }
  const enabled = localStorage.getItem(STORAGE_ENABLED) === '1';
  if (!enabled) return;

  const root = document.documentElement;

  // ---------- 색상 <-> HSL 변환 유틸 ----------
  function hexToHsl(hex) {
    const m = hex.trim().replace('#', '');
    const full = m.length === 3 ? m.split('').map((c) => c + c).join('') : m;
    const r = parseInt(full.slice(0, 2), 16) / 255;
    const g = parseInt(full.slice(2, 4), 16) / 255;
    const b = parseInt(full.slice(4, 6), 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;
    const d = max - min;
    if (d !== 0) {
      s = d / (1 - Math.abs(2 * l - 1));
      switch (max) {
        case r: h = 60 * (((g - b) / d) % 6); break;
        case g: h = 60 * ((b - r) / d + 2); break;
        case b: h = 60 * ((r - g) / d + 4); break;
      }
    }
    if (h < 0) h += 360;
    return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
  }
  function hslToHex(h, s, l) {
    s /= 100; l /= 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;
    if (h < 60) [r, g, b] = [c, x, 0];
    else if (h < 120) [r, g, b] = [x, c, 0];
    else if (h < 180) [r, g, b] = [0, c, x];
    else if (h < 240) [r, g, b] = [0, x, c];
    else if (h < 300) [r, g, b] = [x, 0, c];
    else [r, g, b] = [c, 0, x];
    const toHex = (v) => Math.round((v + m) * 255).toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }
  function resolveToHex(cssValue) {
    // rgb(a) 문자열이든 hex든 캔버스 컨텍스트를 빌려 표준 rgb 문자열로 정규화
    const probe = document.createElement('canvas').getContext('2d');
    probe.fillStyle = cssValue.trim();
    const normalized = probe.fillStyle; // '#rrggbb' 형태로 반환됨
    return normalized.startsWith('#') ? normalized : cssValue.trim();
  }

  // ---------- 조절 대상 변수 정의 ----------
  const COLOR_CONTROLS = [
    { key: '--bg', label: '전체 배경' },
    { key: '--light-beige', label: '라이트 섹션 배경' },
    { key: '--deep-green', label: '다크 그린 섹션' },
    { key: '--pumpkin', label: '성공사례 섹션(주황)' },
    { key: '--red', label: '레드 포인트' },
    { key: '--gold', label: '골드 포인트' },
    { key: '--text', label: '본문 텍스트' },
  ];
  const SPACING_CONTROLS = [
    { key: '--container', label: '콘텐츠 최대 너비', unit: 'px', min: 900, max: 1400, step: 10 },
    { key: '--section-padding-y', label: '섹션 상하 여백', unit: 'px', min: 40, max: 160, step: 4 },
    { key: '--radius', label: '카드 모서리 둥글기', unit: 'px', min: 0, max: 32, step: 1 },
  ];

  const defaults = {}; // 페이지 최초 로드시 계산값(리셋 기준)
  const current = {}; // 현재 값(문자열, CSS에 그대로 대입 가능한 값)

  [...COLOR_CONTROLS, ...SPACING_CONTROLS].forEach(({ key }) => {
    defaults[key] = getComputedStyle(root).getPropertyValue(key).trim();
  });

  // ---------- 저장된 값 복원 ----------
  let saved = {};
  try {
    saved = JSON.parse(localStorage.getItem(STORAGE_VALUES) || '{}');
  } catch (e) {
    saved = {};
  }
  [...COLOR_CONTROLS, ...SPACING_CONTROLS].forEach(({ key }) => {
    current[key] = saved[key] || defaults[key];
    if (saved[key]) root.style.setProperty(key, saved[key]);
  });

  function persist() {
    localStorage.setItem(STORAGE_VALUES, JSON.stringify(current));
  }
  function applyVar(key, value) {
    current[key] = value;
    root.style.setProperty(key, value);
    persist();
  }

  // ---------- 패널 전용 스타일 주입 ----------
  const style = document.createElement('style');
  style.textContent = `
    #tweaksToggle {
      position: fixed; left: 20px; bottom: 20px; z-index: 99998;
      width: 46px; height: 46px; border-radius: 50%;
      background: #1f2937; color: #fff; border: none; cursor: pointer;
      font-size: 1.2rem; display: flex; align-items: center; justify-content: center;
      box-shadow: 0 6px 18px rgba(0,0,0,0.35);
    }
    #tweaksPanel {
      position: fixed; left: 20px; bottom: 76px; z-index: 99999;
      width: min(320px, calc(100vw - 40px));
      max-height: min(78vh, 640px);
      overflow-y: auto;
      background: #1a1d24; color: #e8e8ec;
      border-radius: 16px; padding: 16px;
      box-shadow: 0 20px 50px rgba(0,0,0,0.45);
      font: 13px/1.4 -apple-system, BlinkMacSystemFont, 'Malgun Gothic', sans-serif;
      display: none;
    }
    #tweaksPanel.is-open { display: block; }
    #tweaksPanel h4 {
      margin: 16px 0 8px; font-size: 11px; letter-spacing: 0.06em;
      text-transform: uppercase; color: #9ca3af;
    }
    #tweaksPanel h4:first-of-type { margin-top: 0; }
    .tw-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px; }
    .tw-head strong { font-size: 13px; }
    .tw-close { background: none; border: none; color: #9ca3af; font-size: 16px; cursor: pointer; line-height: 1; padding: 4px; }
    .tw-row { margin-bottom: 12px; }
    .tw-row-label { display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px; }
    .tw-row-label span:first-child { color: #d1d5db; }
    .tw-swatch { display: inline-block; width: 14px; height: 14px; border-radius: 4px; vertical-align: -2px; margin-right: 6px; border: 1px solid rgba(255,255,255,0.2); }
    .tw-value { color: #9ca3af; font-variant-numeric: tabular-nums; font-size: 11px; }
    .tw-hsl { display: flex; align-items: center; gap: 6px; margin-bottom: 3px; }
    .tw-hsl label { width: 14px; color: #6b7280; font-size: 10px; }
    .tw-hsl input[type="range"] { flex: 1; }
    #tweaksPanel input[type="range"] {
      width: 100%; accent-color: #34d399; cursor: pointer;
    }
    .tw-actions { display: flex; gap: 8px; margin-top: 16px; }
    .tw-btn {
      flex: 1; background: #2d3340; color: #e8e8ec; border: 1px solid #3f4657;
      border-radius: 8px; padding: 8px 10px; font-size: 12px; cursor: pointer;
    }
    .tw-btn:hover { background: #363d4d; }
    .tw-btn--primary { background: #059669; border-color: #059669; }
    .tw-btn--primary:hover { background: #047857; }
    .tw-toast {
      margin-top: 8px; font-size: 11px; color: #6ee7b7; text-align: center;
      opacity: 0; transition: opacity 0.2s ease;
    }
    .tw-toast.is-visible { opacity: 1; }
  `;
  document.head.appendChild(style);

  // ---------- 패널 DOM 생성 ----------
  const toggle = document.createElement('button');
  toggle.id = 'tweaksToggle';
  toggle.type = 'button';
  toggle.setAttribute('aria-label', '디자인 트윅 패널 열기');
  toggle.textContent = '🎛';
  document.body.appendChild(toggle);

  const panel = document.createElement('div');
  panel.id = 'tweaksPanel';
  document.body.appendChild(panel);

  function colorRowHtml(ctrl) {
    const hsl = hexToHsl(resolveToHex(current[ctrl.key]));
    return `
      <div class="tw-row" data-key="${ctrl.key}" data-kind="color">
        <div class="tw-row-label">
          <span><span class="tw-swatch" style="background:${resolveToHex(current[ctrl.key])}"></span>${ctrl.label}</span>
          <span class="tw-value">${resolveToHex(current[ctrl.key])}</span>
        </div>
        <div class="tw-hsl"><label>H</label><input type="range" min="0" max="360" step="1" value="${hsl.h}" data-axis="h" /></div>
        <div class="tw-hsl"><label>S</label><input type="range" min="0" max="100" step="1" value="${hsl.s}" data-axis="s" /></div>
        <div class="tw-hsl"><label>L</label><input type="range" min="0" max="100" step="1" value="${hsl.l}" data-axis="l" /></div>
      </div>`;
  }
  function spacingRowHtml(ctrl) {
    const num = parseFloat(current[ctrl.key]) || ctrl.min;
    return `
      <div class="tw-row" data-key="${ctrl.key}" data-kind="spacing">
        <div class="tw-row-label">
          <span>${ctrl.label}</span>
          <span class="tw-value">${num}${ctrl.unit}</span>
        </div>
        <input type="range" min="${ctrl.min}" max="${ctrl.max}" step="${ctrl.step}" value="${num}" />
      </div>`;
  }

  function render() {
    panel.innerHTML = `
      <div class="tw-head">
        <strong>🎛 디자인 트윅</strong>
        <button type="button" class="tw-close" aria-label="닫기">×</button>
      </div>
      <h4>색상</h4>
      ${COLOR_CONTROLS.map(colorRowHtml).join('')}
      <h4>여백 &amp; 형태</h4>
      ${SPACING_CONTROLS.map(spacingRowHtml).join('')}
      <div class="tw-actions">
        <button type="button" class="tw-btn" id="twReset">초기값으로</button>
        <button type="button" class="tw-btn tw-btn--primary" id="twCopy">CSS 복사</button>
      </div>
      <div class="tw-actions">
        <button type="button" class="tw-btn" id="twOff">패널 완전히 끄기</button>
      </div>
      <p class="tw-toast" id="twToast"></p>
    `;
    bindEvents();
  }

  function bindEvents() {
    panel.querySelector('.tw-close').addEventListener('click', () => togglePanel(false));

    panel.querySelectorAll('.tw-row[data-kind="color"]').forEach((row) => {
      const key = row.dataset.key;
      const inputs = row.querySelectorAll('input[type="range"]');
      inputs.forEach((input) => {
        input.addEventListener('input', () => {
          const h = parseFloat(row.querySelector('[data-axis="h"]').value);
          const s = parseFloat(row.querySelector('[data-axis="s"]').value);
          const l = parseFloat(row.querySelector('[data-axis="l"]').value);
          const hex = hslToHex(h, s, l);
          applyVar(key, hex);
          row.querySelector('.tw-swatch').style.background = hex;
          row.querySelector('.tw-value').textContent = hex;
        });
      });
    });

    panel.querySelectorAll('.tw-row[data-kind="spacing"]').forEach((row) => {
      const key = row.dataset.key;
      const ctrl = SPACING_CONTROLS.find((c) => c.key === key);
      const input = row.querySelector('input[type="range"]');
      input.addEventListener('input', () => {
        const value = `${input.value}${ctrl.unit}`;
        applyVar(key, value);
        row.querySelector('.tw-value').textContent = value;
      });
    });

    panel.querySelector('#twReset').addEventListener('click', () => {
      [...COLOR_CONTROLS, ...SPACING_CONTROLS].forEach(({ key }) => {
        root.style.removeProperty(key);
        current[key] = defaults[key];
      });
      localStorage.removeItem(STORAGE_VALUES);
      render();
      showToast('초기값으로 되돌렸습니다');
    });

    panel.querySelector('#twCopy').addEventListener('click', async () => {
      const lines = [...COLOR_CONTROLS, ...SPACING_CONTROLS]
        .map(({ key }) => `  ${key}: ${current[key]};`)
        .join('\n');
      const css = `:root {\n${lines}\n}`;
      try {
        await navigator.clipboard.writeText(css);
        showToast('CSS가 클립보드에 복사되었습니다');
      } catch (e) {
        const ta = document.createElement('textarea');
        ta.value = css;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showToast('CSS가 클립보드에 복사되었습니다');
      }
    });

    panel.querySelector('#twOff').addEventListener('click', () => {
      localStorage.removeItem(STORAGE_ENABLED);
      localStorage.removeItem(STORAGE_VALUES);
      [...COLOR_CONTROLS, ...SPACING_CONTROLS].forEach(({ key }) => root.style.removeProperty(key));
      togglePanel(false);
      toggle.remove();
      panel.remove();
    });
  }

  let toastTimer = null;
  function showToast(msg) {
    const toast = panel.querySelector('#twToast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 1800);
  }

  function togglePanel(open) {
    panel.classList.toggle('is-open', open);
  }

  toggle.addEventListener('click', () => togglePanel(!panel.classList.contains('is-open')));

  render();
})();
