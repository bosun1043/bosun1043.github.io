// 전역 변수
let selectedStocks = [];
let currentStrategy = null;

// 페이지 로드 시 실행
window.onload = function() {
    console.log('페이지 로드 완료');
    loadTop10Stocks();
};

// 섹션 표시 함수
function showSection(sectionId) {
    console.log('섹션 표시:', sectionId);
    
    // 모든 섹션 숨기기
    const sections = document.querySelectorAll('.section');
    sections.forEach(function(section) {
        section.classList.remove('active');
    });
    
    // 모든 네비게이션 링크 비활성화
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(function(link) {
        link.classList.remove('active');
    });
    
    // 선택된 섹션 보이기
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        console.log('섹션 활성화 완료:', sectionId);
        
        // For Jun 섹션으로 이동할 때 퀀트 시스템 초기화
        if (sectionId === 'for-jun') {
            initQuantSystem();
        }
    }
    
    // 네비게이션 링크 활성화
    const activeLink = document.querySelector(`[onclick="showSection('${sectionId}')"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

// 퀀트 시스템 초기화
function initQuantSystem() {
    console.log('퀀트 시스템 초기화');
    showStep('welcome');
}

// 단계 표시 함수
function showStep(stepId) {
    console.log('단계 표시:', stepId);
    
    // 모든 step 숨기기
    const steps = document.querySelectorAll('.step');
    steps.forEach(function(step) {
        step.classList.remove('active');
    });
    
    // 선택한 step 보이기
    const targetStep = document.getElementById(stepId);
    if (targetStep) {
        targetStep.classList.add('active');
        console.log('단계 활성화 완료:', stepId);
    }
}

// 퀀트 시스템 버튼 함수들
function startQuant() {
    console.log('시작하기 버튼 클릭');
    showStep('stock-selection');
}

function goToWelcome() {
    console.log('welcome으로 돌아가기');
    showStep('welcome');
}

function goToStocks() {
    console.log('stocks로 돌아가기');
    showStep('stock-selection');
}

function goToStrategy() {
    console.log('strategy로 이동');
    showStep('strategy-selection');
}

function goToParameter() {
    console.log('parameter로 이동');
    showStep('parameter-setting');
}

function runStrategy() {
    console.log('전략 실행');
    showStep('results');
}

function restart() {
    console.log('다시 시작하기');
    showStep('welcome');
}

// 종목 데이터 로드
function loadTop10Stocks() {
    console.log('종목 데이터 로드 시작');
    
    const stocks = [
        { symbol: '005930', name: '삼성전자', price: 73800, change: 1.2, roe: 10.2, margin: 15.3 },
        { symbol: '000660', name: 'SK하이닉스', price: 142000, change: -0.7, roe: 12.1, margin: 13.2 },
        { symbol: '005935', name: 'LG에너지솔루션', price: 128000, change: 2.1, roe: 8.9, margin: 10.1 },
        { symbol: '035420', name: 'NAVER', price: 205000, change: 0.5, roe: 16.7, margin: 18.0 },
        { symbol: '035720', name: '카카오', price: 85000, change: -1.2, roe: 6.2, margin: 7.5 },
        { symbol: '005830', name: '현대차', price: 142000, change: 0.8, roe: 10.8, margin: 12.0 },
        { symbol: '000270', name: '기아', price: 168000, change: 1.5, roe: 11.5, margin: 12.5 },
        { symbol: '000890', name: 'POSCO홀딩스', price: 98000, change: -0.3, roe: 7.4, margin: 8.0 },
        { symbol: '000810', name: 'KB금융', price: 112000, change: 0.9, roe: 8.1, margin: 9.0 },
        { symbol: '000240', name: '신한지주', price: 105000, change: 0.4, roe: 7.8, margin: 8.5 }
    ];
    
    updateStockList(stocks);
}

// 종목 목록 업데이트
function updateStockList(stocks) {
    const stockList = document.querySelector('.stock-list');
    if (!stockList) {
        console.warn('종목 목록 컨테이너를 찾을 수 없음');
        return;
    }

    stockList.innerHTML = stocks.map(function(stock) {
        return `
        <div class="stock-item">
            <input type="checkbox" 
                   class="stock-checkbox" 
                   id="stock-${stock.symbol}" 
                   value="${stock.symbol}"
                   data-name="${stock.name}"
                   data-price="${stock.price}"
                   data-roe="${stock.roe}"
                   data-margin="${stock.margin}">
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
        `;
    }).join('');
    
    console.log('종목 목록 업데이트 완료');
}

console.log('main.js 로드 완료');