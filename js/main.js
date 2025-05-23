// 전역 변수
let charts = {};
let currentPortfolio = {};
let marketData = {};

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupTradingViewWidget();
    loadMarketData();
    initializeCharts();
});

function initializeApp() {
    setupEventListeners();
    setupDateInputs();
    loadPortfolioData();
}

function setupEventListeners() {
    // 네비게이션 이벤트
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', handleNavigation);
    });

    // 전략 선택 이벤트
    document.getElementById('strategy-select').addEventListener('change', updateBacktestChart);
}

function setupDateInputs() {
    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);

    document.getElementById('start-date').value = oneYearAgo.toISOString().split('T')[0];
    document.getElementById('end-date').value = today.toISOString().split('T')[0];
}

function setupTradingViewWidget() {
    new TradingView.widget({
        "width": "100%",
        "height": 500,
        "symbol": "KRX:KOSPI",
        "interval": "D",
        "timezone": "Asia/Seoul",
        "theme": "light",
        "style": "1",
        "locale": "kr",
        "toolbar_bg": "#f1f3f6",
        "enable_publishing": false,
        "allow_symbol_change": true,
        "container_id": "tradingview-widget"
    });
}

async function loadMarketData() {
    try {
        // 실제 API 연동 시 여기에 API 호출 코드 추가
        const mockData = {
            kospi: "2,500.00",
            kosdaq: "850.00",
            usdkrw: "1,350.00"
        };

        document.getElementById('kospi-value').textContent = mockData.kospi;
        document.getElementById('kosdaq-value').textContent = mockData.kosdaq;
        document.getElementById('exchange-rate').textContent = mockData.usdkrw;
    } catch (error) {
        console.error('시장 데이터 로딩 실패:', error);
    }
}

function initializeCharts() {
    // 모멘텀 전략 차트
    charts.momentum = new Chart(document.getElementById('momentum-chart'), {
        type: 'line',
        data: {
            labels: ['1월', '2월', '3월', '4월', '5월', '6월'],
            datasets: [{
                label: '수익률',
                data: [0, 5, 8, 12, 15, 18],
                borderColor: '#3498db',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    // 밸류 전략 차트
    charts.value = new Chart(document.getElementById('value-chart'), {
        type: 'line',
        data: {
            labels: ['1월', '2월', '3월', '4월', '5월', '6월'],
            datasets: [{
                label: '수익률',
                data: [0, 3, 6, 9, 12, 15],
                borderColor: '#2ecc71',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    // 퀄리티 전략 차트
    charts.quality = new Chart(document.getElementById('quality-chart'), {
        type: 'line',
        data: {
            labels: ['1월', '2월', '3월', '4월', '5월', '6월'],
            datasets: [{
                label: '수익률',
                data: [0, 4, 7, 10, 13, 16],
                borderColor: '#e74c3c',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

function runStrategy(strategyType) {
    // 전략 실행 로직
    console.log(`${strategyType} 전략 실행`);
    // 실제 구현 시 API 호출 및 데이터 처리 로직 추가
}

function runBacktest() {
    const strategy = document.getElementById('strategy-select').value;
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;

    // 백테스트 실행 로직
    console.log(`백테스트 실행: ${strategy}, ${startDate} ~ ${endDate}`);
    // 실제 구현 시 API 호출 및 데이터 처리 로직 추가

    // 임시 결과 표시
    document.getElementById('return-rate').textContent = '+15.3%';
    document.getElementById('sharpe-ratio').textContent = '1.2';
    document.getElementById('max-drawdown').textContent = '-8.5%';
}

function updateBacktestChart() {
    const strategy = document.getElementById('strategy-select').value;
    // 차트 업데이트 로직
    console.log(`백테스트 차트 업데이트: ${strategy}`);
}

function loadPortfolioData() {
    // 포트폴리오 데이터 로딩
    const mockPortfolio = {
        totalAssets: '100,000,000',
        dailyReturn: '+1.2%',
        annualReturn: '+15.5%',
        holdings: [
            { name: '삼성전자', quantity: 100, avgPrice: '70,000', currentPrice: '72,000', profit: '+200,000' },
            { name: 'SK하이닉스', quantity: 50, avgPrice: '120,000', currentPrice: '125,000', profit: '+250,000' }
        ]
    };

    // 포트폴리오 데이터 표시
    document.getElementById('total-assets').textContent = mockPortfolio.totalAssets;
    document.getElementById('daily-return').textContent = mockPortfolio.dailyReturn;
    document.getElementById('annual-return').textContent = mockPortfolio.annualReturn;

    // 보유 종목 테이블 업데이트
    const tbody = document.querySelector('#holdings-table tbody');
    tbody.innerHTML = '';
    mockPortfolio.holdings.forEach(holding => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${holding.name}</td>
            <td>${holding.quantity}</td>
            <td>${holding.avgPrice}</td>
            <td>${holding.currentPrice}</td>
            <td>${holding.profit}</td>
        `;
        tbody.appendChild(row);
    });
}

function handleNavigation(e) {
    e.preventDefault();
    const targetId = e.target.getAttribute('href').substring(1);
    const targetSection = document.getElementById(targetId);
    targetSection.scrollIntoView({ behavior: 'smooth' });
} 