export function perbandingan(before, after) {
    if (before === 0) {
        return 0
    }

    let hasil =( (after - before) / before) * 100
    return hasil
}