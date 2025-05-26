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
    // 전략 버튼 이벤트
    document.querySelectorAll('.strategy-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            const strategyType = button.getAttribute('data-strategy');
            runStrategy(strategyType);
        });
    });

    // 백테스트 버튼 이벤트
    const backtestBtn = document.getElementById('run-backtest-btn');
    if (backtestBtn) {
        backtestBtn.addEventListener('click', runBacktest);
    }
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

// 로딩 표시
function showLoading(message) {
    const loadingEl = document.getElementById('loading-indicator');
    if (loadingEl) {
        loadingEl.style.display = 'block';
        loadingEl.querySelector('p').textContent = message;
    }
}

// 로딩 숨기기
function hideLoading() {
    const loadingEl = document.getElementById('loading-indicator');
    if (loadingEl) {
        loadingEl.style.display = 'none';
    }
}

// 에러 표시
function showError(message) {
    const errorEl = document.getElementById('error-message');
    if (errorEl) {
        errorEl.style.display = 'block';
        errorEl.querySelector('p').textContent = message;
        
        setTimeout(() => {
            errorEl.style.display = 'none';
        }, 3000);
    }
}

// 임시 데이터 생성 (전략별로 다른 로직 적용)
function generateMockData(strategyType, params = {}) {
    const symbols = ['삼성전자', 'SK하이닉스', 'LG에너지솔루션', 'NAVER', '카카오', 
                    '현대차', '기아', 'POSCO홀딩스', 'KB금융', '신한지주'];
    
    let scores = [];
    
    if (strategyType === 'momentum') {
        // 모멘텀 전략: 기간별 수익률 기반 점수 계산
        scores = symbols.map(symbol => {
            const returns = Array.from({length: params.period || 12}, () => Math.random() * 20 - 5);
            const score = returns.reduce((acc, curr) => acc + curr, 0);
            return {
                symbol: symbol,
                score: score,
                details: {
                    period: params.period || 12,
                    returns: returns.map(r => r.toFixed(2))
                }
            };
        });
    } else if (strategyType === 'value') {
        // 밸류 전략: PER, PBR 기반 점수 계산
        scores = symbols.map(symbol => {
            const per = (Math.random() * 20 + 5).toFixed(2); // 5-25 PER
            const pbr = (Math.random() * 2 + 0.5).toFixed(2); // 0.5-2.5 PBR
            const score = (100 / parseFloat(per) * params.perWeight + 100 / parseFloat(pbr) * params.pbrWeight);
            return {
                symbol: symbol,
                score: score,
                details: {
                    per: per,
                    pbr: pbr
                }
            };
        });
    } else if (strategyType === 'quality') {
        // 퀄리티 전략: ROE와 영업이익률 기반 점수 계산
        scores = symbols.map(symbol => {
            const roe = Math.random() * 30; // 0-30% ROE
            const margin = Math.random() * 20; // 0-20% 영업이익률
            const score = (roe * params.roeWeight + margin * params.marginWeight);
            return {
                symbol: symbol,
                score: score,
                details: {
                    roe: roe.toFixed(2),
                    margin: margin.toFixed(2)
                }
            };
        });
    }
    
    return {
        selected_stocks: scores.sort((a, b) => b.score - a.score).slice(0, 5)
    };
}

