export function getChart(ctx, type) {
    return new Chart(ctx, {
        type: type,
        data: {
            labels: [],
            datasets: []
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                },
            },
            scales: {
                x: {
                    beginAtZero: true
                }
            }
        }
    })
}

