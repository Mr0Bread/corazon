export async function measure<T>(callback: () => T, onMeasure: (duration: number) => void) {
    const start = performance.now();
    const result = await callback();
    const end = performance.now();
    const elapsed = end - start;
    onMeasure(elapsed);
    return result;
}