// 전략 실행
function runStrategy(strategyType) {
    try {
        showLoading(`${strategyType} 전략을 실행 중입니다...`);
        
        // 전략별 파라미터 가져오기
        let params = {};
        if (strategyType === 'momentum') {
            const periodInput = document.getElementById('momentum-period');
            if (periodInput) {
                params.period = parseInt(periodInput.value) || 12;
            }
        } else if (strategyType === 'value') {
            const perWeightInput = document.getElementById('value-per-weight');
            const pbrWeightInput = document.getElementById('value-pbr-weight');
            if (perWeightInput && pbrWeightInput) {
                params.perWeight = parseFloat(perWeightInput.value) || 0.6;
                params.pbrWeight = parseFloat(pbrWeightInput.value) || 0.4;
            }
        } else if (strategyType === 'quality') {
            const roeWeightInput = document.getElementById('quality-roe-weight');
            const marginWeightInput = document.getElementById('quality-margin-weight');
            if (roeWeightInput && marginWeightInput) {
                params.roeWeight = parseFloat(roeWeightInput.value) || 0.5;
                params.marginWeight = parseFloat(marginWeightInput.value) || 0.5;
            }
        }
        
        // 실제 데이터를 사용한 전략 실행 (현재는 목업 데이터)
        setTimeout(() => {
            try {
                const mockData = generateMockData(strategyType, params);
                
                if (strategyType === 'momentum') {
                    showMomentumResults(mockData);
                } else if (strategyType === 'value') {
                    showValueResults(mockData);
                } else if (strategyType === 'quality') {
                    showQualityResults(mockData);
                }
            } catch (error) {
                console.error('전략 실행 중 오류 발생:', error);
                showError('전략 실행 중 오류가 발생했습니다.');
            } finally {
                hideLoading();
            }
        }, 1000);
    } catch (error) {
        console.error('전략 실행 초기화 중 오류 발생:', error);
        showError('전략 실행을 시작할 수 없습니다.');
        hideLoading();
    }
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

// 모멘텀 전략 결과를 새 창에 표시
function showMomentumResults(results) {
    try {
        // 새 창 생성
        const resultWindow = window.open('', '모멘텀 전략 결과', 'width=800,height=600');
        if (!resultWindow) {
            throw new Error('팝업이 차단되었습니다. 팝업 차단을 해제해주세요.');
        }
        
        // 새 창의 HTML 내용
        resultWindow.document.write(`
            <!DOCTYPE html>
            <html lang="ko">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>모멘텀 전략 결과</title>
                <style>
                    body {
                        font-family: 'Noto Sans KR', sans-serif;
                        margin: 0;
                        padding: 20px;
                        background-color: #f8f9fa;
                    }
                    .container {
                        max-width: 800px;
                        margin: 0 auto;
                        background-color: white;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    }
                    h1 {
                        color: #2c3e50;
                        margin-bottom: 20px;
                    }
                    .results-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                        gap: 20px;
                        margin-bottom: 20px;
                    }
                    .result-card {
                        background-color: #f8f9fa;
                        padding: 15px;
                        border-radius: 6px;
                        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                    }
                    .stock-item {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 10px;
                        background-color: white;
                        border-radius: 4px;
                        margin-bottom: 10px;
                        box-shadow: 0 1px 2px rgba(0,0,0,0.05);
                    }
                    .symbol {
                        font-weight: 500;
                        color: #2c3e50;
                    }
                    .score {
                        color: #3498db;
                        font-weight: 500;
                    }
                    .chart-container {
                        margin-top: 20px;
                        height: 300px;
                    }
                    .summary {
                        margin-top: 20px;
                        padding: 15px;
                        background-color: #e8f4f8;
                        border-radius: 6px;
                    }
                    .summary h3 {
                        color: #2c3e50;
                        margin-bottom: 10px;
                    }
                    .summary p {
                        margin: 5px 0;
                        color: #34495e;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>모멘텀 전략 결과</h1>
                    <div class="results-grid">
                        <div class="result-card">
                            <h3>선정 종목</h3>
                            ${results.selected_stocks.map(stock => `
                                <div class="stock-item">
                                    <span class="symbol">${stock.symbol}</span>
                                    <span class="score">${stock.score.toFixed(2)}</span>
                                </div>
                            `).join('')}
                        </div>
                        <div class="result-card">
                            <h3>전략 요약</h3>
                            <div class="summary">
                                <p>평균 모멘텀 점수: ${(results.selected_stocks.reduce((acc, curr) => acc + curr.score, 0) / results.selected_stocks.length).toFixed(2)}</p>
                                <p>최고 모멘텀 점수: ${Math.max(...results.selected_stocks.map(s => s.score)).toFixed(2)}</p>
                                <p>최저 모멘텀 점수: ${Math.min(...results.selected_stocks.map(s => s.score)).toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                    <div class="chart-container">
                        <canvas id="momentum-chart"></canvas>
                    </div>
                </div>
                <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
                <script>
                    // 차트 생성
                    const ctx = document.getElementById('momentum-chart').getContext('2d');
                    new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: ${JSON.stringify(results.selected_stocks.map(s => s.symbol))},
                            datasets: [{
                                label: '모멘텀 점수',
                                data: ${JSON.stringify(results.selected_stocks.map(s => s.score))},
                                backgroundColor: '#3498db'
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                title: {
                                    display: true,
                                    text: '선정 종목 모멘텀 점수'
                                }
                            }
                        }
                    });
                </script>
            </body>
            </html>
        `);
        
        resultWindow.document.close();
    } catch (error) {
        console.error('결과 창 표시 중 오류 발생:', error);
        showError(error.message || '결과를 표시할 수 없습니다.');
    }
}

// 밸류 전략 결과를 새 창에 표시
function showValueResults(results) {
    try {
        // 새 창 생성
        const resultWindow = window.open('', '밸류 전략 결과', 'width=800,height=600');
        if (!resultWindow) {
            throw new Error('팝업이 차단되었습니다. 팝업 차단을 해제해주세요.');
        }
        
        // 새 창의 HTML 내용
        resultWindow.document.write(`
            <!DOCTYPE html>
            <html lang="ko">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>밸류 전략 결과</title>
                <style>
                    body {
                        font-family: 'Noto Sans KR', sans-serif;
                        margin: 0;
                        padding: 20px;
                        background-color: #f8f9fa;
                    }
                    .container {
                        max-width: 800px;
                        margin: 0 auto;
                        background-color: white;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    }
                    h1 {
                        color: #2c3e50;
                        margin-bottom: 20px;
                    }
                    .results-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                        gap: 20px;
                        margin-bottom: 20px;
                    }
                    .result-card {
                        background-color: #f8f9fa;
                        padding: 15px;
                        border-radius: 6px;
                        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                    }
                    .stock-item {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 10px;
                        background-color: white;
                        border-radius: 4px;
                        margin-bottom: 10px;
                        box-shadow: 0 1px 2px rgba(0,0,0,0.05);
                    }
                    .symbol {
                        font-weight: 500;
                        color: #2c3e50;
                    }
                    .details {
                        display: flex;
                        gap: 1rem;
                        font-size: 0.9rem;
                    }
                    .score {
                        color: #2ecc71;
                        font-weight: 500;
                    }
                    .per, .pbr {
                        color: #666;
                    }
                    .chart-container {
                        margin-top: 20px;
                        height: 300px;
                    }
                    .summary {
                        margin-top: 20px;
                        padding: 15px;
                        background-color: #e8f4f8;
                        border-radius: 6px;
                    }
                    .summary h3 {
                        color: #2c3e50;
                        margin-bottom: 10px;
                    }
                    .summary p {
                        margin: 5px 0;
                        color: #34495e;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>밸류 전략 결과</h1>
                    <div class="results-grid">
                        <div class="result-card">
                            <h3>선정 종목</h3>
                            ${results.selected_stocks.map(stock => `
                                <div class="stock-item">
                                    <span class="symbol">${stock.symbol}</span>
                                    <div class="details">
                                        <span class="score">종합점수: ${stock.score.toFixed(2)}</span>
                                        <span class="per">PER: ${stock.details.per}</span>
                                        <span class="pbr">PBR: ${stock.details.pbr}</span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                        <div class="result-card">
                            <h3>전략 요약</h3>
                            <div class="summary">
                                <p>평균 밸류 점수: ${(results.selected_stocks.reduce((acc, curr) => acc + curr.score, 0) / results.selected_stocks.length).toFixed(2)}</p>
                                <p>최고 밸류 점수: ${Math.max(...results.selected_stocks.map(s => s.score)).toFixed(2)}</p>
                                <p>최저 밸류 점수: ${Math.min(...results.selected_stocks.map(s => s.score)).toFixed(2)}</p>
                                <p>평균 PER: ${(results.selected_stocks.reduce((acc, curr) => acc + parseFloat(curr.details.per), 0) / results.selected_stocks.length).toFixed(2)}</p>
                                <p>평균 PBR: ${(results.selected_stocks.reduce((acc, curr) => acc + parseFloat(curr.details.pbr), 0) / results.selected_stocks.length).toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                    <div class="chart-container">
                        <canvas id="value-chart"></canvas>
                    </div>
                </div>
                <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
                <script>
                    // 차트 생성
                    const ctx = document.getElementById('value-chart').getContext('2d');
                    new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: ${JSON.stringify(results.selected_stocks.map(s => s.symbol))},
                            datasets: [{
                                label: '밸류 점수',
                                data: ${JSON.stringify(results.selected_stocks.map(s => s.score))},
                                backgroundColor: '#2ecc71'
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                title: {
                                    display: true,
                                    text: '선정 종목 밸류 점수'
                                }
                            }
                        }
                    });
                </script>
            </body>
            </html>
        `);
        
        resultWindow.document.close();
    } catch (error) {
        console.error('결과 창 표시 중 오류 발생:', error);
        showError(error.message || '결과를 표시할 수 없습니다.');
    }
}

// 퀄리티 전략 결과를 새 창에 표시
function showQualityResults(results) {
    try {
        // 새 창 생성
        const resultWindow = window.open('', '퀄리티 전략 결과', 'width=800,height=600');
        if (!resultWindow) {
            throw new Error('팝업이 차단되었습니다. 팝업 차단을 해제해주세요.');
        }
        
        // 새 창의 HTML 내용
        resultWindow.document.write(`
            <!DOCTYPE html>
            <html lang="ko">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>퀄리티 전략 결과</title>
                <style>
                    body {
                        font-family: 'Noto Sans KR', sans-serif;
                        margin: 0;
                        padding: 20px;
                        background-color: #f8f9fa;
                    }
                    .container {
                        max-width: 800px;
                        margin: 0 auto;
                        background-color: white;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    }
                    h1 {
                        color: #2c3e50;
                        margin-bottom: 20px;
                    }
                    .results-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                        gap: 20px;
                        margin-bottom: 20px;
                    }
                    .result-card {
                        background-color: #f8f9fa;
                        padding: 15px;
                        border-radius: 6px;
                        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                    }
                    .stock-item {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 10px;
                        background-color: white;
                        border-radius: 4px;
                        margin-bottom: 10px;
                        box-shadow: 0 1px 2px rgba(0,0,0,0.05);
                    }
                    .symbol {
                        font-weight: 500;
                        color: #2c3e50;
                    }
                    .details {
                        display: flex;
                        gap: 1rem;
                        font-size: 0.9rem;
                    }
                    .score {
                        color: #e74c3c;
                        font-weight: 500;
                    }
                    .roe, .margin {
                        color: #666;
                    }
                    .chart-container {
                        margin-top: 20px;
                        height: 300px;
                    }
                    .summary {
                        margin-top: 20px;
                        padding: 15px;
                        background-color: #e8f4f8;
                        border-radius: 6px;
                    }
                    .summary h3 {
                        color: #2c3e50;
                        margin-bottom: 10px;
                    }
                    .summary p {
                        margin: 5px 0;
                        color: #34495e;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>퀄리티 전략 결과</h1>
                    <div class="results-grid">
                        <div class="result-card">
                            <h3>선정 종목</h3>
                            ${results.selected_stocks.map(stock => `
                                <div class="stock-item">
                                    <span class="symbol">${stock.symbol}</span>
                                    <div class="details">
                                        <span class="score">종합점수: ${stock.score.toFixed(2)}</span>
                                        <span class="roe">ROE: ${stock.details.roe}%</span>
                                        <span class="margin">영업이익률: ${stock.details.margin}%</span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                        <div class="result-card">
                            <h3>전략 요약</h3>
                            <div class="summary">
                                <p>평균 퀄리티 점수: ${(results.selected_stocks.reduce((acc, curr) => acc + curr.score, 0) / results.selected_stocks.length).toFixed(2)}</p>
                                <p>최고 퀄리티 점수: ${Math.max(...results.selected_stocks.map(s => s.score)).toFixed(2)}</p>
                                <p>최저 퀄리티 점수: ${Math.min(...results.selected_stocks.map(s => s.score)).toFixed(2)}</p>
                                <p>평균 ROE: ${(results.selected_stocks.reduce((acc, curr) => acc + parseFloat(curr.details.roe), 0) / results.selected_stocks.length).toFixed(2)}%</p>
                                <p>평균 영업이익률: ${(results.selected_stocks.reduce((acc, curr) => acc + parseFloat(curr.details.margin), 0) / results.selected_stocks.length).toFixed(2)}%</p>
                            </div>
                        </div>
                    </div>
                    <div class="chart-container">
                        <canvas id="quality-chart"></canvas>
                    </div>
                </div>
                <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
                <script>
                    // 차트 생성
                    const ctx = document.getElementById('quality-chart').getContext('2d');
                    new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: ${JSON.stringify(results.selected_stocks.map(s => s.symbol))},
                            datasets: [{
                                label: '퀄리티 점수',
                                data: ${JSON.stringify(results.selected_stocks.map(s => s.score))},
                                backgroundColor: '#e74c3c'
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                title: {
                                    display: true,
                                    text: '선정 종목 퀄리티 점수'
                                }
                            }
                        }
                    });
                </script>
            </body>
            </html>
        `);
        
        resultWindow.document.close();
    } catch (error) {
        console.error('결과 창 표시 중 오류 발생:', error);
        showError(error.message || '결과를 표시할 수 없습니다.');
    }
} 