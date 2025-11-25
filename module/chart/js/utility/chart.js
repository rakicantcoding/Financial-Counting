export function getChart(ctx, type) {
    return new Chart(ctx, {
        type,
        data: {
            labels: [],
            datasets: []
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    })
}

