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
async function parseFileAsJson(file) {
    try {
        const text = await file.text();
        return JSON.parse(text);
    } catch (error) {
        console.error("JSON 파싱 중 오류 발생:", error);
        throw new Error(`JSON 파싱 실패: ${error.message}`);
    }
}
function getFileUrl({ bucketName, region, key }) {
    const url = `https://${bucketName}.s3.${region}.amazonaws.com/${key.replace(/\\/g, "/")}`;
    console.log(url);
    return url;
}
export { createJsonFile, getFileUrl, parseFileAsJson };
