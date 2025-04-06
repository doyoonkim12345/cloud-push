"use strict";
var __webpack_require__ = {};
(()=>{
    __webpack_require__.d = (exports1, definition)=>{
        for(var key in definition)if (__webpack_require__.o(definition, key) && !__webpack_require__.o(exports1, key)) Object.defineProperty(exports1, key, {
            enumerable: true,
            get: definition[key]
        });
    };
})();
(()=>{
    __webpack_require__.o = (obj, prop)=>Object.prototype.hasOwnProperty.call(obj, prop);
})();
(()=>{
    __webpack_require__.r = (exports1)=>{
        if ('undefined' != typeof Symbol && Symbol.toStringTag) Object.defineProperty(exports1, Symbol.toStringTag, {
            value: 'Module'
        });
        Object.defineProperty(exports1, '__esModule', {
            value: true
        });
    };
})();
var __webpack_exports__ = {};
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
    getFileUrl: ()=>getFileUrl,
    parseFileAsJson: ()=>parseFileAsJson,
    createJsonFile: ()=>createJsonFile
});
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
var __webpack_export_target__ = exports;
for(var __webpack_i__ in __webpack_exports__)__webpack_export_target__[__webpack_i__] = __webpack_exports__[__webpack_i__];
if (__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, '__esModule', {
    value: true
});
