export function chartControl(label, chart, Checkbox, effect) {
    let dummy = chart.data.datasets.find(e=> e.label === label);
    dummy[effect] = effect === "hidden" ? !Checkbox.checked : Checkbox.checked;
    chart.update()
}