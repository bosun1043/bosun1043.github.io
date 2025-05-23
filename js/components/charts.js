// 차트 컴포넌트
export class ChartComponent {
    constructor(canvasId, options = {}) {
        this.canvas = document.getElementById(canvasId);
        this.chart = null;
        this.options = {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: '수익률',
                    data: [],
                    borderColor: '#3498db',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                ...options
            }
        };
    }

    initialize() {
        this.chart = new Chart(this.canvas, this.options);
    }

    updateData(labels, data) {
        this.chart.data.labels = labels;
        this.chart.data.datasets[0].data = data;
        this.chart.update();
    }

    updateOptions(newOptions) {
        Object.assign(this.chart.options, newOptions);
        this.chart.update();
    }
} 