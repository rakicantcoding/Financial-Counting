export function inputElseFilter(array, periodFilter, type, input) {
    let month = Math.max(...array.map(e => e.month));

    month = periodFilter.value !== "month" ? parseInt(month / 12) : month;

    if (type === "start") {
        input.value = input.value.replace(/[^0-9]/g, "");
        if (input.value === "") return;
        if (input.value < 1) return input.value = 1;
        if (input.value > month) return input.value = month === 1 ? 1 : month - 1;
    }

    if (type === "end") {
        input.value = input.value.replace(/[^0-9]/g, "");
        if (input.value === "") return;
        if (input.value < 1) return input.value = 2;
        if (input.value > month) return input.value = month;
    }
}


export function alertingElse(input_min, input_max, typePeriod) {
    if (typePeriod.value !== "custom") return "Need Choose 'Custom' on Time Period";
    if (!input_min.value) return "Need Input the Period Start";
    if (input_max.value === "") return null;
    if (Number(input_min.value) >= Number(input_max.value)) return "Period Start Cant Higher or Same Than Period End";

    return null
}