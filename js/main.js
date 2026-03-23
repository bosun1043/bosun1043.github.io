// =====================
// main.js (clean + tabs + hash sync + strategy/quiz handlers)
// =====================

// 전역 상태
let selectedStocks = [];
let currentStrategy = null;

// ---------------------
// 섹션 표시 (탭 라우팅)
// ---------------------
function showSection(sectionId) {
  // 모든 섹션 숨김
  document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));

  // 대상 섹션 보임
  const target = document.getElementById(sectionId);
  if (target) {
    target.classList.add('active');
  }

  // 네비 active
  document.querySelectorAll('.nav-link').forEach(a => a.classList.remove('active'));
  const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
  if (activeLink) activeLink.classList.add('active');

  // 해시 동기화 (스크롤 점프 방지 위해 replaceState)
  if (location.hash !== `#${sectionId}`) {
    history.replaceState(null, '', `#${sectionId}`);
  }
}

// 브라우저 뒤/앞 이동 대응
window.addEventListener('hashchange', () => {
  const id = (location.hash || '#home').slice(1);
  showSection(id);
});

// ---------------------
// 초기화
// ---------------------
window.addEventListener('DOMContentLoaded', () => {
  // 종목 데이터 로드
  loadTop10Stocks();

  // 초기 섹션
  const initial = (location.hash || '#home').slice(1);
  showSection(initial);

  // 네비 링크 클릭 가로채기
  document.querySelectorAll('.nav-link').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href') || '';
      if (href.startsWith('#')) {
        e.preventDefault();
        showSection(href.slice(1));
      }
    });
  });

  // ===== 전략 카드 클릭 선택 =====
  const strategyCards = document.querySelectorAll('.strategy-card');
  strategyCards.forEach(card => {
    card.addEventListener('click', () => {
      strategyCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      currentStrategy = card.dataset.strategy || null;
      console.log('[strategy] selected:', currentStrategy);
    });
  });

  // ===== "다음(파라미터)" 버튼 가드 =====
  const toParamBtn = document.getElementById('to-parameter-button');
  if (toParamBtn) {
    toParamBtn.addEventListener('click', (e) => {
      if (!currentStrategy) {
        e.preventDefault();
        alert('전략을 먼저 선택해주세요.');
        return;
      }
      goToParameter();
    });
  }

  // ===== For Fun: 해설 토글 =====
  document.querySelectorAll('[data-toggle="solution"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const sel = btn.getAttribute('data-target');
      const panel = document.querySelector(sel);
      if (panel) {
        panel.classList.toggle('hidden');
      }
    });
  });

  // ===== For Fun: 자릿수 합 19 정답 체크 (정답 30492) =====
  const q2Btn = document.getElementById('q2-check');
  if (q2Btn) {
    q2Btn.addEventListener('click', () => {
      const input = document.getElementById('q2-input');
      const fb = document.getElementById('q2-feedback');
      if (!input || !fb) return;
      const val = Number(input.value);
      if (Number.isNaN(val)) return;
      if (val === 30492) {
        fb.textContent = '정답입니다! 🎉';
        fb.className = 'quiz-feedback ok';
      } else {
        fb.textContent = '아쉽어요! 다시 시도해보세요.';
        fb.className = 'quiz-feedback no';
      }
    });
  }
});

function showStep(stepId) {
  const steps = document.querySelectorAll('#quant-panel .step');
  steps.forEach(s => s.classList.remove('active'));
  const el = document.getElementById(stepId);
  if (el) el.classList.add('active');
}



function startQuant() { showStep('stock-selection'); }
function goToWelcome() { showStep('welcome'); }
function goToStocks() { showStep('stock-selection'); }
function goToStrategy() {
  updateSelectedStocksPreview();
  showStep('strategy-selection');
}
function goToParameter() { showStep('parameter-setting'); }
function runStrategy() { showStep('results'); }
function restart() { showStep('welcome'); }

// ---------------------
// 종목 데이터 / 렌더링
// ---------------------
function loadTop10Stocks() {
  const stocks = [
    { symbol: '005930', name: '삼성전자',       price:  73800, change:  1.2, roe: 10.2, margin: 15.3 },
    { symbol: '000660', name: 'SK하이닉스',     price: 142000, change: -0.7, roe: 12.1, margin: 13.2 },
    { symbol: '005935', name: 'LG에너지솔루션',  price: 128000, change:  2.1, roe:  8.9, margin: 10.1 },
    { symbol: '035420', name: 'NAVER',         price: 205000, change:  0.5, roe: 16.7, margin: 18.0 },
    { symbol: '035720', name: '카카오',          price:  85000, change: -1.2, roe:  6.2, margin:  7.5 },
    { symbol: '005830', name: '현대차',          price: 142000, change:  0.8, roe: 10.8, margin: 12.0 },
    { symbol: '000270', name: '기아',            price: 168000, change:  1.5, roe: 11.5, margin: 12.5 },
    { symbol: '000890', name: 'POSCO홀딩스',      price:  98000, change: -0.3, roe:  7.4, margin:  8.0 },
    { symbol: '000810', name: 'KB금융',          price: 112000, change:  0.9, roe:  8.1, margin:  9.0 },
    { symbol: '000240', name: '신한지주',         price: 105000, change:  0.4, roe:  7.8, margin:  8.5 }
  ];
  updateStockList(stocks);
}

function updateStockList(stocks) {
  const el = document.querySelector('.stock-list');
  if (!el) return;

  el.innerHTML = stocks.map(stock => `
    <div class="stock-item">
      <input
        type="checkbox"
        class="stock-checkbox"
        id="stock-${stock.symbol}"
        value="${stock.symbol}"
        data-name="${stock.name}"
        data-price="${stock.price}"
        data-roe="${stock.roe}"
        data-margin="${stock.margin}"
      >
      <label for="stock-${stock.symbol}">
        <div class="stock-info">
          <div class="stock-name">${stock.name} (${stock.symbol})</div>
          <div class="stock-details">
            <span class="price">${stock.price.toLocaleString()}원</span>
            <span class="change ${stock.change >= 0 ? 'up' : 'down'}">
              ${stock.change >= 0 ? '+' : ''}${stock.change}%
            </span>
            <span class="financial-info">ROE: ${stock.roe}%, 마진: ${stock.margin}%</span>
          </div>
        </div>
      </label>
    </div>
  `).join('');
}

// 선택된 종목 미리보기
function updateSelectedStocksPreview() {
  const selected = Array.from(document.querySelectorAll('.stock-checkbox:checked'));
  const box = document.getElementById('selected-stocks-list');
  if (!box) return;

  if (selected.length === 0) {
    box.innerHTML = '<em>선택된 종목이 없습니다.</em>';
    return;
  }

  box.innerHTML = selected.map(cb => {
    const name = cb.dataset.name;
    const sym = cb.value;
    const price = Number(cb.dataset.price).toLocaleString();
    return `<div>${name} (${sym}) — ${price}원</div>`;
  }).join('');
}
