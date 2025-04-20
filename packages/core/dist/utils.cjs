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
    createJsonFile: ()=>createJsonFile,
    parseFileAsJson: ()=>parseFileAsJson,
    groupBy: ()=>groupBy,
    generateBrowserClient: ()=>generateBrowserClient
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
function parseFileAsJson(buffer) {
    try {
        const text = buffer.toString("utf-8");
        return JSON.parse(text);
    } catch (error) {
        console.error("JSON 파싱 중 오류 발생:", error);
        throw new Error(`JSON 파싱 실패: ${error.message}`);
    }
}
function generateBrowserClient(obj) {
    return async (key, ...args)=>{
        const value = obj[key];
        if ("function" == typeof value) return await value(...args);
        return Promise.resolve(value);
    };
}
const groupBy = (array, key)=>array.reduce((acc, item)=>{
        const groupKey = String(item[key]);
        acc[groupKey] ??= [];
        acc[groupKey].push(item);
        return acc;
    }, {});
var __webpack_export_target__ = exports;
for(var __webpack_i__ in __webpack_exports__)__webpack_export_target__[__webpack_i__] = __webpack_exports__[__webpack_i__];
if (__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, '__esModule', {
    value: true
});
