export function getChart(ctx, type) {
    const isMobile = window.innerWidth <= 768 || type === "doughnut";

    return new Chart(ctx, {
        type,
        data: {
            labels: [],
            datasets: []
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,

            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: true // mobile masih bisa tap
                }
            },

            scales: {
                x: {
                    display: !isMobile, // label bawah
                    grid: {
                        display: false
                    }
                },
                y: {
                    display: !isMobile, // nominal kiri
                    grid: {
                        drawBorder: false
                    }
                }
            }
        }
    });
}

export function prettierOptions(type, chart) {
    if (type.value === "bar") {
        chart.options.plugins.tooltip.callbacks.label = function (ctx) {
            return ctx.label + ": " + ctx.raw.toFixed(2) + "%";
        }
    }

    if (type.value === "line" || type.value === "bar") {
        chart.options.scales.y.ticks.callback = (value) => `Rp ${value.toLocaleString('id-ID')}`;
        chart.options.plugins.tooltip.callbacks.label = (ctx) => {
            return `Rp ${Math.round(ctx.parsed.y).toLocaleString('id-ID')}`;
        }
    }
}



function monthToLabel(month) {
    if (month <= 12) return `${month}M`;

    const year = Math.floor(month / 12);
    const sisa = month % 12;

    if (sisa === 0) return `${year}Y`;

    return `${year}Y ${sisa}M`;
}

export function getLabels(array, period, filter_start, filter_end) {
    let result = [];

    if (!filter_start && !filter_end) {
        const maxMonth = Math.max(...array.map(e => e.month));

        if (period === "month") {
            for (let start = 1; start <= maxMonth; start++) {
                let dummyData = monthToLabel(start);
                result.push(dummyData);
            }
        }

        if (period === "year") {
            const maxYear = Math.floor(maxMonth / 12);

            for (let start = 1; start <= maxYear; start++) {
                let year = start * 12;
                let dummyData = monthToLabel(year);
                result.push(dummyData);
            }

            if (maxMonth % 12 !== 0) {
                if (maxYear <= 5) {
                    const monthStart = (maxYear * 12) + 1;
                    for (let start = monthStart; start <= maxMonth; start++) {
                        let dummyData = monthToLabel(start);
                        result.push(dummyData)
                    }
                }

                else {
                    let dummyData = monthToLabel(maxMonth);
                    result.push(dummyData)
                }
            }
        }
    }

    if (filter_start && filter_end) {
        const maxMonth = filter_end !== " " ? filter_end : Math.max(...array.map(e => e.month))
        if (period === "month") {
            const startMonth = filter_start;
            for (let start = startMonth; start <= maxMonth; start++) {
                let dummyData = monthToLabel(start)
                result.push(dummyData)
            }
        }

        if (period === "year") {
            const startYear = filter_start;
            const maxYear = filter_end !== " " ? filter_end : Math.floor(Math.max(...array.map(e => e.month)) / 12);

            for (let start = startYear; start <= maxYear; start++) {
                let year = start * 12;
                let dummyData = monthToLabel(year);
                result.push(dummyData);
            }

            if (maxMonth % 12 !== 0) {
                let dummyData;
                if (maxYear <= 5) {
                    const monthStart = (startYear * 12) + 1;
                    for (let start = monthStart; start <= maxMonth; start++) {
                        dummyData = monthToLabel(start);
                        result.push(dummyData)
                    }
                }

                else {
                    dummyData = monthToLabel(maxMonth)
                    result.push(dummyData)
                }
            }
        }
    }

    return result
}



export function getData(array, key, period, filter_start, filter_end) {
    let result

    // MONTH-YEAR
    if (!filter_start && !filter_end) {
        if (period === "month") {
            let isi = [];

            const maxMonth = Math.max(...array.map(e => e.month));

            for (let start = 1; start <= maxMonth; start++) {
                let dummyData = array.filter(e => e.month === start).reduce((acc, item) => acc + item[key], 0);
                isi.push(dummyData)
            }

            result = isi
        }

        if (period === "year") {
            let isi = [];

            const maxMonth = Math.max(...array.map(e => e.month));
            const maxYear = Math.floor(maxMonth / 12);

            for (let start = 1; start <= maxYear; start++) {
                let year = start * 12;
                let dummyData = array.filter(e => e.month === year).reduce((acc, item) => acc + item[key], 0)
                isi.push(dummyData)
            }

            if (maxMonth % 12 !== 0) {
                const startSisa = (maxYear * 12) + 1;

                if (maxYear <= 5) {
                    for (let start = startSisa; start <= maxMonth; start++) {
                        let dummyData = array.filter(e => e.month === start).reduce((acc, item) => acc + item[key], 0)
                        isi.push(dummyData)
                    }
                }

                else {
                    let dummyData = array.filter(e => e.month === maxMonth).reduce((acc, item) => acc + item[key], 0);
                    isi.push(dummyData)
                }

            }
            result = isi;
        }
    }

    // FILTERING
    if (filter_start && filter_end) {

        if (period === "month") {
            let end = filter_end !== " " ? filter_end : array.length;

            let isi = array.filter(e => e.month >= filter_start && e.month <= end).map(e => e[key])

            result = isi
        }

        if (period === "year") {
            let isi = [];

            const maxMonth = Math.max(...array.map(e => e.month))
            const maxYear = Math.floor(maxMonth / 12);

            for (let start = filter_start; start <= maxYear; start++) {
                let year = start * 12;
                let dummyData = array.filter(e => e.month === year).reduce((acc, item) => acc + item[key], 0);
                isi.push(dummyData)
            }

            if (maxMonth % 12 !== 0) {

                const startSisa = (maxYear * 12) + 1;

                for (let start = startSisa; start <= maxMonth; start++) {
                    let dummyData = array.filter(e => e.month === start).reduce((acc, item) => acc + item[key], 0)
                    isi.push(dummyData)
                }
            }
            result = isi
        }
    }
    return result
}