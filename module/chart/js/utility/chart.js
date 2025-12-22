export function getChart(ctx, type) {
    const isMobile = window.innerWidth <= 768;

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
        if (period === "month") {
            for (let month = 1; month <= array.length; month++) {
                let tahun = month > 12 ? parseInt(month / 12) : 0;
                let bulan = month > 12 ? parseFloat(month % 12) : month;
                result.push(tahun ? `${tahun}Y ${bulan}M` : `${bulan}M`);
            }
        }

        if (period === "year") {
            let duration = parseInt(array.length / 12);
            let sisa = array % 12 !== 0 ? array.length : "";

            for (let year = 1; year <= duration; year++) {
                result.push(`${year}Y`)
            }

            if (sisa) {
                result.push(`${duration}Y ${sisa % 12}M`)
            }
        }
    }

    if (filter_start && filter_end) {
        let dummy = []

        if (period === "month") {
            filter_end = filter_end !== " " ? filter_end : array.length
            dummy = array.map(e => e.month).filter(e => e >= filter_start && e <= filter_end)
        }

        if (period === "year") {
            let sisa;
            if (filter_end === " ") {
                sisa = filter_end.length % 12;
            }
            let year = filter_end !== " " ? filter_end : parseInt(array.length / 12);

            for (let length = filter_start; length <= year; length++) {
                dummy.push(array.find(e => e.month === length * 12).month)
            }

            if (sisa) {
                dummy.push(array.at(-1).month)
            }

        }




        dummy.forEach(e => {
            result.push(monthToLabel(e))
        });
    }
    return result
}



export function getData(array, key, period, filter_start, filter_end) {
    let result

    // MONTH-YEAR
    if (!filter_start && !filter_end) {
        if (period === "month") {
            result = array.map(e => e[key])
        }

        if (period === "year") {
            result = [];
            let year = parseInt(array.length / 12);
            let sisa = array.length % 12;

            for (let y = 1; y <= year; y++) {
                result.push(array.find(e => e.month === y * 12)[key])
            }

            if (sisa) result.push(array.at(-1)[key])
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
            filter_end = filter_end !== " " ? filter_end * 12 : array.length

            let year = parseInt(filter_end / 12)
            let sisa = filter_end % 12 !== 0;

            let isi = [];

            for (let y = filter_start; y <= year; y++) {
                let convert = y * 12
                isi.push(array.find(e => e.month === convert)[key])
            }

            if (sisa) {
                isi.push(array.at(-1)[key])
            }
            result = isi
        }
    }
    return result
}