function createJsonFile(data, filename) {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([
        jsonString
    ], {
        type: "application/json"
    });
    const file = new File([
        blob
    ], filename, {
        type: "application/json"
    });
    return file;
}
const groupBy = (array, key)=>array.reduce((acc, item)=>{
        const groupKey = String(item[key]);
        acc[groupKey] ??= [];
        acc[groupKey].push(item);
        return acc;
    }, {});
function parseFileAsJson(buffer) {
    try {
        const text = buffer.toString("utf-8");
        return JSON.parse(text);
    } catch (error) {
        console.error("JSON 파싱 중 오류 발생:", error);
        throw new Error(`JSON 파싱 실패: ${error.message}`);
    }
}
export { createJsonFile, groupBy, parseFileAsJson };
