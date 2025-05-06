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
    getCwd: ()=>getCwd,
    selectDbClient: ()=>selectDbClient,
    selectStorageClient: ()=>selectStorageClient
});
const prompts_namespaceObject = require("@clack/prompts");
async function selectDbClient() {
    const Db = await prompts_namespaceObject.select({
        message: "Select Db client",
        options: [
            {
                value: "LOWDB",
                label: "Lowdb(json)"
            },
            {
                value: "FIREBASE",
                label: "Firebase firestore"
            },
            {
                value: "SUPABASE",
                label: "Supabase"
            },
            {
                value: "CUSTOM",
                label: "Custom"
            }
        ],
        initialValue: "LOWDB"
    });
    if (!Db) throw new Error("No DbClient selected. Exiting...");
    return Db;
}
async function selectStorageClient() {
    const storage = await prompts_namespaceObject.select({
        message: "Select Storage client",
        options: [
            {
                value: "AWS_S3",
                label: "AWS_S3"
            },
            {
                value: "FIREBASE",
                label: "Firebase storage"
            },
            {
                value: "SUPABASE",
                label: "Supabase R2"
            },
            {
                value: "CUSTOM",
                label: "Custom"
            }
        ],
        initialValue: "AWS_S3"
    });
    if (!storage) throw new Error("No DbClient selected. Exiting...");
    return storage;
}
const external_workspace_tools_namespaceObject = require("workspace-tools");
const getCwd = ()=>(0, external_workspace_tools_namespaceObject.findPackageRoot)(process.cwd());
var __webpack_export_target__ = exports;
for(var __webpack_i__ in __webpack_exports__)__webpack_export_target__[__webpack_i__] = __webpack_exports__[__webpack_i__];
if (__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, '__esModule', {
    value: true
});
