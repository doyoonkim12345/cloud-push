#!/usr/bin/env node
var __webpack_modules__ = {
    "../node_modules/.pnpm/cross-spawn@7.0.6/node_modules/cross-spawn/index.js": function(module, __unused_webpack_exports, __webpack_require__) {
        "use strict";
        const cp = __webpack_require__("child_process");
        const parse = __webpack_require__("../node_modules/.pnpm/cross-spawn@7.0.6/node_modules/cross-spawn/lib/parse.js");
        const enoent = __webpack_require__("../node_modules/.pnpm/cross-spawn@7.0.6/node_modules/cross-spawn/lib/enoent.js");
        function spawn(command, args, options) {
            const parsed = parse(command, args, options);
            const spawned = cp.spawn(parsed.command, parsed.args, parsed.options);
            enoent.hookChildProcess(spawned, parsed);
            return spawned;
        }
        function spawnSync(command, args, options) {
            const parsed = parse(command, args, options);
            const result = cp.spawnSync(parsed.command, parsed.args, parsed.options);
            result.error = result.error || enoent.verifyENOENTSync(result.status, parsed);
            return result;
        }
        module.exports = spawn;
        module.exports.spawn = spawn;
        module.exports.sync = spawnSync;
        module.exports._parse = parse;
        module.exports._enoent = enoent;
    },
    "../node_modules/.pnpm/cross-spawn@7.0.6/node_modules/cross-spawn/lib/enoent.js": function(module) {
        "use strict";
        const isWin = 'win32' === process.platform;
        function notFoundError(original, syscall) {
            return Object.assign(new Error(`${syscall} ${original.command} ENOENT`), {
                code: 'ENOENT',
                errno: 'ENOENT',
                syscall: `${syscall} ${original.command}`,
                path: original.command,
                spawnargs: original.args
            });
        }
        function hookChildProcess(cp, parsed) {
            if (!isWin) return;
            const originalEmit = cp.emit;
            cp.emit = function(name, arg1) {
                if ('exit' === name) {
                    const err = verifyENOENT(arg1, parsed);
                    if (err) return originalEmit.call(cp, 'error', err);
                }
                return originalEmit.apply(cp, arguments);
            };
        }
        function verifyENOENT(status, parsed) {
            if (isWin && 1 === status && !parsed.file) return notFoundError(parsed.original, 'spawn');
            return null;
        }
        function verifyENOENTSync(status, parsed) {
            if (isWin && 1 === status && !parsed.file) return notFoundError(parsed.original, 'spawnSync');
            return null;
        }
        module.exports = {
            hookChildProcess,
            verifyENOENT,
            verifyENOENTSync,
            notFoundError
        };
    },
    "../node_modules/.pnpm/cross-spawn@7.0.6/node_modules/cross-spawn/lib/parse.js": function(module, __unused_webpack_exports, __webpack_require__) {
        "use strict";
        const path = __webpack_require__("path");
        const resolveCommand = __webpack_require__("../node_modules/.pnpm/cross-spawn@7.0.6/node_modules/cross-spawn/lib/util/resolveCommand.js");
        const escape = __webpack_require__("../node_modules/.pnpm/cross-spawn@7.0.6/node_modules/cross-spawn/lib/util/escape.js");
        const readShebang = __webpack_require__("../node_modules/.pnpm/cross-spawn@7.0.6/node_modules/cross-spawn/lib/util/readShebang.js");
        const isWin = 'win32' === process.platform;
        const isExecutableRegExp = /\.(?:com|exe)$/i;
        const isCmdShimRegExp = /node_modules[\\/].bin[\\/][^\\/]+\.cmd$/i;
        function detectShebang(parsed) {
            parsed.file = resolveCommand(parsed);
            const shebang = parsed.file && readShebang(parsed.file);
            if (shebang) {
                parsed.args.unshift(parsed.file);
                parsed.command = shebang;
                return resolveCommand(parsed);
            }
            return parsed.file;
        }
        function parseNonShell(parsed) {
            if (!isWin) return parsed;
            const commandFile = detectShebang(parsed);
            const needsShell = !isExecutableRegExp.test(commandFile);
            if (parsed.options.forceShell || needsShell) {
                const needsDoubleEscapeMetaChars = isCmdShimRegExp.test(commandFile);
                parsed.command = path.normalize(parsed.command);
                parsed.command = escape.command(parsed.command);
                parsed.args = parsed.args.map((arg)=>escape.argument(arg, needsDoubleEscapeMetaChars));
                const shellCommand = [
                    parsed.command
                ].concat(parsed.args).join(' ');
                parsed.args = [
                    '/d',
                    '/s',
                    '/c',
                    `"${shellCommand}"`
                ];
                parsed.command = process.env.comspec || 'cmd.exe';
                parsed.options.windowsVerbatimArguments = true;
            }
            return parsed;
        }
        function parse(command, args, options) {
            if (args && !Array.isArray(args)) {
                options = args;
                args = null;
            }
            args = args ? args.slice(0) : [];
            options = Object.assign({}, options);
            const parsed = {
                command,
                args,
                options,
                file: void 0,
                original: {
                    command,
                    args
                }
            };
            return options.shell ? parsed : parseNonShell(parsed);
        }
        module.exports = parse;
    },
    "../node_modules/.pnpm/cross-spawn@7.0.6/node_modules/cross-spawn/lib/util/escape.js": function(module) {
        "use strict";
        const metaCharsRegExp = /([()\][%!^"`<>&|;, *?])/g;
        function escapeCommand(arg) {
            arg = arg.replace(metaCharsRegExp, '^$1');
            return arg;
        }
        function escapeArgument(arg, doubleEscapeMetaChars) {
            arg = `${arg}`;
            arg = arg.replace(/(?=(\\+?)?)\1"/g, '$1$1\\"');
            arg = arg.replace(/(?=(\\+?)?)\1$/, '$1$1');
            arg = `"${arg}"`;
            arg = arg.replace(metaCharsRegExp, '^$1');
            if (doubleEscapeMetaChars) arg = arg.replace(metaCharsRegExp, '^$1');
            return arg;
        }
        module.exports.command = escapeCommand;
        module.exports.argument = escapeArgument;
    },
    "../node_modules/.pnpm/cross-spawn@7.0.6/node_modules/cross-spawn/lib/util/readShebang.js": function(module, __unused_webpack_exports, __webpack_require__) {
        "use strict";
        const fs = __webpack_require__("fs");
        const shebangCommand = __webpack_require__("../node_modules/.pnpm/shebang-command@2.0.0/node_modules/shebang-command/index.js");
        function readShebang(command) {
            const size = 150;
            const buffer = Buffer.alloc(size);
            let fd;
            try {
                fd = fs.openSync(command, 'r');
                fs.readSync(fd, buffer, 0, size, 0);
                fs.closeSync(fd);
            } catch (e) {}
            return shebangCommand(buffer.toString());
        }
        module.exports = readShebang;
    },
    "../node_modules/.pnpm/cross-spawn@7.0.6/node_modules/cross-spawn/lib/util/resolveCommand.js": function(module, __unused_webpack_exports, __webpack_require__) {
        "use strict";
        const path = __webpack_require__("path");
        const which = __webpack_require__("../node_modules/.pnpm/which@2.0.2/node_modules/which/which.js");
        const getPathKey = __webpack_require__("../node_modules/.pnpm/path-key@3.1.1/node_modules/path-key/index.js");
        function resolveCommandAttempt(parsed, withoutPathExt) {
            const env = parsed.options.env || process.env;
            const cwd = process.cwd();
            const hasCustomCwd = null != parsed.options.cwd;
            const shouldSwitchCwd = hasCustomCwd && void 0 !== process.chdir && !process.chdir.disabled;
            if (shouldSwitchCwd) try {
                process.chdir(parsed.options.cwd);
            } catch (err) {}
            let resolved;
            try {
                resolved = which.sync(parsed.command, {
                    path: env[getPathKey({
                        env
                    })],
                    pathExt: withoutPathExt ? path.delimiter : void 0
                });
            } catch (e) {} finally{
                if (shouldSwitchCwd) process.chdir(cwd);
            }
            if (resolved) resolved = path.resolve(hasCustomCwd ? parsed.options.cwd : '', resolved);
            return resolved;
        }
        function resolveCommand(parsed) {
            return resolveCommandAttempt(parsed) || resolveCommandAttempt(parsed, true);
        }
        module.exports = resolveCommand;
    },
    "../node_modules/.pnpm/isexe@2.0.0/node_modules/isexe/index.js": function(module, __unused_webpack_exports, __webpack_require__) {
        __webpack_require__("fs");
        var core;
        core = 'win32' === process.platform || global.TESTING_WINDOWS ? __webpack_require__("../node_modules/.pnpm/isexe@2.0.0/node_modules/isexe/windows.js") : __webpack_require__("../node_modules/.pnpm/isexe@2.0.0/node_modules/isexe/mode.js");
        module.exports = isexe;
        isexe.sync = sync;
        function isexe(path, options, cb) {
            if ('function' == typeof options) {
                cb = options;
                options = {};
            }
            if (!cb) {
                if ('function' != typeof Promise) throw new TypeError('callback not provided');
                return new Promise(function(resolve, reject) {
                    isexe(path, options || {}, function(er, is) {
                        if (er) reject(er);
                        else resolve(is);
                    });
                });
            }
            core(path, options || {}, function(er, is) {
                if (er) {
                    if ('EACCES' === er.code || options && options.ignoreErrors) {
                        er = null;
                        is = false;
                    }
                }
                cb(er, is);
            });
        }
        function sync(path, options) {
            try {
                return core.sync(path, options || {});
            } catch (er) {
                if (options && options.ignoreErrors || 'EACCES' === er.code) return false;
                throw er;
            }
        }
    },
    "../node_modules/.pnpm/isexe@2.0.0/node_modules/isexe/mode.js": function(module, __unused_webpack_exports, __webpack_require__) {
        module.exports = isexe;
        isexe.sync = sync;
        var fs = __webpack_require__("fs");
        function isexe(path, options, cb) {
            fs.stat(path, function(er, stat) {
                cb(er, er ? false : checkStat(stat, options));
            });
        }
        function sync(path, options) {
            return checkStat(fs.statSync(path), options);
        }
        function checkStat(stat, options) {
            return stat.isFile() && checkMode(stat, options);
        }
        function checkMode(stat, options) {
            var mod = stat.mode;
            var uid = stat.uid;
            var gid = stat.gid;
            var myUid = void 0 !== options.uid ? options.uid : process.getuid && process.getuid();
            var myGid = void 0 !== options.gid ? options.gid : process.getgid && process.getgid();
            var u = parseInt('100', 8);
            var g = parseInt('010', 8);
            var o = parseInt('001', 8);
            var ug = u | g;
            var ret = mod & o || mod & g && gid === myGid || mod & u && uid === myUid || mod & ug && 0 === myUid;
            return ret;
        }
    },
    "../node_modules/.pnpm/isexe@2.0.0/node_modules/isexe/windows.js": function(module, __unused_webpack_exports, __webpack_require__) {
        module.exports = isexe;
        isexe.sync = sync;
        var fs = __webpack_require__("fs");
        function checkPathExt(path, options) {
            var pathext = void 0 !== options.pathExt ? options.pathExt : process.env.PATHEXT;
            if (!pathext) return true;
            pathext = pathext.split(';');
            if (-1 !== pathext.indexOf('')) return true;
            for(var i = 0; i < pathext.length; i++){
                var p = pathext[i].toLowerCase();
                if (p && path.substr(-p.length).toLowerCase() === p) return true;
            }
            return false;
        }
        function checkStat(stat, path, options) {
            if (!stat.isSymbolicLink() && !stat.isFile()) return false;
            return checkPathExt(path, options);
        }
        function isexe(path, options, cb) {
            fs.stat(path, function(er, stat) {
                cb(er, er ? false : checkStat(stat, path, options));
            });
        }
        function sync(path, options) {
            return checkStat(fs.statSync(path), path, options);
        }
    },
    "../node_modules/.pnpm/path-key@3.1.1/node_modules/path-key/index.js": function(module) {
        "use strict";
        const pathKey = (options = {})=>{
            const environment = options.env || process.env;
            const platform = options.platform || process.platform;
            if ('win32' !== platform) return 'PATH';
            return Object.keys(environment).reverse().find((key)=>'PATH' === key.toUpperCase()) || 'Path';
        };
        module.exports = pathKey;
        module.exports["default"] = pathKey;
    },
    "../node_modules/.pnpm/shebang-command@2.0.0/node_modules/shebang-command/index.js": function(module, __unused_webpack_exports, __webpack_require__) {
        "use strict";
        const shebangRegex = __webpack_require__("../node_modules/.pnpm/shebang-regex@3.0.0/node_modules/shebang-regex/index.js");
        module.exports = (string = '')=>{
            const match = string.match(shebangRegex);
            if (!match) return null;
            const [path, argument] = match[0].replace(/#! ?/, '').split(' ');
            const binary = path.split('/').pop();
            if ('env' === binary) return argument;
            return argument ? `${binary} ${argument}` : binary;
        };
    },
    "../node_modules/.pnpm/shebang-regex@3.0.0/node_modules/shebang-regex/index.js": function(module) {
        "use strict";
        module.exports = /^#!(.*)/;
    },
    "../node_modules/.pnpm/which@2.0.2/node_modules/which/which.js": function(module, __unused_webpack_exports, __webpack_require__) {
        const isWindows = 'win32' === process.platform || 'cygwin' === process.env.OSTYPE || 'msys' === process.env.OSTYPE;
        const path = __webpack_require__("path");
        const COLON = isWindows ? ';' : ':';
        const isexe = __webpack_require__("../node_modules/.pnpm/isexe@2.0.0/node_modules/isexe/index.js");
        const getNotFoundError = (cmd)=>Object.assign(new Error(`not found: ${cmd}`), {
                code: 'ENOENT'
            });
        const getPathInfo = (cmd, opt)=>{
            const colon = opt.colon || COLON;
            const pathEnv = cmd.match(/\//) || isWindows && cmd.match(/\\/) ? [
                ''
            ] : [
                ...isWindows ? [
                    process.cwd()
                ] : [],
                ...(opt.path || process.env.PATH || '').split(colon)
            ];
            const pathExtExe = isWindows ? opt.pathExt || process.env.PATHEXT || '.EXE;.CMD;.BAT;.COM' : '';
            const pathExt = isWindows ? pathExtExe.split(colon) : [
                ''
            ];
            if (isWindows) {
                if (-1 !== cmd.indexOf('.') && '' !== pathExt[0]) pathExt.unshift('');
            }
            return {
                pathEnv,
                pathExt,
                pathExtExe
            };
        };
        const which = (cmd, opt, cb)=>{
            if ('function' == typeof opt) {
                cb = opt;
                opt = {};
            }
            if (!opt) opt = {};
            const { pathEnv, pathExt, pathExtExe } = getPathInfo(cmd, opt);
            const found = [];
            const step = (i)=>new Promise((resolve, reject)=>{
                    if (i === pathEnv.length) return opt.all && found.length ? resolve(found) : reject(getNotFoundError(cmd));
                    const ppRaw = pathEnv[i];
                    const pathPart = /^".*"$/.test(ppRaw) ? ppRaw.slice(1, -1) : ppRaw;
                    const pCmd = path.join(pathPart, cmd);
                    const p = !pathPart && /^\.[\\\/]/.test(cmd) ? cmd.slice(0, 2) + pCmd : pCmd;
                    resolve(subStep(p, i, 0));
                });
            const subStep = (p, i, ii)=>new Promise((resolve, reject)=>{
                    if (ii === pathExt.length) return resolve(step(i + 1));
                    const ext = pathExt[ii];
                    isexe(p + ext, {
                        pathExt: pathExtExe
                    }, (er, is)=>{
                        if (!er && is) {
                            if (!opt.all) return resolve(p + ext);
                            found.push(p + ext);
                        }
                        return resolve(subStep(p, i, ii + 1));
                    });
                });
            return cb ? step(0).then((res)=>cb(null, res), cb) : step(0);
        };
        const whichSync = (cmd, opt)=>{
            opt = opt || {};
            const { pathEnv, pathExt, pathExtExe } = getPathInfo(cmd, opt);
            const found = [];
            for(let i = 0; i < pathEnv.length; i++){
                const ppRaw = pathEnv[i];
                const pathPart = /^".*"$/.test(ppRaw) ? ppRaw.slice(1, -1) : ppRaw;
                const pCmd = path.join(pathPart, cmd);
                const p = !pathPart && /^\.[\\\/]/.test(cmd) ? cmd.slice(0, 2) + pCmd : pCmd;
                for(let j = 0; j < pathExt.length; j++){
                    const cur = p + pathExt[j];
                    try {
                        const is = isexe.sync(cur, {
                            pathExt: pathExtExe
                        });
                        if (is) {
                            if (!opt.all) return cur;
                            found.push(cur);
                        }
                    } catch (ex) {}
                }
            }
            if (opt.all && found.length) return found;
            if (opt.nothrow) return null;
            throw getNotFoundError(cmd);
        };
        module.exports = which;
        which.sync = whichSync;
    },
    child_process: function(module) {
        "use strict";
        module.exports = require("child_process");
    },
    fs: function(module) {
        "use strict";
        module.exports = require("fs");
    },
    path: function(module) {
        "use strict";
        module.exports = require("path");
    }
};
var __webpack_module_cache__ = {};
function __webpack_require__(moduleId) {
    var cachedModule = __webpack_module_cache__[moduleId];
    if (void 0 !== cachedModule) return cachedModule.exports;
    var module = __webpack_module_cache__[moduleId] = {
        exports: {}
    };
    __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
    return module.exports;
}
(()=>{
    __webpack_require__.n = (module)=>{
        var getter = module && module.__esModule ? ()=>module['default'] : ()=>module;
        __webpack_require__.d(getter, {
            a: getter
        });
        return getter;
    };
})();
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
var __webpack_exports__ = {};
(()=>{
    "use strict";
    const external_commander_namespaceObject = require("commander");
    const prompts_namespaceObject = require("@clack/prompts");
    const external_node_path_namespaceObject = require("node:path");
    async function selectPlatforms() {
        const platforms = await prompts_namespaceObject.multiselect({
            message: "Select platforms",
            options: [
                {
                    label: "Android",
                    value: "android"
                },
                {
                    label: "Ios",
                    value: "ios"
                }
            ],
            initialValues: [
                "android",
                "ios"
            ],
            required: true
        });
        if (!platforms || 0 === platforms.length) throw new Error("No platforms selected. Exiting...");
        return platforms;
    }
    async function selectEnvironment() {
        const environment = await prompts_namespaceObject.select({
            message: "Select environment",
            options: [
                {
                    value: "production",
                    label: "production"
                },
                {
                    value: "development",
                    label: "development"
                },
                {
                    value: "preview",
                    label: "preview"
                }
            ],
            initialValue: "production"
        });
        if (!environment) throw new Error("No environment selected. Exiting...");
        return environment;
    }
    async function selectEnvSource() {
        const envSource = await prompts_namespaceObject.select({
            message: "Select where to load environment variables from",
            options: [
                {
                    value: "eas",
                    label: "EAS"
                },
                {
                    value: "file",
                    label: ".env"
                }
            ]
        });
        if (!envSource) throw new Error("No environment selected. Exiting...");
        return envSource;
    }
    const external_cosmiconfig_namespaceObject = require("cosmiconfig");
    const external_cosmiconfig_typescript_loader_namespaceObject = require("cosmiconfig-typescript-loader");
    const node_namespaceObject = require("@cloud-push/core/node");
    const MODULE_NAME = "cloud-push";
    const loadConfig = async ()=>{
        try {
            const result = await (0, external_cosmiconfig_namespaceObject.cosmiconfig)(MODULE_NAME, {
                stopDir: (0, node_namespaceObject.getCwd)(),
                searchPlaces: [
                    "package.json",
                    `${MODULE_NAME}.config.js`,
                    `${MODULE_NAME}.config.cjs`,
                    `${MODULE_NAME}.config.mjs`,
                    `${MODULE_NAME}.config.ts`
                ],
                ignoreEmptySearchPlaces: false,
                loaders: {
                    ".ts": (0, external_cosmiconfig_typescript_loader_namespaceObject.TypeScriptLoader)(),
                    ".mts": (0, external_cosmiconfig_typescript_loader_namespaceObject.TypeScriptLoader)(),
                    ".cts": (0, external_cosmiconfig_typescript_loader_namespaceObject.TypeScriptLoader)()
                }
            }).search();
            if (!result?.config) throw new Error("Failed to find config");
            if ("function" == typeof result.config) return await result.config();
            return result.config;
        } catch (e) {
            throw new Error(e);
        }
    };
    const external_semver_namespaceObject = require("semver");
    var external_semver_default = /*#__PURE__*/ __webpack_require__.n(external_semver_namespaceObject);
    async function getRuntimeVersion(configRuntimeVersion) {
        let runtimeVersion = configRuntimeVersion;
        if (runtimeVersion && external_semver_default().valid(runtimeVersion)) prompts_namespaceObject.log.success(`runtimeVersion: ${runtimeVersion}`);
        else {
            runtimeVersion = await prompts_namespaceObject.text({
                message: "What runtimeVersion would you like to set?",
                placeholder: "1.0.0",
                validate: (value)=>{
                    if (!external_semver_default().valid(value)) return new Error("Please enter a valid semantic version (e.g., 1.0.0)");
                }
            });
            if ("string" != typeof runtimeVersion) throw new Error("No runtimeVersion provided. Exiting...");
        }
        return runtimeVersion;
    }
    function isPlainObject(value) {
        if ('object' != typeof value || null === value) return false;
        const prototype = Object.getPrototypeOf(value);
        return (null === prototype || prototype === Object.prototype || null === Object.getPrototypeOf(prototype)) && !(Symbol.toStringTag in value) && !(Symbol.iterator in value);
    }
    const external_node_url_namespaceObject = require("node:url");
    const safeNormalizeFileUrl = (file, name)=>{
        const fileString = normalizeFileUrl(normalizeDenoExecPath(file));
        if ('string' != typeof fileString) throw new TypeError(`${name} must be a string or a file URL: ${fileString}.`);
        return fileString;
    };
    const normalizeDenoExecPath = (file)=>isDenoExecPath(file) ? file.toString() : file;
    const isDenoExecPath = (file)=>'string' != typeof file && file && Object.getPrototypeOf(file) === String.prototype;
    const normalizeFileUrl = (file)=>file instanceof URL ? (0, external_node_url_namespaceObject.fileURLToPath)(file) : file;
    const normalizeParameters = (rawFile, rawArguments = [], rawOptions = {})=>{
        const filePath = safeNormalizeFileUrl(rawFile, 'First argument');
        const [commandArguments, options] = isPlainObject(rawArguments) ? [
            [],
            rawArguments
        ] : [
            rawArguments,
            rawOptions
        ];
        if (!Array.isArray(commandArguments)) throw new TypeError(`Second argument must be either an array of arguments or an options object: ${commandArguments}`);
        if (commandArguments.some((commandArgument)=>'object' == typeof commandArgument && null !== commandArgument)) throw new TypeError(`Second argument must be an array of strings: ${commandArguments}`);
        const normalizedArguments = commandArguments.map(String);
        const nullByteArgument = normalizedArguments.find((normalizedArgument)=>normalizedArgument.includes('\0'));
        if (void 0 !== nullByteArgument) throw new TypeError(`Arguments cannot contain null bytes ("\\0"): ${nullByteArgument}`);
        if (!isPlainObject(options)) throw new TypeError(`Last argument must be an options object: ${options}`);
        return [
            filePath,
            normalizedArguments,
            options
        ];
    };
    const external_node_child_process_namespaceObject = require("node:child_process");
    const external_node_string_decoder_namespaceObject = require("node:string_decoder");
    const { toString: objectToString } = Object.prototype;
    const isArrayBuffer = (value)=>'[object ArrayBuffer]' === objectToString.call(value);
    const isUint8Array = (value)=>'[object Uint8Array]' === objectToString.call(value);
    const bufferToUint8Array = (buffer)=>new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
    const uint_array_textEncoder = new TextEncoder();
    const stringToUint8Array = (string)=>uint_array_textEncoder.encode(string);
    const uint_array_textDecoder = new TextDecoder();
    const uint8ArrayToString = (uint8Array)=>uint_array_textDecoder.decode(uint8Array);
    const joinToString = (uint8ArraysOrStrings, encoding)=>{
        const strings = uint8ArraysToStrings(uint8ArraysOrStrings, encoding);
        return strings.join('');
    };
    const uint8ArraysToStrings = (uint8ArraysOrStrings, encoding)=>{
        if ('utf8' === encoding && uint8ArraysOrStrings.every((uint8ArrayOrString)=>'string' == typeof uint8ArrayOrString)) return uint8ArraysOrStrings;
        const decoder = new external_node_string_decoder_namespaceObject.StringDecoder(encoding);
        const strings = uint8ArraysOrStrings.map((uint8ArrayOrString)=>'string' == typeof uint8ArrayOrString ? stringToUint8Array(uint8ArrayOrString) : uint8ArrayOrString).map((uint8Array)=>decoder.write(uint8Array));
        const finalString = decoder.end();
        return '' === finalString ? strings : [
            ...strings,
            finalString
        ];
    };
    const joinToUint8Array = (uint8ArraysOrStrings)=>{
        if (1 === uint8ArraysOrStrings.length && isUint8Array(uint8ArraysOrStrings[0])) return uint8ArraysOrStrings[0];
        return concatUint8Arrays(stringsToUint8Arrays(uint8ArraysOrStrings));
    };
    const stringsToUint8Arrays = (uint8ArraysOrStrings)=>uint8ArraysOrStrings.map((uint8ArrayOrString)=>'string' == typeof uint8ArrayOrString ? stringToUint8Array(uint8ArrayOrString) : uint8ArrayOrString);
    const concatUint8Arrays = (uint8Arrays)=>{
        const result = new Uint8Array(getJoinLength(uint8Arrays));
        let index = 0;
        for (const uint8Array of uint8Arrays){
            result.set(uint8Array, index);
            index += uint8Array.length;
        }
        return result;
    };
    const getJoinLength = (uint8Arrays)=>{
        let joinLength = 0;
        for (const uint8Array of uint8Arrays)joinLength += uint8Array.length;
        return joinLength;
    };
    const isTemplateString = (templates)=>Array.isArray(templates) && Array.isArray(templates.raw);
    const parseTemplates = (templates, expressions)=>{
        let tokens = [];
        for (const [index, template] of templates.entries())tokens = parseTemplate({
            templates,
            expressions,
            tokens,
            index,
            template
        });
        if (0 === tokens.length) throw new TypeError("Template script must not be empty");
        const [file, ...commandArguments] = tokens;
        return [
            file,
            commandArguments,
            {}
        ];
    };
    const parseTemplate = ({ templates, expressions, tokens, index, template })=>{
        if (void 0 === template) throw new TypeError(`Invalid backslash sequence: ${templates.raw[index]}`);
        const { nextTokens, leadingWhitespaces, trailingWhitespaces } = splitByWhitespaces(template, templates.raw[index]);
        const newTokens = concatTokens(tokens, nextTokens, leadingWhitespaces);
        if (index === expressions.length) return newTokens;
        const expression = expressions[index];
        const expressionTokens = Array.isArray(expression) ? expression.map((expression)=>parseExpression(expression)) : [
            parseExpression(expression)
        ];
        return concatTokens(newTokens, expressionTokens, trailingWhitespaces);
    };
    const splitByWhitespaces = (template, rawTemplate)=>{
        if (0 === rawTemplate.length) return {
            nextTokens: [],
            leadingWhitespaces: false,
            trailingWhitespaces: false
        };
        const nextTokens = [];
        let templateStart = 0;
        const leadingWhitespaces = DELIMITERS.has(rawTemplate[0]);
        for(let templateIndex = 0, rawIndex = 0; templateIndex < template.length; templateIndex += 1, rawIndex += 1){
            const rawCharacter = rawTemplate[rawIndex];
            if (DELIMITERS.has(rawCharacter)) {
                if (templateStart !== templateIndex) nextTokens.push(template.slice(templateStart, templateIndex));
                templateStart = templateIndex + 1;
            } else if ('\\' === rawCharacter) {
                const nextRawCharacter = rawTemplate[rawIndex + 1];
                if ('\n' === nextRawCharacter) {
                    templateIndex -= 1;
                    rawIndex += 1;
                } else if ('u' === nextRawCharacter && '{' === rawTemplate[rawIndex + 2]) rawIndex = rawTemplate.indexOf('}', rawIndex + 3);
                else rawIndex += ESCAPE_LENGTH[nextRawCharacter] ?? 1;
            }
        }
        const trailingWhitespaces = templateStart === template.length;
        if (!trailingWhitespaces) nextTokens.push(template.slice(templateStart));
        return {
            nextTokens,
            leadingWhitespaces,
            trailingWhitespaces
        };
    };
    const DELIMITERS = new Set([
        ' ',
        '\t',
        '\r',
        '\n'
    ]);
    const ESCAPE_LENGTH = {
        x: 3,
        u: 5
    };
    const concatTokens = (tokens, nextTokens, isSeparated)=>isSeparated || 0 === tokens.length || 0 === nextTokens.length ? [
            ...tokens,
            ...nextTokens
        ] : [
            ...tokens.slice(0, -1),
            `${tokens.at(-1)}${nextTokens[0]}`,
            ...nextTokens.slice(1)
        ];
    const parseExpression = (expression)=>{
        const typeOfExpression = typeof expression;
        if ('string' === typeOfExpression) return expression;
        if ('number' === typeOfExpression) return String(expression);
        if (isPlainObject(expression) && ('stdout' in expression || 'isMaxBuffer' in expression)) return getSubprocessResult(expression);
        if (expression instanceof external_node_child_process_namespaceObject.ChildProcess || '[object Promise]' === Object.prototype.toString.call(expression)) throw new TypeError('Unexpected subprocess in template expression. Please use ${await subprocess} instead of ${subprocess}.');
        throw new TypeError(`Unexpected "${typeOfExpression}" in template expression`);
    };
    const getSubprocessResult = ({ stdout })=>{
        if ('string' == typeof stdout) return stdout;
        if (isUint8Array(stdout)) return uint8ArrayToString(stdout);
        if (void 0 === stdout) throw new TypeError('Missing result.stdout in template expression. This is probably due to the previous subprocess\' "stdout" option.');
        throw new TypeError(`Unexpected "${typeof stdout}" stdout in template expression`);
    };
    const external_node_util_namespaceObject = require("node:util");
    const external_node_process_namespaceObject = require("node:process");
    const isStandardStream = (stream)=>STANDARD_STREAMS.includes(stream);
    const STANDARD_STREAMS = [
        external_node_process_namespaceObject.stdin,
        external_node_process_namespaceObject.stdout,
        external_node_process_namespaceObject.stderr
    ];
    const STANDARD_STREAMS_ALIASES = [
        'stdin',
        'stdout',
        'stderr'
    ];
    const getStreamName = (fdNumber)=>STANDARD_STREAMS_ALIASES[fdNumber] ?? `stdio[${fdNumber}]`;
    const normalizeFdSpecificOptions = (options)=>{
        const optionsCopy = {
            ...options
        };
        for (const optionName of FD_SPECIFIC_OPTIONS)optionsCopy[optionName] = normalizeFdSpecificOption(options, optionName);
        return optionsCopy;
    };
    const normalizeFdSpecificOption = (options, optionName)=>{
        const optionBaseArray = Array.from({
            length: getStdioLength(options) + 1
        });
        const optionArray = normalizeFdSpecificValue(options[optionName], optionBaseArray, optionName);
        return addDefaultValue(optionArray, optionName);
    };
    const getStdioLength = ({ stdio })=>Array.isArray(stdio) ? Math.max(stdio.length, STANDARD_STREAMS_ALIASES.length) : STANDARD_STREAMS_ALIASES.length;
    const normalizeFdSpecificValue = (optionValue, optionArray, optionName)=>isPlainObject(optionValue) ? normalizeOptionObject(optionValue, optionArray, optionName) : optionArray.fill(optionValue);
    const normalizeOptionObject = (optionValue, optionArray, optionName)=>{
        for (const fdName of Object.keys(optionValue).sort(compareFdName))for (const fdNumber of parseFdName(fdName, optionName, optionArray))optionArray[fdNumber] = optionValue[fdName];
        return optionArray;
    };
    const compareFdName = (fdNameA, fdNameB)=>getFdNameOrder(fdNameA) < getFdNameOrder(fdNameB) ? 1 : -1;
    const getFdNameOrder = (fdName)=>{
        if ('stdout' === fdName || 'stderr' === fdName) return 0;
        return 'all' === fdName ? 2 : 1;
    };
    const parseFdName = (fdName, optionName, optionArray)=>{
        if ('ipc' === fdName) return [
            optionArray.length - 1
        ];
        const fdNumber = parseFd(fdName);
        if (void 0 === fdNumber || 0 === fdNumber) throw new TypeError(`"${optionName}.${fdName}" is invalid.
It must be "${optionName}.stdout", "${optionName}.stderr", "${optionName}.all", "${optionName}.ipc", or "${optionName}.fd3", "${optionName}.fd4" (and so on).`);
        if (fdNumber >= optionArray.length) throw new TypeError(`"${optionName}.${fdName}" is invalid: that file descriptor does not exist.
Please set the "stdio" option to ensure that file descriptor exists.`);
        return 'all' === fdNumber ? [
            1,
            2
        ] : [
            fdNumber
        ];
    };
    const parseFd = (fdName)=>{
        if ('all' === fdName) return fdName;
        if (STANDARD_STREAMS_ALIASES.includes(fdName)) return STANDARD_STREAMS_ALIASES.indexOf(fdName);
        const regexpResult = FD_REGEXP.exec(fdName);
        if (null !== regexpResult) return Number(regexpResult[1]);
    };
    const FD_REGEXP = /^fd(\d+)$/;
    const addDefaultValue = (optionArray, optionName)=>optionArray.map((optionValue)=>void 0 === optionValue ? DEFAULT_OPTIONS[optionName] : optionValue);
    const verboseDefault = (0, external_node_util_namespaceObject.debuglog)('execa').enabled ? 'full' : 'none';
    const DEFAULT_OPTIONS = {
        lines: false,
        buffer: true,
        maxBuffer: 100000000,
        verbose: verboseDefault,
        stripFinalNewline: true
    };
    const FD_SPECIFIC_OPTIONS = [
        'lines',
        'buffer',
        'maxBuffer',
        'verbose',
        'stripFinalNewline'
    ];
    const getFdSpecificValue = (optionArray, fdNumber)=>'ipc' === fdNumber ? optionArray.at(-1) : optionArray[fdNumber];
    const values_isVerbose = ({ verbose }, fdNumber)=>'none' !== getFdVerbose(verbose, fdNumber);
    const isFullVerbose = ({ verbose }, fdNumber)=>![
            'none',
            'short'
        ].includes(getFdVerbose(verbose, fdNumber));
    const getVerboseFunction = ({ verbose }, fdNumber)=>{
        const fdVerbose = getFdVerbose(verbose, fdNumber);
        return isVerboseFunction(fdVerbose) ? fdVerbose : void 0;
    };
    const getFdVerbose = (verbose, fdNumber)=>void 0 === fdNumber ? getFdGenericVerbose(verbose) : getFdSpecificValue(verbose, fdNumber);
    const getFdGenericVerbose = (verbose)=>verbose.find((fdVerbose)=>isVerboseFunction(fdVerbose)) ?? VERBOSE_VALUES.findLast((fdVerbose)=>verbose.includes(fdVerbose));
    const isVerboseFunction = (fdVerbose)=>'function' == typeof fdVerbose;
    const VERBOSE_VALUES = [
        'none',
        'short',
        'full'
    ];
    const joinCommand = (filePath, rawArguments)=>{
        const fileAndArguments = [
            filePath,
            ...rawArguments
        ];
        const command = fileAndArguments.join(' ');
        const escapedCommand = fileAndArguments.map((fileAndArgument)=>quoteString(escapeControlCharacters(fileAndArgument))).join(' ');
        return {
            command,
            escapedCommand
        };
    };
    const escapeLines = (lines)=>(0, external_node_util_namespaceObject.stripVTControlCharacters)(lines).split('\n').map((line)=>escapeControlCharacters(line)).join('\n');
    const escapeControlCharacters = (line)=>line.replaceAll(SPECIAL_CHAR_REGEXP, (character)=>escapeControlCharacter(character));
    const escapeControlCharacter = (character)=>{
        const commonEscape = COMMON_ESCAPES[character];
        if (void 0 !== commonEscape) return commonEscape;
        const codepoint = character.codePointAt(0);
        const codepointHex = codepoint.toString(16);
        return codepoint <= ASTRAL_START ? `\\u${codepointHex.padStart(4, '0')}` : `\\U${codepointHex}`;
    };
    const getSpecialCharRegExp = ()=>{
        try {
            return new RegExp('\\p{Separator}|\\p{Other}', 'gu');
        } catch  {
            return /[\s\u0000-\u001F\u007F-\u009F\u00AD]/g;
        }
    };
    const SPECIAL_CHAR_REGEXP = getSpecialCharRegExp();
    const COMMON_ESCAPES = {
        ' ': ' ',
        '\b': '\\b',
        '\f': '\\f',
        '\n': '\\n',
        '\r': '\\r',
        '\t': '\\t'
    };
    const ASTRAL_START = 65535;
    const quoteString = (escapedArgument)=>{
        if (NO_ESCAPE_REGEXP.test(escapedArgument)) return escapedArgument;
        return 'win32' === external_node_process_namespaceObject.platform ? `"${escapedArgument.replaceAll('"', '""')}"` : `'${escapedArgument.replaceAll('\'', '\'\\\'\'')}'`;
    };
    const NO_ESCAPE_REGEXP = /^[\w./-]+$/;
    function isUnicodeSupported() {
        const { env } = external_node_process_namespaceObject;
        const { TERM, TERM_PROGRAM } = env;
        if ('win32' !== external_node_process_namespaceObject.platform) return 'linux' !== TERM;
        return Boolean(env.WT_SESSION) || Boolean(env.TERMINUS_SUBLIME) || '{cmd::Cmder}' === env.ConEmuTask || 'Terminus-Sublime' === TERM_PROGRAM || 'vscode' === TERM_PROGRAM || 'xterm-256color' === TERM || 'alacritty' === TERM || 'rxvt-unicode' === TERM || 'rxvt-unicode-256color' === TERM || 'JetBrains-JediTerm' === env.TERMINAL_EMULATOR;
    }
    const common = {
        circleQuestionMark: '(?)',
        questionMarkPrefix: '(?)',
        square: '█',
        squareDarkShade: '▓',
        squareMediumShade: '▒',
        squareLightShade: '░',
        squareTop: '▀',
        squareBottom: '▄',
        squareLeft: '▌',
        squareRight: '▐',
        squareCenter: '■',
        bullet: '●',
        dot: '․',
        ellipsis: '…',
        pointerSmall: '›',
        triangleUp: '▲',
        triangleUpSmall: '▴',
        triangleDown: '▼',
        triangleDownSmall: '▾',
        triangleLeftSmall: '◂',
        triangleRightSmall: '▸',
        home: '⌂',
        heart: '♥',
        musicNote: '♪',
        musicNoteBeamed: '♫',
        arrowUp: '↑',
        arrowDown: '↓',
        arrowLeft: '←',
        arrowRight: '→',
        arrowLeftRight: '↔',
        arrowUpDown: '↕',
        almostEqual: '≈',
        notEqual: '≠',
        lessOrEqual: '≤',
        greaterOrEqual: '≥',
        identical: '≡',
        infinity: '∞',
        subscriptZero: '₀',
        subscriptOne: '₁',
        subscriptTwo: '₂',
        subscriptThree: '₃',
        subscriptFour: '₄',
        subscriptFive: '₅',
        subscriptSix: '₆',
        subscriptSeven: '₇',
        subscriptEight: '₈',
        subscriptNine: '₉',
        oneHalf: '½',
        oneThird: '⅓',
        oneQuarter: '¼',
        oneFifth: '⅕',
        oneSixth: '⅙',
        oneEighth: '⅛',
        twoThirds: '⅔',
        twoFifths: '⅖',
        threeQuarters: '¾',
        threeFifths: '⅗',
        threeEighths: '⅜',
        fourFifths: '⅘',
        fiveSixths: '⅚',
        fiveEighths: '⅝',
        sevenEighths: '⅞',
        line: '─',
        lineBold: '━',
        lineDouble: '═',
        lineDashed0: '┄',
        lineDashed1: '┅',
        lineDashed2: '┈',
        lineDashed3: '┉',
        lineDashed4: '╌',
        lineDashed5: '╍',
        lineDashed6: '╴',
        lineDashed7: '╶',
        lineDashed8: '╸',
        lineDashed9: '╺',
        lineDashed10: '╼',
        lineDashed11: '╾',
        lineDashed12: '−',
        lineDashed13: '–',
        lineDashed14: '‐',
        lineDashed15: '⁃',
        lineVertical: '│',
        lineVerticalBold: '┃',
        lineVerticalDouble: '║',
        lineVerticalDashed0: '┆',
        lineVerticalDashed1: '┇',
        lineVerticalDashed2: '┊',
        lineVerticalDashed3: '┋',
        lineVerticalDashed4: '╎',
        lineVerticalDashed5: '╏',
        lineVerticalDashed6: '╵',
        lineVerticalDashed7: '╷',
        lineVerticalDashed8: '╹',
        lineVerticalDashed9: '╻',
        lineVerticalDashed10: '╽',
        lineVerticalDashed11: '╿',
        lineDownLeft: '┐',
        lineDownLeftArc: '╮',
        lineDownBoldLeftBold: '┓',
        lineDownBoldLeft: '┒',
        lineDownLeftBold: '┑',
        lineDownDoubleLeftDouble: '╗',
        lineDownDoubleLeft: '╖',
        lineDownLeftDouble: '╕',
        lineDownRight: '┌',
        lineDownRightArc: '╭',
        lineDownBoldRightBold: '┏',
        lineDownBoldRight: '┎',
        lineDownRightBold: '┍',
        lineDownDoubleRightDouble: '╔',
        lineDownDoubleRight: '╓',
        lineDownRightDouble: '╒',
        lineUpLeft: '┘',
        lineUpLeftArc: '╯',
        lineUpBoldLeftBold: '┛',
        lineUpBoldLeft: '┚',
        lineUpLeftBold: '┙',
        lineUpDoubleLeftDouble: '╝',
        lineUpDoubleLeft: '╜',
        lineUpLeftDouble: '╛',
        lineUpRight: '└',
        lineUpRightArc: '╰',
        lineUpBoldRightBold: '┗',
        lineUpBoldRight: '┖',
        lineUpRightBold: '┕',
        lineUpDoubleRightDouble: '╚',
        lineUpDoubleRight: '╙',
        lineUpRightDouble: '╘',
        lineUpDownLeft: '┤',
        lineUpBoldDownBoldLeftBold: '┫',
        lineUpBoldDownBoldLeft: '┨',
        lineUpDownLeftBold: '┥',
        lineUpBoldDownLeftBold: '┩',
        lineUpDownBoldLeftBold: '┪',
        lineUpDownBoldLeft: '┧',
        lineUpBoldDownLeft: '┦',
        lineUpDoubleDownDoubleLeftDouble: '╣',
        lineUpDoubleDownDoubleLeft: '╢',
        lineUpDownLeftDouble: '╡',
        lineUpDownRight: '├',
        lineUpBoldDownBoldRightBold: '┣',
        lineUpBoldDownBoldRight: '┠',
        lineUpDownRightBold: '┝',
        lineUpBoldDownRightBold: '┡',
        lineUpDownBoldRightBold: '┢',
        lineUpDownBoldRight: '┟',
        lineUpBoldDownRight: '┞',
        lineUpDoubleDownDoubleRightDouble: '╠',
        lineUpDoubleDownDoubleRight: '╟',
        lineUpDownRightDouble: '╞',
        lineDownLeftRight: '┬',
        lineDownBoldLeftBoldRightBold: '┳',
        lineDownLeftBoldRightBold: '┯',
        lineDownBoldLeftRight: '┰',
        lineDownBoldLeftBoldRight: '┱',
        lineDownBoldLeftRightBold: '┲',
        lineDownLeftRightBold: '┮',
        lineDownLeftBoldRight: '┭',
        lineDownDoubleLeftDoubleRightDouble: '╦',
        lineDownDoubleLeftRight: '╥',
        lineDownLeftDoubleRightDouble: '╤',
        lineUpLeftRight: '┴',
        lineUpBoldLeftBoldRightBold: '┻',
        lineUpLeftBoldRightBold: '┷',
        lineUpBoldLeftRight: '┸',
        lineUpBoldLeftBoldRight: '┹',
        lineUpBoldLeftRightBold: '┺',
        lineUpLeftRightBold: '┶',
        lineUpLeftBoldRight: '┵',
        lineUpDoubleLeftDoubleRightDouble: '╩',
        lineUpDoubleLeftRight: '╨',
        lineUpLeftDoubleRightDouble: '╧',
        lineUpDownLeftRight: '┼',
        lineUpBoldDownBoldLeftBoldRightBold: '╋',
        lineUpDownBoldLeftBoldRightBold: '╈',
        lineUpBoldDownLeftBoldRightBold: '╇',
        lineUpBoldDownBoldLeftRightBold: '╊',
        lineUpBoldDownBoldLeftBoldRight: '╉',
        lineUpBoldDownLeftRight: '╀',
        lineUpDownBoldLeftRight: '╁',
        lineUpDownLeftBoldRight: '┽',
        lineUpDownLeftRightBold: '┾',
        lineUpBoldDownBoldLeftRight: '╂',
        lineUpDownLeftBoldRightBold: '┿',
        lineUpBoldDownLeftBoldRight: '╃',
        lineUpBoldDownLeftRightBold: '╄',
        lineUpDownBoldLeftBoldRight: '╅',
        lineUpDownBoldLeftRightBold: '╆',
        lineUpDoubleDownDoubleLeftDoubleRightDouble: '╬',
        lineUpDoubleDownDoubleLeftRight: '╫',
        lineUpDownLeftDoubleRightDouble: '╪',
        lineCross: '╳',
        lineBackslash: '╲',
        lineSlash: '╱'
    };
    const specialMainSymbols = {
        tick: '✔',
        info: 'ℹ',
        warning: '⚠',
        cross: '✘',
        squareSmall: '◻',
        squareSmallFilled: '◼',
        circle: '◯',
        circleFilled: '◉',
        circleDotted: '◌',
        circleDouble: '◎',
        circleCircle: 'ⓞ',
        circleCross: 'ⓧ',
        circlePipe: 'Ⓘ',
        radioOn: '◉',
        radioOff: '◯',
        checkboxOn: '☒',
        checkboxOff: '☐',
        checkboxCircleOn: 'ⓧ',
        checkboxCircleOff: 'Ⓘ',
        pointer: '❯',
        triangleUpOutline: '△',
        triangleLeft: '◀',
        triangleRight: '▶',
        lozenge: '◆',
        lozengeOutline: '◇',
        hamburger: '☰',
        smiley: '㋡',
        mustache: '෴',
        star: '★',
        play: '▶',
        nodejs: '⬢',
        oneSeventh: '⅐',
        oneNinth: '⅑',
        oneTenth: '⅒'
    };
    const specialFallbackSymbols = {
        tick: '√',
        info: 'i',
        warning: '‼',
        cross: '×',
        squareSmall: '□',
        squareSmallFilled: '■',
        circle: '( )',
        circleFilled: '(*)',
        circleDotted: '( )',
        circleDouble: '( )',
        circleCircle: '(○)',
        circleCross: '(×)',
        circlePipe: '(│)',
        radioOn: '(*)',
        radioOff: '( )',
        checkboxOn: '[×]',
        checkboxOff: '[ ]',
        checkboxCircleOn: '(×)',
        checkboxCircleOff: '( )',
        pointer: '>',
        triangleUpOutline: '∆',
        triangleLeft: '◄',
        triangleRight: '►',
        lozenge: '♦',
        lozengeOutline: '◊',
        hamburger: '≡',
        smiley: '☺',
        mustache: '┌─┐',
        star: '✶',
        play: '►',
        nodejs: '♦',
        oneSeventh: '1/7',
        oneNinth: '1/9',
        oneTenth: '1/10'
    };
    const mainSymbols = {
        ...common,
        ...specialMainSymbols
    };
    const fallbackSymbols = {
        ...common,
        ...specialFallbackSymbols
    };
    const shouldUseMain = isUnicodeSupported();
    const figures = shouldUseMain ? mainSymbols : fallbackSymbols;
    const node_modules_figures = figures;
    Object.entries(specialMainSymbols);
    const external_node_tty_namespaceObject = require("node:tty");
    const hasColors = external_node_tty_namespaceObject?.WriteStream?.prototype?.hasColors?.() ?? false;
    const format = (open, close)=>{
        if (!hasColors) return (input)=>input;
        const openCode = `\u001B[${open}m`;
        const closeCode = `\u001B[${close}m`;
        return (input)=>{
            const string = input + '';
            let index = string.indexOf(closeCode);
            if (-1 === index) return openCode + string + closeCode;
            let result = openCode;
            let lastIndex = 0;
            while(-1 !== index){
                result += string.slice(lastIndex, index) + openCode;
                lastIndex = index + closeCode.length;
                index = string.indexOf(closeCode, lastIndex);
            }
            result += string.slice(lastIndex) + closeCode;
            return result;
        };
    };
    format(0, 0);
    const bold = format(1, 22);
    format(2, 22);
    format(3, 23);
    format(4, 24);
    format(53, 55);
    format(7, 27);
    format(8, 28);
    format(9, 29);
    format(30, 39);
    format(31, 39);
    format(32, 39);
    format(33, 39);
    format(34, 39);
    format(35, 39);
    format(36, 39);
    format(37, 39);
    const gray = format(90, 39);
    format(40, 49);
    format(41, 49);
    format(42, 49);
    format(43, 49);
    format(44, 49);
    format(45, 49);
    format(46, 49);
    format(47, 49);
    format(100, 49);
    const redBright = format(91, 39);
    format(92, 39);
    const yellowBright = format(93, 39);
    format(94, 39);
    format(95, 39);
    format(96, 39);
    format(97, 39);
    format(101, 49);
    format(102, 49);
    format(103, 49);
    format(104, 49);
    format(105, 49);
    format(106, 49);
    format(107, 49);
    const defaultVerboseFunction = ({ type, message, timestamp, piped, commandId, result: { failed = false } = {}, options: { reject = true } })=>{
        const timestampString = serializeTimestamp(timestamp);
        const icon = ICONS[type]({
            failed,
            reject,
            piped
        });
        const color = COLORS[type]({
            reject
        });
        return `${gray(`[${timestampString}]`)} ${gray(`[${commandId}]`)} ${color(icon)} ${color(message)}`;
    };
    const serializeTimestamp = (timestamp)=>`${padField(timestamp.getHours(), 2)}:${padField(timestamp.getMinutes(), 2)}:${padField(timestamp.getSeconds(), 2)}.${padField(timestamp.getMilliseconds(), 3)}`;
    const padField = (field, padding)=>String(field).padStart(padding, '0');
    const getFinalIcon = ({ failed, reject })=>{
        if (!failed) return node_modules_figures.tick;
        return reject ? node_modules_figures.cross : node_modules_figures.warning;
    };
    const ICONS = {
        command: ({ piped })=>piped ? '|' : '$',
        output: ()=>' ',
        ipc: ()=>'*',
        error: getFinalIcon,
        duration: getFinalIcon
    };
    const identity = (string)=>string;
    const COLORS = {
        command: ()=>bold,
        output: ()=>identity,
        ipc: ()=>identity,
        error: ({ reject })=>reject ? redBright : yellowBright,
        duration: ()=>gray
    };
    const applyVerboseOnLines = (printedLines, verboseInfo, fdNumber)=>{
        const verboseFunction = getVerboseFunction(verboseInfo, fdNumber);
        return printedLines.map(({ verboseLine, verboseObject })=>applyVerboseFunction(verboseLine, verboseObject, verboseFunction)).filter((printedLine)=>void 0 !== printedLine).map((printedLine)=>appendNewline(printedLine)).join('');
    };
    const applyVerboseFunction = (verboseLine, verboseObject, verboseFunction)=>{
        if (void 0 === verboseFunction) return verboseLine;
        const printedLine = verboseFunction(verboseLine, verboseObject);
        if ('string' == typeof printedLine) return printedLine;
    };
    const appendNewline = (printedLine)=>printedLine.endsWith('\n') ? printedLine : `${printedLine}\n`;
    const verboseLog = ({ type, verboseMessage, fdNumber, verboseInfo, result })=>{
        const verboseObject = getVerboseObject({
            type,
            result,
            verboseInfo
        });
        const printedLines = getPrintedLines(verboseMessage, verboseObject);
        const finalLines = applyVerboseOnLines(printedLines, verboseInfo, fdNumber);
        if ('' !== finalLines) console.warn(finalLines.slice(0, -1));
    };
    const getVerboseObject = ({ type, result, verboseInfo: { escapedCommand, commandId, rawOptions: { piped = false, ...options } } })=>({
            type,
            escapedCommand,
            commandId: `${commandId}`,
            timestamp: new Date(),
            piped,
            result,
            options
        });
    const getPrintedLines = (verboseMessage, verboseObject)=>verboseMessage.split('\n').map((message)=>getPrintedLine({
                ...verboseObject,
                message
            }));
    const getPrintedLine = (verboseObject)=>{
        const verboseLine = defaultVerboseFunction(verboseObject);
        return {
            verboseLine,
            verboseObject
        };
    };
    const serializeVerboseMessage = (message)=>{
        const messageString = 'string' == typeof message ? message : (0, external_node_util_namespaceObject.inspect)(message);
        const escapedMessage = escapeLines(messageString);
        return escapedMessage.replaceAll('\t', ' '.repeat(TAB_SIZE));
    };
    const TAB_SIZE = 2;
    const logCommand = (escapedCommand, verboseInfo)=>{
        if (!values_isVerbose(verboseInfo)) return;
        verboseLog({
            type: 'command',
            verboseMessage: escapedCommand,
            verboseInfo
        });
    };
    const getVerboseInfo = (verbose, escapedCommand, rawOptions)=>{
        validateVerbose(verbose);
        const commandId = getCommandId(verbose);
        return {
            verbose,
            escapedCommand,
            commandId,
            rawOptions
        };
    };
    const getCommandId = (verbose)=>values_isVerbose({
            verbose
        }) ? COMMAND_ID++ : void 0;
    let COMMAND_ID = 0n;
    const validateVerbose = (verbose)=>{
        for (const fdVerbose of verbose){
            if (false === fdVerbose) throw new TypeError('The "verbose: false" option was renamed to "verbose: \'none\'".');
            if (true === fdVerbose) throw new TypeError('The "verbose: true" option was renamed to "verbose: \'short\'".');
            if (!VERBOSE_VALUES.includes(fdVerbose) && !isVerboseFunction(fdVerbose)) {
                const allowedValues = VERBOSE_VALUES.map((allowedValue)=>`'${allowedValue}'`).join(', ');
                throw new TypeError(`The "verbose" option must not be ${fdVerbose}. Allowed values are: ${allowedValues} or a function.`);
            }
        }
    };
    const getStartTime = ()=>external_node_process_namespaceObject.hrtime.bigint();
    const getDurationMs = (startTime)=>Number(external_node_process_namespaceObject.hrtime.bigint() - startTime) / 1e6;
    const handleCommand = (filePath, rawArguments, rawOptions)=>{
        const startTime = getStartTime();
        const { command, escapedCommand } = joinCommand(filePath, rawArguments);
        const verbose = normalizeFdSpecificOption(rawOptions, 'verbose');
        const verboseInfo = getVerboseInfo(verbose, escapedCommand, {
            ...rawOptions
        });
        logCommand(escapedCommand, verboseInfo);
        return {
            command,
            escapedCommand,
            startTime,
            verboseInfo
        };
    };
    var cross_spawn = __webpack_require__("../node_modules/.pnpm/cross-spawn@7.0.6/node_modules/cross-spawn/index.js");
    function pathKey(options = {}) {
        const { env = process.env, platform = process.platform } = options;
        if ('win32' !== platform) return 'PATH';
        return Object.keys(env).reverse().find((key)=>'PATH' === key.toUpperCase()) || 'Path';
    }
    (0, external_node_util_namespaceObject.promisify)(external_node_child_process_namespaceObject.execFile);
    function toPath(urlOrPath) {
        return urlOrPath instanceof URL ? (0, external_node_url_namespaceObject.fileURLToPath)(urlOrPath) : urlOrPath;
    }
    function traversePathUp(startPath) {
        return {
            *[Symbol.iterator] () {
                let currentPath = external_node_path_namespaceObject.resolve(toPath(startPath));
                let previousPath;
                while(previousPath !== currentPath){
                    yield currentPath;
                    previousPath = currentPath;
                    currentPath = external_node_path_namespaceObject.resolve(currentPath, '..');
                }
            }
        };
    }
    const npmRunPath = ({ cwd = external_node_process_namespaceObject.cwd(), path: pathOption = external_node_process_namespaceObject.env[pathKey()], preferLocal = true, execPath = external_node_process_namespaceObject.execPath, addExecPath = true } = {})=>{
        const cwdPath = external_node_path_namespaceObject.resolve(toPath(cwd));
        const result = [];
        const pathParts = pathOption.split(external_node_path_namespaceObject.delimiter);
        if (preferLocal) applyPreferLocal(result, pathParts, cwdPath);
        if (addExecPath) applyExecPath(result, pathParts, execPath, cwdPath);
        return '' === pathOption || pathOption === external_node_path_namespaceObject.delimiter ? `${result.join(external_node_path_namespaceObject.delimiter)}${pathOption}` : [
            ...result,
            pathOption
        ].join(external_node_path_namespaceObject.delimiter);
    };
    const applyPreferLocal = (result, pathParts, cwdPath)=>{
        for (const directory of traversePathUp(cwdPath)){
            const pathPart = external_node_path_namespaceObject.join(directory, 'node_modules/.bin');
            if (!pathParts.includes(pathPart)) result.push(pathPart);
        }
    };
    const applyExecPath = (result, pathParts, execPath, cwdPath)=>{
        const pathPart = external_node_path_namespaceObject.resolve(cwdPath, toPath(execPath), '..');
        if (!pathParts.includes(pathPart)) result.push(pathPart);
    };
    const npmRunPathEnv = ({ env = external_node_process_namespaceObject.env, ...options } = {})=>{
        env = {
            ...env
        };
        const pathName = pathKey({
            env
        });
        options.path = env[pathName];
        env[pathName] = npmRunPath(options);
        return env;
    };
    const promises_namespaceObject = require("node:timers/promises");
    const getFinalError = (originalError, message, isSync)=>{
        const ErrorClass = isSync ? ExecaSyncError : ExecaError;
        const options = originalError instanceof DiscardedError ? {} : {
            cause: originalError
        };
        return new ErrorClass(message, options);
    };
    class DiscardedError extends Error {
    }
    const setErrorName = (ErrorClass, value)=>{
        Object.defineProperty(ErrorClass.prototype, 'name', {
            value,
            writable: true,
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ErrorClass.prototype, execaErrorSymbol, {
            value: true,
            writable: false,
            enumerable: false,
            configurable: false
        });
    };
    const isExecaError = (error)=>isErrorInstance(error) && execaErrorSymbol in error;
    const execaErrorSymbol = Symbol('isExecaError');
    const isErrorInstance = (value)=>'[object Error]' === Object.prototype.toString.call(value);
    class ExecaError extends Error {
    }
    setErrorName(ExecaError, ExecaError.name);
    class ExecaSyncError extends Error {
    }
    setErrorName(ExecaSyncError, ExecaSyncError.name);
    const external_node_os_namespaceObject = require("node:os");
    const getRealtimeSignals = ()=>{
        const length = SIGRTMAX - SIGRTMIN + 1;
        return Array.from({
            length
        }, getRealtimeSignal);
    };
    const getRealtimeSignal = (value, index)=>({
            name: `SIGRT${index + 1}`,
            number: SIGRTMIN + index,
            action: "terminate",
            description: "Application-specific signal (realtime)",
            standard: "posix"
        });
    const SIGRTMIN = 34;
    const SIGRTMAX = 64;
    const SIGNALS = [
        {
            name: "SIGHUP",
            number: 1,
            action: "terminate",
            description: "Terminal closed",
            standard: "posix"
        },
        {
            name: "SIGINT",
            number: 2,
            action: "terminate",
            description: "User interruption with CTRL-C",
            standard: "ansi"
        },
        {
            name: "SIGQUIT",
            number: 3,
            action: "core",
            description: "User interruption with CTRL-\\",
            standard: "posix"
        },
        {
            name: "SIGILL",
            number: 4,
            action: "core",
            description: "Invalid machine instruction",
            standard: "ansi"
        },
        {
            name: "SIGTRAP",
            number: 5,
            action: "core",
            description: "Debugger breakpoint",
            standard: "posix"
        },
        {
            name: "SIGABRT",
            number: 6,
            action: "core",
            description: "Aborted",
            standard: "ansi"
        },
        {
            name: "SIGIOT",
            number: 6,
            action: "core",
            description: "Aborted",
            standard: "bsd"
        },
        {
            name: "SIGBUS",
            number: 7,
            action: "core",
            description: "Bus error due to misaligned, non-existing address or paging error",
            standard: "bsd"
        },
        {
            name: "SIGEMT",
            number: 7,
            action: "terminate",
            description: "Command should be emulated but is not implemented",
            standard: "other"
        },
        {
            name: "SIGFPE",
            number: 8,
            action: "core",
            description: "Floating point arithmetic error",
            standard: "ansi"
        },
        {
            name: "SIGKILL",
            number: 9,
            action: "terminate",
            description: "Forced termination",
            standard: "posix",
            forced: true
        },
        {
            name: "SIGUSR1",
            number: 10,
            action: "terminate",
            description: "Application-specific signal",
            standard: "posix"
        },
        {
            name: "SIGSEGV",
            number: 11,
            action: "core",
            description: "Segmentation fault",
            standard: "ansi"
        },
        {
            name: "SIGUSR2",
            number: 12,
            action: "terminate",
            description: "Application-specific signal",
            standard: "posix"
        },
        {
            name: "SIGPIPE",
            number: 13,
            action: "terminate",
            description: "Broken pipe or socket",
            standard: "posix"
        },
        {
            name: "SIGALRM",
            number: 14,
            action: "terminate",
            description: "Timeout or timer",
            standard: "posix"
        },
        {
            name: "SIGTERM",
            number: 15,
            action: "terminate",
            description: "Termination",
            standard: "ansi"
        },
        {
            name: "SIGSTKFLT",
            number: 16,
            action: "terminate",
            description: "Stack is empty or overflowed",
            standard: "other"
        },
        {
            name: "SIGCHLD",
            number: 17,
            action: "ignore",
            description: "Child process terminated, paused or unpaused",
            standard: "posix"
        },
        {
            name: "SIGCLD",
            number: 17,
            action: "ignore",
            description: "Child process terminated, paused or unpaused",
            standard: "other"
        },
        {
            name: "SIGCONT",
            number: 18,
            action: "unpause",
            description: "Unpaused",
            standard: "posix",
            forced: true
        },
        {
            name: "SIGSTOP",
            number: 19,
            action: "pause",
            description: "Paused",
            standard: "posix",
            forced: true
        },
        {
            name: "SIGTSTP",
            number: 20,
            action: "pause",
            description: "Paused using CTRL-Z or \"suspend\"",
            standard: "posix"
        },
        {
            name: "SIGTTIN",
            number: 21,
            action: "pause",
            description: "Background process cannot read terminal input",
            standard: "posix"
        },
        {
            name: "SIGBREAK",
            number: 21,
            action: "terminate",
            description: "User interruption with CTRL-BREAK",
            standard: "other"
        },
        {
            name: "SIGTTOU",
            number: 22,
            action: "pause",
            description: "Background process cannot write to terminal output",
            standard: "posix"
        },
        {
            name: "SIGURG",
            number: 23,
            action: "ignore",
            description: "Socket received out-of-band data",
            standard: "bsd"
        },
        {
            name: "SIGXCPU",
            number: 24,
            action: "core",
            description: "Process timed out",
            standard: "bsd"
        },
        {
            name: "SIGXFSZ",
            number: 25,
            action: "core",
            description: "File too big",
            standard: "bsd"
        },
        {
            name: "SIGVTALRM",
            number: 26,
            action: "terminate",
            description: "Timeout or timer",
            standard: "bsd"
        },
        {
            name: "SIGPROF",
            number: 27,
            action: "terminate",
            description: "Timeout or timer",
            standard: "bsd"
        },
        {
            name: "SIGWINCH",
            number: 28,
            action: "ignore",
            description: "Terminal window size changed",
            standard: "bsd"
        },
        {
            name: "SIGIO",
            number: 29,
            action: "terminate",
            description: "I/O is available",
            standard: "other"
        },
        {
            name: "SIGPOLL",
            number: 29,
            action: "terminate",
            description: "Watched event",
            standard: "other"
        },
        {
            name: "SIGINFO",
            number: 29,
            action: "ignore",
            description: "Request for process information",
            standard: "other"
        },
        {
            name: "SIGPWR",
            number: 30,
            action: "terminate",
            description: "Device running out of power",
            standard: "systemv"
        },
        {
            name: "SIGSYS",
            number: 31,
            action: "core",
            description: "Invalid system call",
            standard: "other"
        },
        {
            name: "SIGUNUSED",
            number: 31,
            action: "terminate",
            description: "Invalid system call",
            standard: "other"
        }
    ];
    const getSignals = ()=>{
        const realtimeSignals = getRealtimeSignals();
        const signals = [
            ...SIGNALS,
            ...realtimeSignals
        ].map(normalizeSignal);
        return signals;
    };
    const normalizeSignal = ({ name, number: defaultNumber, description, action, forced = false, standard })=>{
        const { signals: { [name]: constantSignal } } = external_node_os_namespaceObject.constants;
        const supported = void 0 !== constantSignal;
        const number = supported ? constantSignal : defaultNumber;
        return {
            name,
            number,
            description,
            supported,
            action,
            forced,
            standard
        };
    };
    const getSignalsByName = ()=>{
        const signals = getSignals();
        return Object.fromEntries(signals.map(getSignalByName));
    };
    const getSignalByName = ({ name, number, description, supported, action, forced, standard })=>[
            name,
            {
                name,
                number,
                description,
                supported,
                action,
                forced,
                standard
            }
        ];
    const signalsByName = getSignalsByName();
    const getSignalsByNumber = ()=>{
        const signals = getSignals();
        const length = SIGRTMAX + 1;
        const signalsA = Array.from({
            length
        }, (value, number)=>getSignalByNumber(number, signals));
        return Object.assign({}, ...signalsA);
    };
    const getSignalByNumber = (number, signals)=>{
        const signal = findSignalByNumber(number, signals);
        if (void 0 === signal) return {};
        const { name, description, supported, action, forced, standard } = signal;
        return {
            [number]: {
                name,
                number,
                description,
                supported,
                action,
                forced,
                standard
            }
        };
    };
    const findSignalByNumber = (number, signals)=>{
        const signal = signals.find(({ name })=>external_node_os_namespaceObject.constants.signals[name] === number);
        if (void 0 !== signal) return signal;
        return signals.find((signalA)=>signalA.number === number);
    };
    getSignalsByNumber();
    const normalizeKillSignal = (killSignal)=>{
        const optionName = 'option `killSignal`';
        if (0 === killSignal) throw new TypeError(`Invalid ${optionName}: 0 cannot be used.`);
        return signal_normalizeSignal(killSignal, optionName);
    };
    const normalizeSignalArgument = (signal)=>0 === signal ? signal : signal_normalizeSignal(signal, '`subprocess.kill()`\'s argument');
    const signal_normalizeSignal = (signalNameOrInteger, optionName)=>{
        if (Number.isInteger(signalNameOrInteger)) return normalizeSignalInteger(signalNameOrInteger, optionName);
        if ('string' == typeof signalNameOrInteger) return normalizeSignalName(signalNameOrInteger, optionName);
        throw new TypeError(`Invalid ${optionName} ${String(signalNameOrInteger)}: it must be a string or an integer.\n${getAvailableSignals()}`);
    };
    const normalizeSignalInteger = (signalInteger, optionName)=>{
        if (signalsIntegerToName.has(signalInteger)) return signalsIntegerToName.get(signalInteger);
        throw new TypeError(`Invalid ${optionName} ${signalInteger}: this signal integer does not exist.\n${getAvailableSignals()}`);
    };
    const getSignalsIntegerToName = ()=>new Map(Object.entries(external_node_os_namespaceObject.constants.signals).reverse().map(([signalName, signalInteger])=>[
                signalInteger,
                signalName
            ]));
    const signalsIntegerToName = getSignalsIntegerToName();
    const normalizeSignalName = (signalName, optionName)=>{
        if (signalName in external_node_os_namespaceObject.constants.signals) return signalName;
        if (signalName.toUpperCase() in external_node_os_namespaceObject.constants.signals) throw new TypeError(`Invalid ${optionName} '${signalName}': please rename it to '${signalName.toUpperCase()}'.`);
        throw new TypeError(`Invalid ${optionName} '${signalName}': this signal name does not exist.\n${getAvailableSignals()}`);
    };
    const getAvailableSignals = ()=>`Available signal names: ${getAvailableSignalNames()}.
Available signal numbers: ${getAvailableSignalIntegers()}.`;
    const getAvailableSignalNames = ()=>Object.keys(external_node_os_namespaceObject.constants.signals).sort().map((signalName)=>`'${signalName}'`).join(', ');
    const getAvailableSignalIntegers = ()=>[
            ...new Set(Object.values(external_node_os_namespaceObject.constants.signals).sort((signalInteger, signalIntegerTwo)=>signalInteger - signalIntegerTwo))
        ].join(', ');
    const getSignalDescription = (signal)=>signalsByName[signal].description;
    const normalizeForceKillAfterDelay = (forceKillAfterDelay)=>{
        if (false === forceKillAfterDelay) return forceKillAfterDelay;
        if (true === forceKillAfterDelay) return DEFAULT_FORCE_KILL_TIMEOUT;
        if (!Number.isFinite(forceKillAfterDelay) || forceKillAfterDelay < 0) throw new TypeError(`Expected the \`forceKillAfterDelay\` option to be a non-negative integer, got \`${forceKillAfterDelay}\` (${typeof forceKillAfterDelay})`);
        return forceKillAfterDelay;
    };
    const DEFAULT_FORCE_KILL_TIMEOUT = 5000;
    const subprocessKill = ({ kill, options: { forceKillAfterDelay, killSignal }, onInternalError, context, controller }, signalOrError, errorArgument)=>{
        const { signal, error } = parseKillArguments(signalOrError, errorArgument, killSignal);
        emitKillError(error, onInternalError);
        const killResult = kill(signal);
        setKillTimeout({
            kill,
            signal,
            forceKillAfterDelay,
            killSignal,
            killResult,
            context,
            controller
        });
        return killResult;
    };
    const parseKillArguments = (signalOrError, errorArgument, killSignal)=>{
        const [signal = killSignal, error] = isErrorInstance(signalOrError) ? [
            void 0,
            signalOrError
        ] : [
            signalOrError,
            errorArgument
        ];
        if ('string' != typeof signal && !Number.isInteger(signal)) throw new TypeError(`The first argument must be an error instance or a signal name string/integer: ${String(signal)}`);
        if (void 0 !== error && !isErrorInstance(error)) throw new TypeError(`The second argument is optional. If specified, it must be an error instance: ${error}`);
        return {
            signal: normalizeSignalArgument(signal),
            error
        };
    };
    const emitKillError = (error, onInternalError)=>{
        if (void 0 !== error) onInternalError.reject(error);
    };
    const setKillTimeout = async ({ kill, signal, forceKillAfterDelay, killSignal, killResult, context, controller })=>{
        if (signal === killSignal && killResult) killOnTimeout({
            kill,
            forceKillAfterDelay,
            context,
            controllerSignal: controller.signal
        });
    };
    const killOnTimeout = async ({ kill, forceKillAfterDelay, context, controllerSignal })=>{
        if (false === forceKillAfterDelay) return;
        try {
            await (0, promises_namespaceObject.setTimeout)(forceKillAfterDelay, void 0, {
                signal: controllerSignal
            });
            if (kill('SIGKILL')) context.isForcefullyTerminated ??= true;
        } catch  {}
    };
    const external_node_events_namespaceObject = require("node:events");
    const onAbortedSignal = async (mainSignal, stopSignal)=>{
        if (!mainSignal.aborted) await (0, external_node_events_namespaceObject.once)(mainSignal, 'abort', {
            signal: stopSignal
        });
    };
    const validateCancelSignal = ({ cancelSignal })=>{
        if (void 0 !== cancelSignal && '[object AbortSignal]' !== Object.prototype.toString.call(cancelSignal)) throw new Error(`The \`cancelSignal\` option must be an AbortSignal: ${String(cancelSignal)}`);
    };
    const throwOnCancel = ({ subprocess, cancelSignal, gracefulCancel, context, controller })=>void 0 === cancelSignal || gracefulCancel ? [] : [
            terminateOnCancel(subprocess, cancelSignal, context, controller)
        ];
    const terminateOnCancel = async (subprocess, cancelSignal, context, { signal })=>{
        await onAbortedSignal(cancelSignal, signal);
        context.terminationReason ??= 'cancel';
        subprocess.kill();
        throw cancelSignal.reason;
    };
    const validateIpcMethod = ({ methodName, isSubprocess, ipc, isConnected })=>{
        validateIpcOption(methodName, isSubprocess, ipc);
        validateConnection(methodName, isSubprocess, isConnected);
    };
    const validateIpcOption = (methodName, isSubprocess, ipc)=>{
        if (!ipc) throw new Error(`${getMethodName(methodName, isSubprocess)} can only be used if the \`ipc\` option is \`true\`.`);
    };
    const validateConnection = (methodName, isSubprocess, isConnected)=>{
        if (!isConnected) throw new Error(`${getMethodName(methodName, isSubprocess)} cannot be used: the ${getOtherProcessName(isSubprocess)} has already exited or disconnected.`);
    };
    const throwOnEarlyDisconnect = (isSubprocess)=>{
        throw new Error(`${getMethodName('getOneMessage', isSubprocess)} could not complete: the ${getOtherProcessName(isSubprocess)} exited or disconnected.`);
    };
    const throwOnStrictDeadlockError = (isSubprocess)=>{
        throw new Error(`${getMethodName('sendMessage', isSubprocess)} failed: the ${getOtherProcessName(isSubprocess)} is sending a message too, instead of listening to incoming messages.
This can be fixed by both sending a message and listening to incoming messages at the same time:

const [receivedMessage] = await Promise.all([
	${getMethodName('getOneMessage', isSubprocess)},
	${getMethodName('sendMessage', isSubprocess, 'message, {strict: true}')},
]);`);
    };
    const getStrictResponseError = (error, isSubprocess)=>new Error(`${getMethodName('sendMessage', isSubprocess)} failed when sending an acknowledgment response to the ${getOtherProcessName(isSubprocess)}.`, {
            cause: error
        });
    const throwOnMissingStrict = (isSubprocess)=>{
        throw new Error(`${getMethodName('sendMessage', isSubprocess)} failed: the ${getOtherProcessName(isSubprocess)} is not listening to incoming messages.`);
    };
    const throwOnStrictDisconnect = (isSubprocess)=>{
        throw new Error(`${getMethodName('sendMessage', isSubprocess)} failed: the ${getOtherProcessName(isSubprocess)} exited without listening to incoming messages.`);
    };
    const getAbortDisconnectError = ()=>new Error(`\`cancelSignal\` aborted: the ${getOtherProcessName(true)} disconnected.`);
    const throwOnMissingParent = ()=>{
        throw new Error('`getCancelSignal()` cannot be used without setting the `cancelSignal` subprocess option.');
    };
    const handleEpipeError = ({ error, methodName, isSubprocess })=>{
        if ('EPIPE' === error.code) throw new Error(`${getMethodName(methodName, isSubprocess)} cannot be used: the ${getOtherProcessName(isSubprocess)} is disconnecting.`, {
            cause: error
        });
    };
    const handleSerializationError = ({ error, methodName, isSubprocess, message })=>{
        if (isSerializationError(error)) throw new Error(`${getMethodName(methodName, isSubprocess)}'s argument type is invalid: the message cannot be serialized: ${String(message)}.`, {
            cause: error
        });
    };
    const isSerializationError = ({ code, message })=>SERIALIZATION_ERROR_CODES.has(code) || SERIALIZATION_ERROR_MESSAGES.some((serializationErrorMessage)=>message.includes(serializationErrorMessage));
    const SERIALIZATION_ERROR_CODES = new Set([
        'ERR_MISSING_ARGS',
        'ERR_INVALID_ARG_TYPE'
    ]);
    const SERIALIZATION_ERROR_MESSAGES = [
        'could not be cloned',
        'circular structure',
        'call stack size exceeded'
    ];
    const getMethodName = (methodName, isSubprocess, parameters = '')=>'cancelSignal' === methodName ? '`cancelSignal`\'s `controller.abort()`' : `${getNamespaceName(isSubprocess)}${methodName}(${parameters})`;
    const getNamespaceName = (isSubprocess)=>isSubprocess ? '' : 'subprocess.';
    const getOtherProcessName = (isSubprocess)=>isSubprocess ? 'parent process' : 'subprocess';
    const disconnect = (anyProcess)=>{
        if (anyProcess.connected) anyProcess.disconnect();
    };
    const createDeferred = ()=>{
        const methods = {};
        const promise = new Promise((resolve, reject)=>{
            Object.assign(methods, {
                resolve,
                reject
            });
        });
        return Object.assign(promise, methods);
    };
    const getToStream = (destination, to = 'stdin')=>{
        const isWritable = true;
        const { options, fileDescriptors } = SUBPROCESS_OPTIONS.get(destination);
        const fdNumber = getFdNumber(fileDescriptors, to, isWritable);
        const destinationStream = destination.stdio[fdNumber];
        if (null === destinationStream) throw new TypeError(getInvalidStdioOptionMessage(fdNumber, to, options, isWritable));
        return destinationStream;
    };
    const getFromStream = (source, from = 'stdout')=>{
        const isWritable = false;
        const { options, fileDescriptors } = SUBPROCESS_OPTIONS.get(source);
        const fdNumber = getFdNumber(fileDescriptors, from, isWritable);
        const sourceStream = 'all' === fdNumber ? source.all : source.stdio[fdNumber];
        if (null == sourceStream) throw new TypeError(getInvalidStdioOptionMessage(fdNumber, from, options, isWritable));
        return sourceStream;
    };
    const SUBPROCESS_OPTIONS = new WeakMap();
    const getFdNumber = (fileDescriptors, fdName, isWritable)=>{
        const fdNumber = parseFdNumber(fdName, isWritable);
        validateFdNumber(fdNumber, fdName, isWritable, fileDescriptors);
        return fdNumber;
    };
    const parseFdNumber = (fdName, isWritable)=>{
        const fdNumber = parseFd(fdName);
        if (void 0 !== fdNumber) return fdNumber;
        const { validOptions, defaultValue } = isWritable ? {
            validOptions: '"stdin"',
            defaultValue: 'stdin'
        } : {
            validOptions: '"stdout", "stderr", "all"',
            defaultValue: 'stdout'
        };
        throw new TypeError(`"${getOptionName(isWritable)}" must not be "${fdName}".
It must be ${validOptions} or "fd3", "fd4" (and so on).
It is optional and defaults to "${defaultValue}".`);
    };
    const validateFdNumber = (fdNumber, fdName, isWritable, fileDescriptors)=>{
        const fileDescriptor = fileDescriptors[getUsedDescriptor(fdNumber)];
        if (void 0 === fileDescriptor) throw new TypeError(`"${getOptionName(isWritable)}" must not be ${fdName}. That file descriptor does not exist.
Please set the "stdio" option to ensure that file descriptor exists.`);
        if ('input' === fileDescriptor.direction && !isWritable) throw new TypeError(`"${getOptionName(isWritable)}" must not be ${fdName}. It must be a readable stream, not writable.`);
        if ('input' !== fileDescriptor.direction && isWritable) throw new TypeError(`"${getOptionName(isWritable)}" must not be ${fdName}. It must be a writable stream, not readable.`);
    };
    const getInvalidStdioOptionMessage = (fdNumber, fdName, options, isWritable)=>{
        if ('all' === fdNumber && !options.all) return 'The "all" option must be true to use "from: \'all\'".';
        const { optionName, optionValue } = getInvalidStdioOption(fdNumber, options);
        return `The "${optionName}: ${serializeOptionValue(optionValue)}" option is incompatible with using "${getOptionName(isWritable)}: ${serializeOptionValue(fdName)}".
Please set this option with "pipe" instead.`;
    };
    const getInvalidStdioOption = (fdNumber, { stdin, stdout, stderr, stdio })=>{
        const usedDescriptor = getUsedDescriptor(fdNumber);
        if (0 === usedDescriptor && void 0 !== stdin) return {
            optionName: 'stdin',
            optionValue: stdin
        };
        if (1 === usedDescriptor && void 0 !== stdout) return {
            optionName: 'stdout',
            optionValue: stdout
        };
        if (2 === usedDescriptor && void 0 !== stderr) return {
            optionName: 'stderr',
            optionValue: stderr
        };
        return {
            optionName: `stdio[${usedDescriptor}]`,
            optionValue: stdio[usedDescriptor]
        };
    };
    const getUsedDescriptor = (fdNumber)=>'all' === fdNumber ? 1 : fdNumber;
    const getOptionName = (isWritable)=>isWritable ? 'to' : 'from';
    const serializeOptionValue = (value)=>{
        if ('string' == typeof value) return `'${value}'`;
        return 'number' == typeof value ? `${value}` : 'Stream';
    };
    const incrementMaxListeners = (eventEmitter, maxListenersIncrement, signal)=>{
        const maxListeners = eventEmitter.getMaxListeners();
        if (0 === maxListeners || maxListeners === Number.POSITIVE_INFINITY) return;
        eventEmitter.setMaxListeners(maxListeners + maxListenersIncrement);
        (0, external_node_events_namespaceObject.addAbortListener)(signal, ()=>{
            eventEmitter.setMaxListeners(eventEmitter.getMaxListeners() - maxListenersIncrement);
        });
    };
    const addReference = (channel, reference)=>{
        if (reference) addReferenceCount(channel);
    };
    const addReferenceCount = (channel)=>{
        channel.refCounted();
    };
    const removeReference = (channel, reference)=>{
        if (reference) removeReferenceCount(channel);
    };
    const removeReferenceCount = (channel)=>{
        channel.unrefCounted();
    };
    const undoAddedReferences = (channel, isSubprocess)=>{
        if (isSubprocess) {
            removeReferenceCount(channel);
            removeReferenceCount(channel);
        }
    };
    const redoAddedReferences = (channel, isSubprocess)=>{
        if (isSubprocess) {
            addReferenceCount(channel);
            addReferenceCount(channel);
        }
    };
    const onMessage = async ({ anyProcess, channel, isSubprocess, ipcEmitter }, wrappedMessage)=>{
        if (handleStrictResponse(wrappedMessage) || handleAbort(wrappedMessage)) return;
        if (!INCOMING_MESSAGES.has(anyProcess)) INCOMING_MESSAGES.set(anyProcess, []);
        const incomingMessages = INCOMING_MESSAGES.get(anyProcess);
        incomingMessages.push(wrappedMessage);
        if (incomingMessages.length > 1) return;
        while(incomingMessages.length > 0){
            await waitForOutgoingMessages(anyProcess, ipcEmitter, wrappedMessage);
            await promises_namespaceObject.scheduler["yield"]();
            const message = await handleStrictRequest({
                wrappedMessage: incomingMessages[0],
                anyProcess,
                channel,
                isSubprocess,
                ipcEmitter
            });
            incomingMessages.shift();
            ipcEmitter.emit('message', message);
            ipcEmitter.emit('message:done');
        }
    };
    const onDisconnect = async ({ anyProcess, channel, isSubprocess, ipcEmitter, boundOnMessage })=>{
        abortOnDisconnect();
        const incomingMessages = INCOMING_MESSAGES.get(anyProcess);
        while(incomingMessages?.length > 0)await (0, external_node_events_namespaceObject.once)(ipcEmitter, 'message:done');
        anyProcess.removeListener('message', boundOnMessage);
        redoAddedReferences(channel, isSubprocess);
        ipcEmitter.connected = false;
        ipcEmitter.emit('disconnect');
    };
    const INCOMING_MESSAGES = new WeakMap();
    const getIpcEmitter = (anyProcess, channel, isSubprocess)=>{
        if (IPC_EMITTERS.has(anyProcess)) return IPC_EMITTERS.get(anyProcess);
        const ipcEmitter = new external_node_events_namespaceObject.EventEmitter();
        ipcEmitter.connected = true;
        IPC_EMITTERS.set(anyProcess, ipcEmitter);
        forwardEvents({
            ipcEmitter,
            anyProcess,
            channel,
            isSubprocess
        });
        return ipcEmitter;
    };
    const IPC_EMITTERS = new WeakMap();
    const forwardEvents = ({ ipcEmitter, anyProcess, channel, isSubprocess })=>{
        const boundOnMessage = onMessage.bind(void 0, {
            anyProcess,
            channel,
            isSubprocess,
            ipcEmitter
        });
        anyProcess.on('message', boundOnMessage);
        anyProcess.once('disconnect', onDisconnect.bind(void 0, {
            anyProcess,
            channel,
            isSubprocess,
            ipcEmitter,
            boundOnMessage
        }));
        undoAddedReferences(channel, isSubprocess);
    };
    const forward_isConnected = (anyProcess)=>{
        const ipcEmitter = IPC_EMITTERS.get(anyProcess);
        return void 0 === ipcEmitter ? null !== anyProcess.channel : ipcEmitter.connected;
    };
    const handleSendStrict = ({ anyProcess, channel, isSubprocess, message, strict })=>{
        if (!strict) return message;
        const ipcEmitter = getIpcEmitter(anyProcess, channel, isSubprocess);
        const hasListeners = hasMessageListeners(anyProcess, ipcEmitter);
        return {
            id: strict_count++,
            type: REQUEST_TYPE,
            message,
            hasListeners
        };
    };
    let strict_count = 0n;
    const validateStrictDeadlock = (outgoingMessages, wrappedMessage)=>{
        if (wrappedMessage?.type !== REQUEST_TYPE || wrappedMessage.hasListeners) return;
        for (const { id } of outgoingMessages)if (void 0 !== id) STRICT_RESPONSES[id].resolve({
            isDeadlock: true,
            hasListeners: false
        });
    };
    const handleStrictRequest = async ({ wrappedMessage, anyProcess, channel, isSubprocess, ipcEmitter })=>{
        if (wrappedMessage?.type !== REQUEST_TYPE || !anyProcess.connected) return wrappedMessage;
        const { id, message } = wrappedMessage;
        const response = {
            id,
            type: RESPONSE_TYPE,
            message: hasMessageListeners(anyProcess, ipcEmitter)
        };
        try {
            await sendMessage({
                anyProcess,
                channel,
                isSubprocess,
                ipc: true
            }, response);
        } catch (error) {
            ipcEmitter.emit('strict:error', error);
        }
        return message;
    };
    const handleStrictResponse = (wrappedMessage)=>{
        if (wrappedMessage?.type !== RESPONSE_TYPE) return false;
        const { id, message: hasListeners } = wrappedMessage;
        STRICT_RESPONSES[id]?.resolve({
            isDeadlock: false,
            hasListeners
        });
        return true;
    };
    const waitForStrictResponse = async (wrappedMessage, anyProcess, isSubprocess)=>{
        if (wrappedMessage?.type !== REQUEST_TYPE) return;
        const deferred = createDeferred();
        STRICT_RESPONSES[wrappedMessage.id] = deferred;
        const controller = new AbortController();
        try {
            const { isDeadlock, hasListeners } = await Promise.race([
                deferred,
                throwOnDisconnect(anyProcess, isSubprocess, controller)
            ]);
            if (isDeadlock) throwOnStrictDeadlockError(isSubprocess);
            if (!hasListeners) throwOnMissingStrict(isSubprocess);
        } finally{
            controller.abort();
            delete STRICT_RESPONSES[wrappedMessage.id];
        }
    };
    const STRICT_RESPONSES = {};
    const throwOnDisconnect = async (anyProcess, isSubprocess, { signal })=>{
        incrementMaxListeners(anyProcess, 1, signal);
        await (0, external_node_events_namespaceObject.once)(anyProcess, 'disconnect', {
            signal
        });
        throwOnStrictDisconnect(isSubprocess);
    };
    const REQUEST_TYPE = 'execa:ipc:request';
    const RESPONSE_TYPE = 'execa:ipc:response';
    const startSendMessage = (anyProcess, wrappedMessage, strict)=>{
        if (!OUTGOING_MESSAGES.has(anyProcess)) OUTGOING_MESSAGES.set(anyProcess, new Set());
        const outgoingMessages = OUTGOING_MESSAGES.get(anyProcess);
        const onMessageSent = createDeferred();
        const id = strict ? wrappedMessage.id : void 0;
        const outgoingMessage = {
            onMessageSent,
            id
        };
        outgoingMessages.add(outgoingMessage);
        return {
            outgoingMessages,
            outgoingMessage
        };
    };
    const endSendMessage = ({ outgoingMessages, outgoingMessage })=>{
        outgoingMessages.delete(outgoingMessage);
        outgoingMessage.onMessageSent.resolve();
    };
    const waitForOutgoingMessages = async (anyProcess, ipcEmitter, wrappedMessage)=>{
        while(!hasMessageListeners(anyProcess, ipcEmitter) && OUTGOING_MESSAGES.get(anyProcess)?.size > 0){
            const outgoingMessages = [
                ...OUTGOING_MESSAGES.get(anyProcess)
            ];
            validateStrictDeadlock(outgoingMessages, wrappedMessage);
            await Promise.all(outgoingMessages.map(({ onMessageSent })=>onMessageSent));
        }
    };
    const OUTGOING_MESSAGES = new WeakMap();
    const hasMessageListeners = (anyProcess, ipcEmitter)=>ipcEmitter.listenerCount('message') > getMinListenerCount(anyProcess);
    const getMinListenerCount = (anyProcess)=>SUBPROCESS_OPTIONS.has(anyProcess) && !getFdSpecificValue(SUBPROCESS_OPTIONS.get(anyProcess).options.buffer, 'ipc') ? 1 : 0;
    const sendMessage = ({ anyProcess, channel, isSubprocess, ipc }, message, { strict = false } = {})=>{
        const methodName = 'sendMessage';
        validateIpcMethod({
            methodName,
            isSubprocess,
            ipc,
            isConnected: anyProcess.connected
        });
        return sendMessageAsync({
            anyProcess,
            channel,
            methodName,
            isSubprocess,
            message,
            strict
        });
    };
    const sendMessageAsync = async ({ anyProcess, channel, methodName, isSubprocess, message, strict })=>{
        const wrappedMessage = handleSendStrict({
            anyProcess,
            channel,
            isSubprocess,
            message,
            strict
        });
        const outgoingMessagesState = startSendMessage(anyProcess, wrappedMessage, strict);
        try {
            await sendOneMessage({
                anyProcess,
                methodName,
                isSubprocess,
                wrappedMessage,
                message
            });
        } catch (error) {
            disconnect(anyProcess);
            throw error;
        } finally{
            endSendMessage(outgoingMessagesState);
        }
    };
    const sendOneMessage = async ({ anyProcess, methodName, isSubprocess, wrappedMessage, message })=>{
        const sendMethod = getSendMethod(anyProcess);
        try {
            await Promise.all([
                waitForStrictResponse(wrappedMessage, anyProcess, isSubprocess),
                sendMethod(wrappedMessage)
            ]);
        } catch (error) {
            handleEpipeError({
                error,
                methodName,
                isSubprocess
            });
            handleSerializationError({
                error,
                methodName,
                isSubprocess,
                message
            });
            throw error;
        }
    };
    const getSendMethod = (anyProcess)=>{
        if (PROCESS_SEND_METHODS.has(anyProcess)) return PROCESS_SEND_METHODS.get(anyProcess);
        const sendMethod = (0, external_node_util_namespaceObject.promisify)(anyProcess.send.bind(anyProcess));
        PROCESS_SEND_METHODS.set(anyProcess, sendMethod);
        return sendMethod;
    };
    const PROCESS_SEND_METHODS = new WeakMap();
    const sendAbort = (subprocess, message)=>{
        const methodName = 'cancelSignal';
        validateConnection(methodName, false, subprocess.connected);
        return sendOneMessage({
            anyProcess: subprocess,
            methodName,
            isSubprocess: false,
            wrappedMessage: {
                type: GRACEFUL_CANCEL_TYPE,
                message
            },
            message
        });
    };
    const getCancelSignal = async ({ anyProcess, channel, isSubprocess, ipc })=>{
        await startIpc({
            anyProcess,
            channel,
            isSubprocess,
            ipc
        });
        return cancelController.signal;
    };
    const startIpc = async ({ anyProcess, channel, isSubprocess, ipc })=>{
        if (cancelListening) return;
        cancelListening = true;
        if (!ipc) {
            throwOnMissingParent();
            return;
        }
        if (null === channel) {
            abortOnDisconnect();
            return;
        }
        getIpcEmitter(anyProcess, channel, isSubprocess);
        await promises_namespaceObject.scheduler["yield"]();
    };
    let cancelListening = false;
    const handleAbort = (wrappedMessage)=>{
        if (wrappedMessage?.type !== GRACEFUL_CANCEL_TYPE) return false;
        cancelController.abort(wrappedMessage.message);
        return true;
    };
    const GRACEFUL_CANCEL_TYPE = 'execa:ipc:cancel';
    const abortOnDisconnect = ()=>{
        cancelController.abort(getAbortDisconnectError());
    };
    const cancelController = new AbortController();
    const validateGracefulCancel = ({ gracefulCancel, cancelSignal, ipc, serialization })=>{
        if (!gracefulCancel) return;
        if (void 0 === cancelSignal) throw new Error('The `cancelSignal` option must be defined when setting the `gracefulCancel` option.');
        if (!ipc) throw new Error('The `ipc` option cannot be false when setting the `gracefulCancel` option.');
        if ('json' === serialization) throw new Error('The `serialization` option cannot be \'json\' when setting the `gracefulCancel` option.');
    };
    const throwOnGracefulCancel = ({ subprocess, cancelSignal, gracefulCancel, forceKillAfterDelay, context, controller })=>gracefulCancel ? [
            sendOnAbort({
                subprocess,
                cancelSignal,
                forceKillAfterDelay,
                context,
                controller
            })
        ] : [];
    const sendOnAbort = async ({ subprocess, cancelSignal, forceKillAfterDelay, context, controller: { signal } })=>{
        await onAbortedSignal(cancelSignal, signal);
        const reason = getReason(cancelSignal);
        await sendAbort(subprocess, reason);
        killOnTimeout({
            kill: subprocess.kill,
            forceKillAfterDelay,
            context,
            controllerSignal: signal
        });
        context.terminationReason ??= 'gracefulCancel';
        throw cancelSignal.reason;
    };
    const getReason = ({ reason })=>{
        if (!(reason instanceof DOMException)) return reason;
        const error = new Error(reason.message);
        Object.defineProperty(error, 'stack', {
            value: reason.stack,
            enumerable: false,
            configurable: true,
            writable: true
        });
        return error;
    };
    const validateTimeout = ({ timeout })=>{
        if (void 0 !== timeout && (!Number.isFinite(timeout) || timeout < 0)) throw new TypeError(`Expected the \`timeout\` option to be a non-negative integer, got \`${timeout}\` (${typeof timeout})`);
    };
    const throwOnTimeout = (subprocess, timeout, context, controller)=>0 === timeout || void 0 === timeout ? [] : [
            killAfterTimeout(subprocess, timeout, context, controller)
        ];
    const killAfterTimeout = async (subprocess, timeout, context, { signal })=>{
        await (0, promises_namespaceObject.setTimeout)(timeout, void 0, {
            signal
        });
        context.terminationReason ??= 'timeout';
        subprocess.kill();
        throw new DiscardedError();
    };
    const mapNode = ({ options })=>{
        if (false === options.node) throw new TypeError('The "node" option cannot be false with `execaNode()`.');
        return {
            options: {
                ...options,
                node: true
            }
        };
    };
    const handleNodeOption = (file, commandArguments, { node: shouldHandleNode = false, nodePath = external_node_process_namespaceObject.execPath, nodeOptions = external_node_process_namespaceObject.execArgv.filter((nodeOption)=>!nodeOption.startsWith('--inspect')), cwd, execPath: formerNodePath, ...options })=>{
        if (void 0 !== formerNodePath) throw new TypeError('The "execPath" option has been removed. Please use the "nodePath" option instead.');
        const normalizedNodePath = safeNormalizeFileUrl(nodePath, 'The "nodePath" option');
        const resolvedNodePath = external_node_path_namespaceObject.resolve(cwd, normalizedNodePath);
        const newOptions = {
            ...options,
            nodePath: resolvedNodePath,
            node: shouldHandleNode,
            cwd
        };
        if (!shouldHandleNode) return [
            file,
            commandArguments,
            newOptions
        ];
        if ('node' === external_node_path_namespaceObject.basename(file, '.exe')) throw new TypeError('When the "node" option is true, the first argument does not need to be "node".');
        return [
            resolvedNodePath,
            [
                ...nodeOptions,
                file,
                ...commandArguments
            ],
            {
                ipc: true,
                ...newOptions,
                shell: false
            }
        ];
    };
    const external_node_v8_namespaceObject = require("node:v8");
    const validateIpcInputOption = ({ ipcInput, ipc, serialization })=>{
        if (void 0 === ipcInput) return;
        if (!ipc) throw new Error('The `ipcInput` option cannot be set unless the `ipc` option is `true`.');
        validateIpcInput[serialization](ipcInput);
    };
    const validateAdvancedInput = (ipcInput)=>{
        try {
            (0, external_node_v8_namespaceObject.serialize)(ipcInput);
        } catch (error) {
            throw new Error('The `ipcInput` option is not serializable with a structured clone.', {
                cause: error
            });
        }
    };
    const validateJsonInput = (ipcInput)=>{
        try {
            JSON.stringify(ipcInput);
        } catch (error) {
            throw new Error('The `ipcInput` option is not serializable with JSON.', {
                cause: error
            });
        }
    };
    const validateIpcInput = {
        advanced: validateAdvancedInput,
        json: validateJsonInput
    };
    const sendIpcInput = async (subprocess, ipcInput)=>{
        if (void 0 === ipcInput) return;
        await subprocess.sendMessage(ipcInput);
    };
    const validateEncoding = ({ encoding })=>{
        if (ENCODINGS.has(encoding)) return;
        const correctEncoding = getCorrectEncoding(encoding);
        if (void 0 !== correctEncoding) throw new TypeError(`Invalid option \`encoding: ${serializeEncoding(encoding)}\`.
Please rename it to ${serializeEncoding(correctEncoding)}.`);
        const correctEncodings = [
            ...ENCODINGS
        ].map((correctEncoding)=>serializeEncoding(correctEncoding)).join(', ');
        throw new TypeError(`Invalid option \`encoding: ${serializeEncoding(encoding)}\`.
Please rename it to one of: ${correctEncodings}.`);
    };
    const TEXT_ENCODINGS = new Set([
        'utf8',
        'utf16le'
    ]);
    const BINARY_ENCODINGS = new Set([
        'buffer',
        'hex',
        'base64',
        'base64url',
        'latin1',
        'ascii'
    ]);
    const ENCODINGS = new Set([
        ...TEXT_ENCODINGS,
        ...BINARY_ENCODINGS
    ]);
    const getCorrectEncoding = (encoding)=>{
        if (null === encoding) return 'buffer';
        if ('string' != typeof encoding) return;
        const lowerEncoding = encoding.toLowerCase();
        if (lowerEncoding in ENCODING_ALIASES) return ENCODING_ALIASES[lowerEncoding];
        if (ENCODINGS.has(lowerEncoding)) return lowerEncoding;
    };
    const ENCODING_ALIASES = {
        'utf-8': 'utf8',
        'utf-16le': 'utf16le',
        'ucs-2': 'utf16le',
        ucs2: 'utf16le',
        binary: 'latin1'
    };
    const serializeEncoding = (encoding)=>'string' == typeof encoding ? `"${encoding}"` : String(encoding);
    const external_node_fs_namespaceObject = require("node:fs");
    const normalizeCwd = (cwd = getDefaultCwd())=>{
        const cwdString = safeNormalizeFileUrl(cwd, 'The "cwd" option');
        return external_node_path_namespaceObject.resolve(cwdString);
    };
    const getDefaultCwd = ()=>{
        try {
            return external_node_process_namespaceObject.cwd();
        } catch (error) {
            error.message = `The current directory does not exist.\n${error.message}`;
            throw error;
        }
    };
    const fixCwdError = (originalMessage, cwd)=>{
        if (cwd === getDefaultCwd()) return originalMessage;
        let cwdStat;
        try {
            cwdStat = (0, external_node_fs_namespaceObject.statSync)(cwd);
        } catch (error) {
            return `The "cwd" option is invalid: ${cwd}.\n${error.message}\n${originalMessage}`;
        }
        if (!cwdStat.isDirectory()) return `The "cwd" option is not a directory: ${cwd}.\n${originalMessage}`;
        return originalMessage;
    };
    const normalizeOptions = (filePath, rawArguments, rawOptions)=>{
        rawOptions.cwd = normalizeCwd(rawOptions.cwd);
        const [processedFile, processedArguments, processedOptions] = handleNodeOption(filePath, rawArguments, rawOptions);
        const { command: file, args: commandArguments, options: initialOptions } = cross_spawn._parse(processedFile, processedArguments, processedOptions);
        const fdOptions = normalizeFdSpecificOptions(initialOptions);
        const options = addDefaultOptions(fdOptions);
        validateTimeout(options);
        validateEncoding(options);
        validateIpcInputOption(options);
        validateCancelSignal(options);
        validateGracefulCancel(options);
        options.shell = normalizeFileUrl(options.shell);
        options.env = getEnv(options);
        options.killSignal = normalizeKillSignal(options.killSignal);
        options.forceKillAfterDelay = normalizeForceKillAfterDelay(options.forceKillAfterDelay);
        options.lines = options.lines.map((lines, fdNumber)=>lines && !BINARY_ENCODINGS.has(options.encoding) && options.buffer[fdNumber]);
        if ('win32' === external_node_process_namespaceObject.platform && 'cmd' === external_node_path_namespaceObject.basename(file, '.exe')) commandArguments.unshift('/q');
        return {
            file,
            commandArguments,
            options
        };
    };
    const addDefaultOptions = ({ extendEnv = true, preferLocal = false, cwd, localDir: localDirectory = cwd, encoding = 'utf8', reject = true, cleanup = true, all = false, windowsHide = true, killSignal = 'SIGTERM', forceKillAfterDelay = true, gracefulCancel = false, ipcInput, ipc = void 0 !== ipcInput || gracefulCancel, serialization = 'advanced', ...options })=>({
            ...options,
            extendEnv,
            preferLocal,
            cwd,
            localDirectory,
            encoding,
            reject,
            cleanup,
            all,
            windowsHide,
            killSignal,
            forceKillAfterDelay,
            gracefulCancel,
            ipcInput,
            ipc,
            serialization
        });
    const getEnv = ({ env: envOption, extendEnv, preferLocal, node, localDirectory, nodePath })=>{
        const env = extendEnv ? {
            ...external_node_process_namespaceObject.env,
            ...envOption
        } : envOption;
        if (preferLocal || node) return npmRunPathEnv({
            env,
            cwd: localDirectory,
            execPath: nodePath,
            preferLocal,
            addExecPath: node
        });
        return env;
    };
    function strip_final_newline_stripFinalNewline(input) {
        if ('string' == typeof input) return stripFinalNewlineString(input);
        if (!(ArrayBuffer.isView(input) && 1 === input.BYTES_PER_ELEMENT)) throw new Error('Input must be a string or a Uint8Array');
        return stripFinalNewlineBinary(input);
    }
    const stripFinalNewlineString = (input)=>input.at(-1) === strip_final_newline_LF ? input.slice(0, input.at(-2) === CR ? -2 : -1) : input;
    const stripFinalNewlineBinary = (input)=>input.at(-1) === LF_BINARY ? input.subarray(0, input.at(-2) === CR_BINARY ? -2 : -1) : input;
    const strip_final_newline_LF = '\n';
    const LF_BINARY = strip_final_newline_LF.codePointAt(0);
    const CR = '\r';
    const CR_BINARY = CR.codePointAt(0);
    function isStream(stream, { checkOpen = true } = {}) {
        return null !== stream && 'object' == typeof stream && (stream.writable || stream.readable || !checkOpen || void 0 === stream.writable && void 0 === stream.readable) && 'function' == typeof stream.pipe;
    }
    function isWritableStream(stream, { checkOpen = true } = {}) {
        return isStream(stream, {
            checkOpen
        }) && (stream.writable || !checkOpen) && 'function' == typeof stream.write && 'function' == typeof stream.end && 'boolean' == typeof stream.writable && 'boolean' == typeof stream.writableObjectMode && 'function' == typeof stream.destroy && 'boolean' == typeof stream.destroyed;
    }
    function isReadableStream(stream, { checkOpen = true } = {}) {
        return isStream(stream, {
            checkOpen
        }) && (stream.readable || !checkOpen) && 'function' == typeof stream.read && 'boolean' == typeof stream.readable && 'boolean' == typeof stream.readableObjectMode && 'function' == typeof stream.destroy && 'boolean' == typeof stream.destroyed;
    }
    function isDuplexStream(stream, options) {
        return isWritableStream(stream, options) && isReadableStream(stream, options);
    }
    const asyncIterator_a = Object.getPrototypeOf(Object.getPrototypeOf(async function*() {}).prototype);
    class c {
        #t;
        #n;
        #r = !1;
        #e = void 0;
        constructor(e, t){
            this.#t = e, this.#n = t;
        }
        next() {
            const e = ()=>this.#s();
            return this.#e = this.#e ? this.#e.then(e, e) : e(), this.#e;
        }
        return(e) {
            const t = ()=>this.#i(e);
            return this.#e ? this.#e.then(t, t) : t();
        }
        async #s() {
            if (this.#r) return {
                done: !0,
                value: void 0
            };
            let e;
            try {
                e = await this.#t.read();
            } catch (t) {
                throw this.#e = void 0, this.#r = !0, this.#t.releaseLock(), t;
            }
            return e.done && (this.#e = void 0, this.#r = !0, this.#t.releaseLock()), e;
        }
        async #i(e) {
            if (this.#r) return {
                done: !0,
                value: e
            };
            if (this.#r = !0, !this.#n) {
                const t = this.#t.cancel(e);
                return this.#t.releaseLock(), await t, {
                    done: !0,
                    value: e
                };
            }
            return this.#t.releaseLock(), {
                done: !0,
                value: e
            };
        }
    }
    const n = Symbol();
    function asyncIterator_i() {
        return this[n].next();
    }
    Object.defineProperty(asyncIterator_i, "name", {
        value: "next"
    });
    function o(r) {
        return this[n].return(r);
    }
    Object.defineProperty(o, "name", {
        value: "return"
    });
    const u = Object.create(asyncIterator_a, {
        next: {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: asyncIterator_i
        },
        return: {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: o
        }
    });
    function h({ preventCancel: r = !1 } = {}) {
        const e = this.getReader(), t = new c(e, r), s = Object.create(u);
        return s[n] = t, s;
    }
    const getAsyncIterable = (stream)=>{
        if (isReadableStream(stream, {
            checkOpen: false
        }) && void 0 !== nodeImports.on) return getStreamIterable(stream);
        if ('function' == typeof stream?.[Symbol.asyncIterator]) return stream;
        if ('[object ReadableStream]' === stream_toString.call(stream)) return h.call(stream);
        throw new TypeError('The first argument must be a Readable, a ReadableStream, or an async iterable.');
    };
    const { toString: stream_toString } = Object.prototype;
    const getStreamIterable = async function*(stream) {
        const controller = new AbortController();
        const state = {};
        handleStreamEnd(stream, controller, state);
        try {
            for await (const [chunk] of nodeImports.on(stream, 'data', {
                signal: controller.signal
            }))yield chunk;
        } catch (error) {
            if (void 0 !== state.error) throw state.error;
            if (!controller.signal.aborted) throw error;
        } finally{
            stream.destroy();
        }
    };
    const handleStreamEnd = async (stream, controller, state)=>{
        try {
            await nodeImports.finished(stream, {
                cleanup: true,
                readable: true,
                writable: false,
                error: false
            });
        } catch (error) {
            state.error = error;
        } finally{
            controller.abort();
        }
    };
    const nodeImports = {};
    const getStreamContents = async (stream, { init, convertChunk, getSize, truncateChunk, addChunk, getFinalChunk, finalize }, { maxBuffer = Number.POSITIVE_INFINITY } = {})=>{
        const asyncIterable = getAsyncIterable(stream);
        const state = init();
        state.length = 0;
        try {
            for await (const chunk of asyncIterable){
                const chunkType = getChunkType(chunk);
                const convertedChunk = convertChunk[chunkType](chunk, state);
                appendChunk({
                    convertedChunk,
                    state,
                    getSize,
                    truncateChunk,
                    addChunk,
                    maxBuffer
                });
            }
            appendFinalChunk({
                state,
                convertChunk,
                getSize,
                truncateChunk,
                addChunk,
                getFinalChunk,
                maxBuffer
            });
            return finalize(state);
        } catch (error) {
            const normalizedError = 'object' == typeof error && null !== error ? error : new Error(error);
            normalizedError.bufferedData = finalize(state);
            throw normalizedError;
        }
    };
    const appendFinalChunk = ({ state, getSize, truncateChunk, addChunk, getFinalChunk, maxBuffer })=>{
        const convertedChunk = getFinalChunk(state);
        if (void 0 !== convertedChunk) appendChunk({
            convertedChunk,
            state,
            getSize,
            truncateChunk,
            addChunk,
            maxBuffer
        });
    };
    const appendChunk = ({ convertedChunk, state, getSize, truncateChunk, addChunk, maxBuffer })=>{
        const chunkSize = getSize(convertedChunk);
        const newLength = state.length + chunkSize;
        if (newLength <= maxBuffer) {
            addNewChunk(convertedChunk, state, addChunk, newLength);
            return;
        }
        const truncatedChunk = truncateChunk(convertedChunk, maxBuffer - state.length);
        if (void 0 !== truncatedChunk) addNewChunk(truncatedChunk, state, addChunk, maxBuffer);
        throw new MaxBufferError();
    };
    const addNewChunk = (convertedChunk, state, addChunk, newLength)=>{
        state.contents = addChunk(convertedChunk, state, newLength);
        state.length = newLength;
    };
    const getChunkType = (chunk)=>{
        const typeOfChunk = typeof chunk;
        if ('string' === typeOfChunk) return 'string';
        if ('object' !== typeOfChunk || null === chunk) return 'others';
        if (globalThis.Buffer?.isBuffer(chunk)) return 'buffer';
        const prototypeName = contents_objectToString.call(chunk);
        if ('[object ArrayBuffer]' === prototypeName) return 'arrayBuffer';
        if ('[object DataView]' === prototypeName) return 'dataView';
        if (Number.isInteger(chunk.byteLength) && Number.isInteger(chunk.byteOffset) && '[object ArrayBuffer]' === contents_objectToString.call(chunk.buffer)) return 'typedArray';
        return 'others';
    };
    const { toString: contents_objectToString } = Object.prototype;
    class MaxBufferError extends Error {
        name = 'MaxBufferError';
        constructor(){
            super('maxBuffer exceeded');
        }
    }
    const handleMaxBuffer = ({ error, stream, readableObjectMode, lines, encoding, fdNumber })=>{
        if (!(error instanceof MaxBufferError)) throw error;
        if ('all' === fdNumber) return error;
        const unit = getMaxBufferUnit(readableObjectMode, lines, encoding);
        error.maxBufferInfo = {
            fdNumber,
            unit
        };
        stream.destroy();
        throw error;
    };
    const getMaxBufferUnit = (readableObjectMode, lines, encoding)=>{
        if (readableObjectMode) return 'objects';
        if (lines) return 'lines';
        if ('buffer' === encoding) return 'bytes';
        return 'characters';
    };
    const checkIpcMaxBuffer = (subprocess, ipcOutput, maxBuffer)=>{
        if (ipcOutput.length !== maxBuffer) return;
        const error = new MaxBufferError();
        error.maxBufferInfo = {
            fdNumber: 'ipc'
        };
        throw error;
    };
    const getMaxBufferMessage = (error, maxBuffer)=>{
        const { streamName, threshold, unit } = getMaxBufferInfo(error, maxBuffer);
        return `Command's ${streamName} was larger than ${threshold} ${unit}`;
    };
    const getMaxBufferInfo = (error, maxBuffer)=>{
        if (error?.maxBufferInfo === void 0) return {
            streamName: 'output',
            threshold: maxBuffer[1],
            unit: 'bytes'
        };
        const { maxBufferInfo: { fdNumber, unit } } = error;
        delete error.maxBufferInfo;
        const threshold = getFdSpecificValue(maxBuffer, fdNumber);
        if ('ipc' === fdNumber) return {
            streamName: 'IPC output',
            threshold,
            unit: 'messages'
        };
        return {
            streamName: getStreamName(fdNumber),
            threshold,
            unit
        };
    };
    const isMaxBufferSync = (resultError, output, maxBuffer)=>resultError?.code === 'ENOBUFS' && null !== output && output.some((result)=>null !== result && result.length > getMaxBufferSync(maxBuffer));
    const truncateMaxBufferSync = (result, isMaxBuffer, maxBuffer)=>{
        if (!isMaxBuffer) return result;
        const maxBufferValue = getMaxBufferSync(maxBuffer);
        return result.length > maxBufferValue ? result.slice(0, maxBufferValue) : result;
    };
    const getMaxBufferSync = ([, stdoutMaxBuffer])=>stdoutMaxBuffer;
    const createMessages = ({ stdio, all, ipcOutput, originalError, signal, signalDescription, exitCode, escapedCommand, timedOut, isCanceled, isGracefullyCanceled, isMaxBuffer, isForcefullyTerminated, forceKillAfterDelay, killSignal, maxBuffer, timeout, cwd })=>{
        const errorCode = originalError?.code;
        const prefix = getErrorPrefix({
            originalError,
            timedOut,
            timeout,
            isMaxBuffer,
            maxBuffer,
            errorCode,
            signal,
            signalDescription,
            exitCode,
            isCanceled,
            isGracefullyCanceled,
            isForcefullyTerminated,
            forceKillAfterDelay,
            killSignal
        });
        const originalMessage = getOriginalMessage(originalError, cwd);
        const suffix = void 0 === originalMessage ? '' : `\n${originalMessage}`;
        const shortMessage = `${prefix}: ${escapedCommand}${suffix}`;
        const messageStdio = void 0 === all ? [
            stdio[2],
            stdio[1]
        ] : [
            all
        ];
        const message = [
            shortMessage,
            ...messageStdio,
            ...stdio.slice(3),
            ipcOutput.map((ipcMessage)=>serializeIpcMessage(ipcMessage)).join('\n')
        ].map((messagePart)=>escapeLines(strip_final_newline_stripFinalNewline(serializeMessagePart(messagePart)))).filter(Boolean).join('\n\n');
        return {
            originalMessage,
            shortMessage,
            message
        };
    };
    const getErrorPrefix = ({ originalError, timedOut, timeout, isMaxBuffer, maxBuffer, errorCode, signal, signalDescription, exitCode, isCanceled, isGracefullyCanceled, isForcefullyTerminated, forceKillAfterDelay, killSignal })=>{
        const forcefulSuffix = getForcefulSuffix(isForcefullyTerminated, forceKillAfterDelay);
        if (timedOut) return `Command timed out after ${timeout} milliseconds${forcefulSuffix}`;
        if (isGracefullyCanceled) {
            if (void 0 === signal) return `Command was gracefully canceled with exit code ${exitCode}`;
            return isForcefullyTerminated ? `Command was gracefully canceled${forcefulSuffix}` : `Command was gracefully canceled with ${signal} (${signalDescription})`;
        }
        if (isCanceled) return `Command was canceled${forcefulSuffix}`;
        if (isMaxBuffer) return `${getMaxBufferMessage(originalError, maxBuffer)}${forcefulSuffix}`;
        if (void 0 !== errorCode) return `Command failed with ${errorCode}${forcefulSuffix}`;
        if (isForcefullyTerminated) return `Command was killed with ${killSignal} (${getSignalDescription(killSignal)})${forcefulSuffix}`;
        if (void 0 !== signal) return `Command was killed with ${signal} (${signalDescription})`;
        if (void 0 !== exitCode) return `Command failed with exit code ${exitCode}`;
        return 'Command failed';
    };
    const getForcefulSuffix = (isForcefullyTerminated, forceKillAfterDelay)=>isForcefullyTerminated ? ` and was forcefully terminated after ${forceKillAfterDelay} milliseconds` : '';
    const getOriginalMessage = (originalError, cwd)=>{
        if (originalError instanceof DiscardedError) return;
        const originalMessage = isExecaError(originalError) ? originalError.originalMessage : String(originalError?.message ?? originalError);
        const escapedOriginalMessage = escapeLines(fixCwdError(originalMessage, cwd));
        return '' === escapedOriginalMessage ? void 0 : escapedOriginalMessage;
    };
    const serializeIpcMessage = (ipcMessage)=>'string' == typeof ipcMessage ? ipcMessage : (0, external_node_util_namespaceObject.inspect)(ipcMessage);
    const serializeMessagePart = (messagePart)=>Array.isArray(messagePart) ? messagePart.map((messageItem)=>strip_final_newline_stripFinalNewline(serializeMessageItem(messageItem))).filter(Boolean).join('\n') : serializeMessageItem(messagePart);
    const serializeMessageItem = (messageItem)=>{
        if ('string' == typeof messageItem) return messageItem;
        if (isUint8Array(messageItem)) return uint8ArrayToString(messageItem);
        return '';
    };
    const makeSuccessResult = ({ command, escapedCommand, stdio, all, ipcOutput, options: { cwd }, startTime })=>omitUndefinedProperties({
            command,
            escapedCommand,
            cwd,
            durationMs: getDurationMs(startTime),
            failed: false,
            timedOut: false,
            isCanceled: false,
            isGracefullyCanceled: false,
            isTerminated: false,
            isMaxBuffer: false,
            isForcefullyTerminated: false,
            exitCode: 0,
            stdout: stdio[1],
            stderr: stdio[2],
            all,
            stdio,
            ipcOutput,
            pipedFrom: []
        });
    const makeEarlyError = ({ error, command, escapedCommand, fileDescriptors, options, startTime, isSync })=>makeError({
            error,
            command,
            escapedCommand,
            startTime,
            timedOut: false,
            isCanceled: false,
            isGracefullyCanceled: false,
            isMaxBuffer: false,
            isForcefullyTerminated: false,
            stdio: Array.from({
                length: fileDescriptors.length
            }),
            ipcOutput: [],
            options,
            isSync
        });
    const makeError = ({ error: originalError, command, escapedCommand, startTime, timedOut, isCanceled, isGracefullyCanceled, isMaxBuffer, isForcefullyTerminated, exitCode: rawExitCode, signal: rawSignal, stdio, all, ipcOutput, options: { timeoutDuration, timeout = timeoutDuration, forceKillAfterDelay, killSignal, cwd, maxBuffer }, isSync })=>{
        const { exitCode, signal, signalDescription } = normalizeExitPayload(rawExitCode, rawSignal);
        const { originalMessage, shortMessage, message } = createMessages({
            stdio,
            all,
            ipcOutput,
            originalError,
            signal,
            signalDescription,
            exitCode,
            escapedCommand,
            timedOut,
            isCanceled,
            isGracefullyCanceled,
            isMaxBuffer,
            isForcefullyTerminated,
            forceKillAfterDelay,
            killSignal,
            maxBuffer,
            timeout,
            cwd
        });
        const error = getFinalError(originalError, message, isSync);
        Object.assign(error, getErrorProperties({
            error,
            command,
            escapedCommand,
            startTime,
            timedOut,
            isCanceled,
            isGracefullyCanceled,
            isMaxBuffer,
            isForcefullyTerminated,
            exitCode,
            signal,
            signalDescription,
            stdio,
            all,
            ipcOutput,
            cwd,
            originalMessage,
            shortMessage
        }));
        return error;
    };
    const getErrorProperties = ({ error, command, escapedCommand, startTime, timedOut, isCanceled, isGracefullyCanceled, isMaxBuffer, isForcefullyTerminated, exitCode, signal, signalDescription, stdio, all, ipcOutput, cwd, originalMessage, shortMessage })=>omitUndefinedProperties({
            shortMessage,
            originalMessage,
            command,
            escapedCommand,
            cwd,
            durationMs: getDurationMs(startTime),
            failed: true,
            timedOut,
            isCanceled,
            isGracefullyCanceled,
            isTerminated: void 0 !== signal,
            isMaxBuffer,
            isForcefullyTerminated,
            exitCode,
            signal,
            signalDescription,
            code: error.cause?.code,
            stdout: stdio[1],
            stderr: stdio[2],
            all,
            stdio,
            ipcOutput,
            pipedFrom: []
        });
    const omitUndefinedProperties = (result)=>Object.fromEntries(Object.entries(result).filter(([, value])=>void 0 !== value));
    const normalizeExitPayload = (rawExitCode, rawSignal)=>{
        const exitCode = null === rawExitCode ? void 0 : rawExitCode;
        const signal = null === rawSignal ? void 0 : rawSignal;
        const signalDescription = void 0 === signal ? void 0 : getSignalDescription(rawSignal);
        return {
            exitCode,
            signal,
            signalDescription
        };
    };
    const toZeroIfInfinity = (value)=>Number.isFinite(value) ? value : 0;
    function parseNumber(milliseconds) {
        return {
            days: Math.trunc(milliseconds / 86400000),
            hours: Math.trunc(milliseconds / 3600000 % 24),
            minutes: Math.trunc(milliseconds / 60000 % 60),
            seconds: Math.trunc(milliseconds / 1000 % 60),
            milliseconds: Math.trunc(milliseconds % 1000),
            microseconds: Math.trunc(toZeroIfInfinity(1000 * milliseconds) % 1000),
            nanoseconds: Math.trunc(toZeroIfInfinity(1e6 * milliseconds) % 1000)
        };
    }
    function parseBigint(milliseconds) {
        return {
            days: milliseconds / 86400000n,
            hours: milliseconds / 3600000n % 24n,
            minutes: milliseconds / 60000n % 60n,
            seconds: milliseconds / 1000n % 60n,
            milliseconds: milliseconds % 1000n,
            microseconds: 0n,
            nanoseconds: 0n
        };
    }
    function parseMilliseconds(milliseconds) {
        switch(typeof milliseconds){
            case 'number':
                if (Number.isFinite(milliseconds)) return parseNumber(milliseconds);
                break;
            case 'bigint':
                return parseBigint(milliseconds);
        }
        throw new TypeError('Expected a finite number or bigint');
    }
    const isZero = (value)=>0 === value || 0n === value;
    const pluralize = (word, count)=>1 === count || 1n === count ? word : `${word}s`;
    const SECOND_ROUNDING_EPSILON = 0.0000001;
    const ONE_DAY_IN_MILLISECONDS = 24n * 60n * 60n * 1000n;
    function prettyMilliseconds(milliseconds, options) {
        const isBigInt = 'bigint' == typeof milliseconds;
        if (!isBigInt && !Number.isFinite(milliseconds)) throw new TypeError('Expected a finite number or bigint');
        options = {
            ...options
        };
        const sign = milliseconds < 0 ? '-' : '';
        milliseconds = milliseconds < 0 ? -milliseconds : milliseconds;
        if (options.colonNotation) {
            options.compact = false;
            options.formatSubMilliseconds = false;
            options.separateMilliseconds = false;
            options.verbose = false;
        }
        if (options.compact) {
            options.unitCount = 1;
            options.secondsDecimalDigits = 0;
            options.millisecondsDecimalDigits = 0;
        }
        let result = [];
        const floorDecimals = (value, decimalDigits)=>{
            const flooredInterimValue = Math.floor(value * 10 ** decimalDigits + SECOND_ROUNDING_EPSILON);
            const flooredValue = Math.round(flooredInterimValue) / 10 ** decimalDigits;
            return flooredValue.toFixed(decimalDigits);
        };
        const add = (value, long, short, valueString)=>{
            if ((0 === result.length || !options.colonNotation) && isZero(value) && !(options.colonNotation && 'm' === short)) return;
            valueString ??= String(value);
            if (options.colonNotation) {
                const wholeDigits = valueString.includes('.') ? valueString.split('.')[0].length : valueString.length;
                const minLength = result.length > 0 ? 2 : 1;
                valueString = '0'.repeat(Math.max(0, minLength - wholeDigits)) + valueString;
            } else valueString += options.verbose ? ' ' + pluralize(long, value) : short;
            result.push(valueString);
        };
        const parsed = parseMilliseconds(milliseconds);
        const days = BigInt(parsed.days);
        if (options.hideYearAndDays) add(24n * BigInt(days) + BigInt(parsed.hours), 'hour', 'h');
        else {
            if (options.hideYear) add(days, 'day', 'd');
            else {
                add(days / 365n, 'year', 'y');
                add(days % 365n, 'day', 'd');
            }
            add(Number(parsed.hours), 'hour', 'h');
        }
        add(Number(parsed.minutes), 'minute', 'm');
        if (!options.hideSeconds) {
            if (options.separateMilliseconds || options.formatSubMilliseconds || !options.colonNotation && milliseconds < 1000) {
                const seconds = Number(parsed.seconds);
                const milliseconds = Number(parsed.milliseconds);
                const microseconds = Number(parsed.microseconds);
                const nanoseconds = Number(parsed.nanoseconds);
                add(seconds, 'second', 's');
                if (options.formatSubMilliseconds) {
                    add(milliseconds, 'millisecond', 'ms');
                    add(microseconds, 'microsecond', 'µs');
                    add(nanoseconds, 'nanosecond', 'ns');
                } else {
                    const millisecondsAndBelow = milliseconds + microseconds / 1000 + nanoseconds / 1e6;
                    const millisecondsDecimalDigits = 'number' == typeof options.millisecondsDecimalDigits ? options.millisecondsDecimalDigits : 0;
                    const roundedMilliseconds = millisecondsAndBelow >= 1 ? Math.round(millisecondsAndBelow) : Math.ceil(millisecondsAndBelow);
                    const millisecondsString = millisecondsDecimalDigits ? millisecondsAndBelow.toFixed(millisecondsDecimalDigits) : roundedMilliseconds;
                    add(Number.parseFloat(millisecondsString), 'millisecond', 'ms', millisecondsString);
                }
            } else {
                const seconds = (isBigInt ? Number(milliseconds % ONE_DAY_IN_MILLISECONDS) : milliseconds) / 1000 % 60;
                const secondsDecimalDigits = 'number' == typeof options.secondsDecimalDigits ? options.secondsDecimalDigits : 1;
                const secondsFixed = floorDecimals(seconds, secondsDecimalDigits);
                const secondsString = options.keepDecimalsOnWholeSeconds ? secondsFixed : secondsFixed.replace(/\.0+$/, '');
                add(Number.parseFloat(secondsString), 'second', 's', secondsString);
            }
        }
        if (0 === result.length) return sign + '0' + (options.verbose ? ' milliseconds' : 'ms');
        const separator = options.colonNotation ? ':' : ' ';
        if ('number' == typeof options.unitCount) result = result.slice(0, Math.max(options.unitCount, 1));
        return sign + result.join(separator);
    }
    const logError = (result, verboseInfo)=>{
        if (result.failed) verboseLog({
            type: 'error',
            verboseMessage: result.shortMessage,
            verboseInfo,
            result
        });
    };
    const logResult = (result, verboseInfo)=>{
        if (!values_isVerbose(verboseInfo)) return;
        logError(result, verboseInfo);
        logDuration(result, verboseInfo);
    };
    const logDuration = (result, verboseInfo)=>{
        const verboseMessage = `(done in ${prettyMilliseconds(result.durationMs)})`;
        verboseLog({
            type: 'duration',
            verboseMessage,
            verboseInfo,
            result
        });
    };
    const handleResult = (result, verboseInfo, { reject })=>{
        logResult(result, verboseInfo);
        if (result.failed && reject) throw result;
        return result;
    };
    const getStdioItemType = (value, optionName)=>{
        if (isAsyncGenerator(value)) return 'asyncGenerator';
        if (isSyncGenerator(value)) return 'generator';
        if (isUrl(value)) return 'fileUrl';
        if (isFilePathObject(value)) return 'filePath';
        if (isWebStream(value)) return 'webStream';
        if (isStream(value, {
            checkOpen: false
        })) return 'native';
        if (isUint8Array(value)) return 'uint8Array';
        if (isAsyncIterableObject(value)) return 'asyncIterable';
        if (isIterableObject(value)) return 'iterable';
        if (type_isTransformStream(value)) return getTransformStreamType({
            transform: value
        }, optionName);
        if (isTransformOptions(value)) return getTransformObjectType(value, optionName);
        return 'native';
    };
    const getTransformObjectType = (value, optionName)=>{
        if (isDuplexStream(value.transform, {
            checkOpen: false
        })) return getDuplexType(value, optionName);
        if (type_isTransformStream(value.transform)) return getTransformStreamType(value, optionName);
        return getGeneratorObjectType(value, optionName);
    };
    const getDuplexType = (value, optionName)=>{
        validateNonGeneratorType(value, optionName, 'Duplex stream');
        return 'duplex';
    };
    const getTransformStreamType = (value, optionName)=>{
        validateNonGeneratorType(value, optionName, 'web TransformStream');
        return 'webTransform';
    };
    const validateNonGeneratorType = ({ final, binary, objectMode }, optionName, typeName)=>{
        checkUndefinedOption(final, `${optionName}.final`, typeName);
        checkUndefinedOption(binary, `${optionName}.binary`, typeName);
        checkBooleanOption(objectMode, `${optionName}.objectMode`);
    };
    const checkUndefinedOption = (value, optionName, typeName)=>{
        if (void 0 !== value) throw new TypeError(`The \`${optionName}\` option can only be defined when using a generator, not a ${typeName}.`);
    };
    const getGeneratorObjectType = ({ transform, final, binary, objectMode }, optionName)=>{
        if (void 0 !== transform && !isGenerator(transform)) throw new TypeError(`The \`${optionName}.transform\` option must be a generator, a Duplex stream or a web TransformStream.`);
        if (isDuplexStream(final, {
            checkOpen: false
        })) throw new TypeError(`The \`${optionName}.final\` option must not be a Duplex stream.`);
        if (type_isTransformStream(final)) throw new TypeError(`The \`${optionName}.final\` option must not be a web TransformStream.`);
        if (void 0 !== final && !isGenerator(final)) throw new TypeError(`The \`${optionName}.final\` option must be a generator.`);
        checkBooleanOption(binary, `${optionName}.binary`);
        checkBooleanOption(objectMode, `${optionName}.objectMode`);
        return isAsyncGenerator(transform) || isAsyncGenerator(final) ? 'asyncGenerator' : 'generator';
    };
    const checkBooleanOption = (value, optionName)=>{
        if (void 0 !== value && 'boolean' != typeof value) throw new TypeError(`The \`${optionName}\` option must use a boolean.`);
    };
    const isGenerator = (value)=>isAsyncGenerator(value) || isSyncGenerator(value);
    const isAsyncGenerator = (value)=>'[object AsyncGeneratorFunction]' === Object.prototype.toString.call(value);
    const isSyncGenerator = (value)=>'[object GeneratorFunction]' === Object.prototype.toString.call(value);
    const isTransformOptions = (value)=>isPlainObject(value) && (void 0 !== value.transform || void 0 !== value.final);
    const isUrl = (value)=>'[object URL]' === Object.prototype.toString.call(value);
    const isRegularUrl = (value)=>isUrl(value) && 'file:' !== value.protocol;
    const isFilePathObject = (value)=>isPlainObject(value) && Object.keys(value).length > 0 && Object.keys(value).every((key)=>FILE_PATH_KEYS.has(key)) && isFilePathString(value.file);
    const FILE_PATH_KEYS = new Set([
        'file',
        'append'
    ]);
    const isFilePathString = (file)=>'string' == typeof file;
    const isUnknownStdioString = (type, value)=>'native' === type && 'string' == typeof value && !KNOWN_STDIO_STRINGS.has(value);
    const KNOWN_STDIO_STRINGS = new Set([
        'ipc',
        'ignore',
        'inherit',
        'overlapped',
        'pipe'
    ]);
    const type_isReadableStream = (value)=>'[object ReadableStream]' === Object.prototype.toString.call(value);
    const type_isWritableStream = (value)=>'[object WritableStream]' === Object.prototype.toString.call(value);
    const isWebStream = (value)=>type_isReadableStream(value) || type_isWritableStream(value);
    const type_isTransformStream = (value)=>type_isReadableStream(value?.readable) && type_isWritableStream(value?.writable);
    const isAsyncIterableObject = (value)=>isObject(value) && 'function' == typeof value[Symbol.asyncIterator];
    const isIterableObject = (value)=>isObject(value) && 'function' == typeof value[Symbol.iterator];
    const isObject = (value)=>'object' == typeof value && null !== value;
    const TRANSFORM_TYPES = new Set([
        'generator',
        'asyncGenerator',
        'duplex',
        'webTransform'
    ]);
    const FILE_TYPES = new Set([
        'fileUrl',
        'filePath',
        'fileNumber'
    ]);
    const SPECIAL_DUPLICATE_TYPES_SYNC = new Set([
        'fileUrl',
        'filePath'
    ]);
    const SPECIAL_DUPLICATE_TYPES = new Set([
        ...SPECIAL_DUPLICATE_TYPES_SYNC,
        'webStream',
        'nodeStream'
    ]);
    const FORBID_DUPLICATE_TYPES = new Set([
        'webTransform',
        'duplex'
    ]);
    const TYPE_TO_MESSAGE = {
        generator: 'a generator',
        asyncGenerator: 'an async generator',
        fileUrl: 'a file URL',
        filePath: 'a file path string',
        fileNumber: "a file descriptor number",
        webStream: 'a web stream',
        nodeStream: 'a Node.js stream',
        webTransform: 'a web TransformStream',
        duplex: 'a Duplex stream',
        native: 'any value',
        iterable: 'an iterable',
        asyncIterable: 'an async iterable',
        string: 'a string',
        uint8Array: 'a Uint8Array'
    };
    const getTransformObjectModes = (objectMode, index, newTransforms, direction)=>'output' === direction ? getOutputObjectModes(objectMode, index, newTransforms) : getInputObjectModes(objectMode, index, newTransforms);
    const getOutputObjectModes = (objectMode, index, newTransforms)=>{
        const writableObjectMode = 0 !== index && newTransforms[index - 1].value.readableObjectMode;
        const readableObjectMode = objectMode ?? writableObjectMode;
        return {
            writableObjectMode,
            readableObjectMode
        };
    };
    const getInputObjectModes = (objectMode, index, newTransforms)=>{
        const writableObjectMode = 0 === index ? true === objectMode : newTransforms[index - 1].value.readableObjectMode;
        const readableObjectMode = index !== newTransforms.length - 1 && (objectMode ?? writableObjectMode);
        return {
            writableObjectMode,
            readableObjectMode
        };
    };
    const getFdObjectMode = (stdioItems, direction)=>{
        const lastTransform = stdioItems.findLast(({ type })=>TRANSFORM_TYPES.has(type));
        if (void 0 === lastTransform) return false;
        return 'input' === direction ? lastTransform.value.writableObjectMode : lastTransform.value.readableObjectMode;
    };
    const normalizeTransforms = (stdioItems, optionName, direction, options)=>[
            ...stdioItems.filter(({ type })=>!TRANSFORM_TYPES.has(type)),
            ...getTransforms(stdioItems, optionName, direction, options)
        ];
    const getTransforms = (stdioItems, optionName, direction, { encoding })=>{
        const transforms = stdioItems.filter(({ type })=>TRANSFORM_TYPES.has(type));
        const newTransforms = Array.from({
            length: transforms.length
        });
        for (const [index, stdioItem] of Object.entries(transforms))newTransforms[index] = normalizeTransform({
            stdioItem,
            index: Number(index),
            newTransforms,
            optionName,
            direction,
            encoding
        });
        return sortTransforms(newTransforms, direction);
    };
    const normalizeTransform = ({ stdioItem, stdioItem: { type }, index, newTransforms, optionName, direction, encoding })=>{
        if ('duplex' === type) return normalizeDuplex({
            stdioItem,
            optionName
        });
        if ('webTransform' === type) return normalizeTransformStream({
            stdioItem,
            index,
            newTransforms,
            direction
        });
        return normalizeGenerator({
            stdioItem,
            index,
            newTransforms,
            direction,
            encoding
        });
    };
    const normalizeDuplex = ({ stdioItem, stdioItem: { value: { transform, transform: { writableObjectMode, readableObjectMode }, objectMode = readableObjectMode } }, optionName })=>{
        if (objectMode && !readableObjectMode) throw new TypeError(`The \`${optionName}.objectMode\` option can only be \`true\` if \`new Duplex({objectMode: true})\` is used.`);
        if (!objectMode && readableObjectMode) throw new TypeError(`The \`${optionName}.objectMode\` option cannot be \`false\` if \`new Duplex({objectMode: true})\` is used.`);
        return {
            ...stdioItem,
            value: {
                transform,
                writableObjectMode,
                readableObjectMode
            }
        };
    };
    const normalizeTransformStream = ({ stdioItem, stdioItem: { value }, index, newTransforms, direction })=>{
        const { transform, objectMode } = isPlainObject(value) ? value : {
            transform: value
        };
        const { writableObjectMode, readableObjectMode } = getTransformObjectModes(objectMode, index, newTransforms, direction);
        return {
            ...stdioItem,
            value: {
                transform,
                writableObjectMode,
                readableObjectMode
            }
        };
    };
    const normalizeGenerator = ({ stdioItem, stdioItem: { value }, index, newTransforms, direction, encoding })=>{
        const { transform, final, binary: binaryOption = false, preserveNewlines = false, objectMode } = isPlainObject(value) ? value : {
            transform: value
        };
        const binary = binaryOption || BINARY_ENCODINGS.has(encoding);
        const { writableObjectMode, readableObjectMode } = getTransformObjectModes(objectMode, index, newTransforms, direction);
        return {
            ...stdioItem,
            value: {
                transform,
                final,
                binary,
                preserveNewlines,
                writableObjectMode,
                readableObjectMode
            }
        };
    };
    const sortTransforms = (newTransforms, direction)=>'input' === direction ? newTransforms.reverse() : newTransforms;
    const getStreamDirection = (stdioItems, fdNumber, optionName)=>{
        const directions = stdioItems.map((stdioItem)=>getStdioItemDirection(stdioItem, fdNumber));
        if (directions.includes('input') && directions.includes('output')) throw new TypeError(`The \`${optionName}\` option must not be an array of both readable and writable values.`);
        return directions.find(Boolean) ?? DEFAULT_DIRECTION;
    };
    const getStdioItemDirection = ({ type, value }, fdNumber)=>KNOWN_DIRECTIONS[fdNumber] ?? guessStreamDirection[type](value);
    const KNOWN_DIRECTIONS = [
        'input',
        'output',
        'output'
    ];
    const anyDirection = ()=>void 0;
    const alwaysInput = ()=>'input';
    const guessStreamDirection = {
        generator: anyDirection,
        asyncGenerator: anyDirection,
        fileUrl: anyDirection,
        filePath: anyDirection,
        iterable: alwaysInput,
        asyncIterable: alwaysInput,
        uint8Array: alwaysInput,
        webStream: (value)=>type_isWritableStream(value) ? 'output' : 'input',
        nodeStream (value) {
            if (!isReadableStream(value, {
                checkOpen: false
            })) return 'output';
            return isWritableStream(value, {
                checkOpen: false
            }) ? void 0 : 'input';
        },
        webTransform: anyDirection,
        duplex: anyDirection,
        native (value) {
            const standardStreamDirection = getStandardStreamDirection(value);
            if (void 0 !== standardStreamDirection) return standardStreamDirection;
            if (isStream(value, {
                checkOpen: false
            })) return guessStreamDirection.nodeStream(value);
        }
    };
    const getStandardStreamDirection = (value)=>{
        if ([
            0,
            external_node_process_namespaceObject.stdin
        ].includes(value)) return 'input';
        if ([
            1,
            2,
            external_node_process_namespaceObject.stdout,
            external_node_process_namespaceObject.stderr
        ].includes(value)) return 'output';
    };
    const DEFAULT_DIRECTION = 'output';
    const normalizeIpcStdioArray = (stdioArray, ipc)=>ipc && !stdioArray.includes('ipc') ? [
            ...stdioArray,
            'ipc'
        ] : stdioArray;
    const normalizeStdioOption = ({ stdio, ipc, buffer, ...options }, verboseInfo, isSync)=>{
        const stdioArray = getStdioArray(stdio, options).map((stdioOption, fdNumber)=>stdio_option_addDefaultValue(stdioOption, fdNumber));
        return isSync ? normalizeStdioSync(stdioArray, buffer, verboseInfo) : normalizeIpcStdioArray(stdioArray, ipc);
    };
    const getStdioArray = (stdio, options)=>{
        if (void 0 === stdio) return STANDARD_STREAMS_ALIASES.map((alias)=>options[alias]);
        if (hasAlias(options)) throw new Error(`It's not possible to provide \`stdio\` in combination with one of ${STANDARD_STREAMS_ALIASES.map((alias)=>`\`${alias}\``).join(', ')}`);
        if ('string' == typeof stdio) return [
            stdio,
            stdio,
            stdio
        ];
        if (!Array.isArray(stdio)) throw new TypeError(`Expected \`stdio\` to be of type \`string\` or \`Array\`, got \`${typeof stdio}\``);
        const length = Math.max(stdio.length, STANDARD_STREAMS_ALIASES.length);
        return Array.from({
            length
        }, (_, fdNumber)=>stdio[fdNumber]);
    };
    const hasAlias = (options)=>STANDARD_STREAMS_ALIASES.some((alias)=>void 0 !== options[alias]);
    const stdio_option_addDefaultValue = (stdioOption, fdNumber)=>{
        if (Array.isArray(stdioOption)) return stdioOption.map((item)=>stdio_option_addDefaultValue(item, fdNumber));
        if (null == stdioOption) return fdNumber >= STANDARD_STREAMS_ALIASES.length ? 'ignore' : 'pipe';
        return stdioOption;
    };
    const normalizeStdioSync = (stdioArray, buffer, verboseInfo)=>stdioArray.map((stdioOption, fdNumber)=>!buffer[fdNumber] && 0 !== fdNumber && !isFullVerbose(verboseInfo, fdNumber) && isOutputPipeOnly(stdioOption) ? 'ignore' : stdioOption);
    const isOutputPipeOnly = (stdioOption)=>'pipe' === stdioOption || Array.isArray(stdioOption) && stdioOption.every((item)=>'pipe' === item);
    const handleNativeStream = ({ stdioItem, stdioItem: { type }, isStdioArray, fdNumber, direction, isSync })=>{
        if (!isStdioArray || 'native' !== type) return stdioItem;
        return isSync ? handleNativeStreamSync({
            stdioItem,
            fdNumber,
            direction
        }) : handleNativeStreamAsync({
            stdioItem,
            fdNumber
        });
    };
    const handleNativeStreamSync = ({ stdioItem, stdioItem: { value, optionName }, fdNumber, direction })=>{
        const targetFd = getTargetFd({
            value,
            optionName,
            fdNumber,
            direction
        });
        if (void 0 !== targetFd) return targetFd;
        if (isStream(value, {
            checkOpen: false
        })) throw new TypeError(`The \`${optionName}: Stream\` option cannot both be an array and include a stream with synchronous methods.`);
        return stdioItem;
    };
    const getTargetFd = ({ value, optionName, fdNumber, direction })=>{
        const targetFdNumber = getTargetFdNumber(value, fdNumber);
        if (void 0 === targetFdNumber) return;
        if ('output' === direction) return {
            type: 'fileNumber',
            value: targetFdNumber,
            optionName
        };
        if (external_node_tty_namespaceObject.isatty(targetFdNumber)) throw new TypeError(`The \`${optionName}: ${serializeOptionValue(value)}\` option is invalid: it cannot be a TTY with synchronous methods.`);
        return {
            type: 'uint8Array',
            value: bufferToUint8Array((0, external_node_fs_namespaceObject.readFileSync)(targetFdNumber)),
            optionName
        };
    };
    const getTargetFdNumber = (value, fdNumber)=>{
        if ('inherit' === value) return fdNumber;
        if ('number' == typeof value) return value;
        const standardStreamIndex = STANDARD_STREAMS.indexOf(value);
        if (-1 !== standardStreamIndex) return standardStreamIndex;
    };
    const handleNativeStreamAsync = ({ stdioItem, stdioItem: { value, optionName }, fdNumber })=>{
        if ('inherit' === value) return {
            type: 'nodeStream',
            value: getStandardStream(fdNumber, value, optionName),
            optionName
        };
        if ('number' == typeof value) return {
            type: 'nodeStream',
            value: getStandardStream(value, value, optionName),
            optionName
        };
        if (isStream(value, {
            checkOpen: false
        })) return {
            type: 'nodeStream',
            value,
            optionName
        };
        return stdioItem;
    };
    const getStandardStream = (fdNumber, value, optionName)=>{
        const standardStream = STANDARD_STREAMS[fdNumber];
        if (void 0 === standardStream) throw new TypeError(`The \`${optionName}: ${value}\` option is invalid: no such standard stream.`);
        return standardStream;
    };
    const handleInputOptions = ({ input, inputFile }, fdNumber)=>0 === fdNumber ? [
            ...handleInputOption(input),
            ...handleInputFileOption(inputFile)
        ] : [];
    const handleInputOption = (input)=>void 0 === input ? [] : [
            {
                type: getInputType(input),
                value: input,
                optionName: 'input'
            }
        ];
    const getInputType = (input)=>{
        if (isReadableStream(input, {
            checkOpen: false
        })) return 'nodeStream';
        if ('string' == typeof input) return 'string';
        if (isUint8Array(input)) return 'uint8Array';
        throw new Error('The `input` option must be a string, a Uint8Array or a Node.js Readable stream.');
    };
    const handleInputFileOption = (inputFile)=>void 0 === inputFile ? [] : [
            {
                ...getInputFileType(inputFile),
                optionName: 'inputFile'
            }
        ];
    const getInputFileType = (inputFile)=>{
        if (isUrl(inputFile)) return {
            type: 'fileUrl',
            value: inputFile
        };
        if (isFilePathString(inputFile)) return {
            type: 'filePath',
            value: {
                file: inputFile
            }
        };
        throw new Error('The `inputFile` option must be a file path string or a file URL.');
    };
    const filterDuplicates = (stdioItems)=>stdioItems.filter((stdioItemOne, indexOne)=>stdioItems.every((stdioItemTwo, indexTwo)=>stdioItemOne.value !== stdioItemTwo.value || indexOne >= indexTwo || 'generator' === stdioItemOne.type || 'asyncGenerator' === stdioItemOne.type));
    const getDuplicateStream = ({ stdioItem: { type, value, optionName }, direction, fileDescriptors, isSync })=>{
        const otherStdioItems = getOtherStdioItems(fileDescriptors, type);
        if (0 === otherStdioItems.length) return;
        if (isSync) {
            validateDuplicateStreamSync({
                otherStdioItems,
                type,
                value,
                optionName,
                direction
            });
            return;
        }
        if (SPECIAL_DUPLICATE_TYPES.has(type)) return getDuplicateStreamInstance({
            otherStdioItems,
            type,
            value,
            optionName,
            direction
        });
        if (FORBID_DUPLICATE_TYPES.has(type)) validateDuplicateTransform({
            otherStdioItems,
            type,
            value,
            optionName
        });
    };
    const getOtherStdioItems = (fileDescriptors, type)=>fileDescriptors.flatMap(({ direction, stdioItems })=>stdioItems.filter((stdioItem)=>stdioItem.type === type).map((stdioItem)=>({
                    ...stdioItem,
                    direction
                })));
    const validateDuplicateStreamSync = ({ otherStdioItems, type, value, optionName, direction })=>{
        if (SPECIAL_DUPLICATE_TYPES_SYNC.has(type)) getDuplicateStreamInstance({
            otherStdioItems,
            type,
            value,
            optionName,
            direction
        });
    };
    const getDuplicateStreamInstance = ({ otherStdioItems, type, value, optionName, direction })=>{
        const duplicateStdioItems = otherStdioItems.filter((stdioItem)=>hasSameValue(stdioItem, value));
        if (0 === duplicateStdioItems.length) return;
        const differentStdioItem = duplicateStdioItems.find((stdioItem)=>stdioItem.direction !== direction);
        throwOnDuplicateStream(differentStdioItem, optionName, type);
        return 'output' === direction ? duplicateStdioItems[0].stream : void 0;
    };
    const hasSameValue = ({ type, value }, secondValue)=>{
        if ('filePath' === type) return value.file === secondValue.file;
        if ('fileUrl' === type) return value.href === secondValue.href;
        return value === secondValue;
    };
    const validateDuplicateTransform = ({ otherStdioItems, type, value, optionName })=>{
        const duplicateStdioItem = otherStdioItems.find(({ value: { transform } })=>transform === value.transform);
        throwOnDuplicateStream(duplicateStdioItem, optionName, type);
    };
    const throwOnDuplicateStream = (stdioItem, optionName, type)=>{
        if (void 0 !== stdioItem) throw new TypeError(`The \`${stdioItem.optionName}\` and \`${optionName}\` options must not target ${TYPE_TO_MESSAGE[type]} that is the same.`);
    };
    const handleStdio = (addProperties, options, verboseInfo, isSync)=>{
        const stdio = normalizeStdioOption(options, verboseInfo, isSync);
        const initialFileDescriptors = stdio.map((stdioOption, fdNumber)=>getFileDescriptor({
                stdioOption,
                fdNumber,
                options,
                isSync
            }));
        const fileDescriptors = getFinalFileDescriptors({
            initialFileDescriptors,
            addProperties,
            options,
            isSync
        });
        options.stdio = fileDescriptors.map(({ stdioItems })=>forwardStdio(stdioItems));
        return fileDescriptors;
    };
    const getFileDescriptor = ({ stdioOption, fdNumber, options, isSync })=>{
        const optionName = getStreamName(fdNumber);
        const { stdioItems: initialStdioItems, isStdioArray } = initializeStdioItems({
            stdioOption,
            fdNumber,
            options,
            optionName
        });
        const direction = getStreamDirection(initialStdioItems, fdNumber, optionName);
        const stdioItems = initialStdioItems.map((stdioItem)=>handleNativeStream({
                stdioItem,
                isStdioArray,
                fdNumber,
                direction,
                isSync
            }));
        const normalizedStdioItems = normalizeTransforms(stdioItems, optionName, direction, options);
        const objectMode = getFdObjectMode(normalizedStdioItems, direction);
        validateFileObjectMode(normalizedStdioItems, objectMode);
        return {
            direction,
            objectMode,
            stdioItems: normalizedStdioItems
        };
    };
    const initializeStdioItems = ({ stdioOption, fdNumber, options, optionName })=>{
        const values = Array.isArray(stdioOption) ? stdioOption : [
            stdioOption
        ];
        const initialStdioItems = [
            ...values.map((value)=>initializeStdioItem(value, optionName)),
            ...handleInputOptions(options, fdNumber)
        ];
        const stdioItems = filterDuplicates(initialStdioItems);
        const isStdioArray = stdioItems.length > 1;
        validateStdioArray(stdioItems, isStdioArray, optionName);
        validateStreams(stdioItems);
        return {
            stdioItems,
            isStdioArray
        };
    };
    const initializeStdioItem = (value, optionName)=>({
            type: getStdioItemType(value, optionName),
            value,
            optionName
        });
    const validateStdioArray = (stdioItems, isStdioArray, optionName)=>{
        if (0 === stdioItems.length) throw new TypeError(`The \`${optionName}\` option must not be an empty array.`);
        if (!isStdioArray) return;
        for (const { value, optionName } of stdioItems)if (INVALID_STDIO_ARRAY_OPTIONS.has(value)) throw new Error(`The \`${optionName}\` option must not include \`${value}\`.`);
    };
    const INVALID_STDIO_ARRAY_OPTIONS = new Set([
        'ignore',
        'ipc'
    ]);
    const validateStreams = (stdioItems)=>{
        for (const stdioItem of stdioItems)validateFileStdio(stdioItem);
    };
    const validateFileStdio = ({ type, value, optionName })=>{
        if (isRegularUrl(value)) throw new TypeError(`The \`${optionName}: URL\` option must use the \`file:\` scheme.
For example, you can use the \`pathToFileURL()\` method of the \`url\` core module.`);
        if (isUnknownStdioString(type, value)) throw new TypeError(`The \`${optionName}: { file: '...' }\` option must be used instead of \`${optionName}: '...'\`.`);
    };
    const validateFileObjectMode = (stdioItems, objectMode)=>{
        if (!objectMode) return;
        const fileStdioItem = stdioItems.find(({ type })=>FILE_TYPES.has(type));
        if (void 0 !== fileStdioItem) throw new TypeError(`The \`${fileStdioItem.optionName}\` option cannot use both files and transforms in objectMode.`);
    };
    const getFinalFileDescriptors = ({ initialFileDescriptors, addProperties, options, isSync })=>{
        const fileDescriptors = [];
        try {
            for (const fileDescriptor of initialFileDescriptors)fileDescriptors.push(getFinalFileDescriptor({
                fileDescriptor,
                fileDescriptors,
                addProperties,
                options,
                isSync
            }));
            return fileDescriptors;
        } catch (error) {
            cleanupCustomStreams(fileDescriptors);
            throw error;
        }
    };
    const getFinalFileDescriptor = ({ fileDescriptor: { direction, objectMode, stdioItems }, fileDescriptors, addProperties, options, isSync })=>{
        const finalStdioItems = stdioItems.map((stdioItem)=>addStreamProperties({
                stdioItem,
                addProperties,
                direction,
                options,
                fileDescriptors,
                isSync
            }));
        return {
            direction,
            objectMode,
            stdioItems: finalStdioItems
        };
    };
    const addStreamProperties = ({ stdioItem, addProperties, direction, options, fileDescriptors, isSync })=>{
        const duplicateStream = getDuplicateStream({
            stdioItem,
            direction,
            fileDescriptors,
            isSync
        });
        if (void 0 !== duplicateStream) return {
            ...stdioItem,
            stream: duplicateStream
        };
        return {
            ...stdioItem,
            ...addProperties[direction][stdioItem.type](stdioItem, options)
        };
    };
    const cleanupCustomStreams = (fileDescriptors)=>{
        for (const { stdioItems } of fileDescriptors)for (const { stream } of stdioItems)if (void 0 !== stream && !isStandardStream(stream)) stream.destroy();
    };
    const forwardStdio = (stdioItems)=>{
        if (stdioItems.length > 1) return stdioItems.some(({ value })=>'overlapped' === value) ? 'overlapped' : 'pipe';
        const [{ type, value }] = stdioItems;
        return 'native' === type ? value : 'pipe';
    };
    const handleStdioSync = (options, verboseInfo)=>handleStdio(addPropertiesSync, options, verboseInfo, true);
    const forbiddenIfSync = ({ type, optionName })=>{
        throwInvalidSyncValue(optionName, TYPE_TO_MESSAGE[type]);
    };
    const forbiddenNativeIfSync = ({ optionName, value })=>{
        if ('ipc' === value || 'overlapped' === value) throwInvalidSyncValue(optionName, `"${value}"`);
        return {};
    };
    const throwInvalidSyncValue = (optionName, value)=>{
        throw new TypeError(`The \`${optionName}\` option cannot be ${value} with synchronous methods.`);
    };
    const handle_sync_addProperties = {
        generator () {},
        asyncGenerator: forbiddenIfSync,
        webStream: forbiddenIfSync,
        nodeStream: forbiddenIfSync,
        webTransform: forbiddenIfSync,
        duplex: forbiddenIfSync,
        asyncIterable: forbiddenIfSync,
        native: forbiddenNativeIfSync
    };
    const addPropertiesSync = {
        input: {
            ...handle_sync_addProperties,
            fileUrl: ({ value })=>({
                    contents: [
                        bufferToUint8Array((0, external_node_fs_namespaceObject.readFileSync)(value))
                    ]
                }),
            filePath: ({ value: { file } })=>({
                    contents: [
                        bufferToUint8Array((0, external_node_fs_namespaceObject.readFileSync)(file))
                    ]
                }),
            fileNumber: forbiddenIfSync,
            iterable: ({ value })=>({
                    contents: [
                        ...value
                    ]
                }),
            string: ({ value })=>({
                    contents: [
                        value
                    ]
                }),
            uint8Array: ({ value })=>({
                    contents: [
                        value
                    ]
                })
        },
        output: {
            ...handle_sync_addProperties,
            fileUrl: ({ value })=>({
                    path: value
                }),
            filePath: ({ value: { file, append } })=>({
                    path: file,
                    append
                }),
            fileNumber: ({ value })=>({
                    path: value
                }),
            iterable: forbiddenIfSync,
            string: forbiddenIfSync,
            uint8Array: forbiddenIfSync
        }
    };
    const stripNewline = (value, { stripFinalNewline }, fdNumber)=>getStripFinalNewline(stripFinalNewline, fdNumber) && void 0 !== value && !Array.isArray(value) ? strip_final_newline_stripFinalNewline(value) : value;
    const getStripFinalNewline = (stripFinalNewline, fdNumber)=>'all' === fdNumber ? stripFinalNewline[1] || stripFinalNewline[2] : stripFinalNewline[fdNumber];
    const external_node_stream_namespaceObject = require("node:stream");
    const getSplitLinesGenerator = (binary, preserveNewlines, skipped, state)=>binary || skipped ? void 0 : initializeSplitLines(preserveNewlines, state);
    const splitLinesSync = (chunk, preserveNewlines, objectMode)=>objectMode ? chunk.flatMap((item)=>splitLinesItemSync(item, preserveNewlines)) : splitLinesItemSync(chunk, preserveNewlines);
    const splitLinesItemSync = (chunk, preserveNewlines)=>{
        const { transform, final } = initializeSplitLines(preserveNewlines, {});
        return [
            ...transform(chunk),
            ...final()
        ];
    };
    const initializeSplitLines = (preserveNewlines, state)=>{
        state.previousChunks = '';
        return {
            transform: splitGenerator.bind(void 0, state, preserveNewlines),
            final: linesFinal.bind(void 0, state)
        };
    };
    const splitGenerator = function*(state, preserveNewlines, chunk) {
        if ('string' != typeof chunk) {
            yield chunk;
            return;
        }
        let { previousChunks } = state;
        let start = -1;
        for(let end = 0; end < chunk.length; end += 1)if ('\n' === chunk[end]) {
            const newlineLength = getNewlineLength(chunk, end, preserveNewlines, state);
            let line = chunk.slice(start + 1, end + 1 - newlineLength);
            if (previousChunks.length > 0) {
                line = concatString(previousChunks, line);
                previousChunks = '';
            }
            yield line;
            start = end;
        }
        if (start !== chunk.length - 1) previousChunks = concatString(previousChunks, chunk.slice(start + 1));
        state.previousChunks = previousChunks;
    };
    const getNewlineLength = (chunk, end, preserveNewlines, state)=>{
        if (preserveNewlines) return 0;
        state.isWindowsNewline = 0 !== end && '\r' === chunk[end - 1];
        return state.isWindowsNewline ? 2 : 1;
    };
    const linesFinal = function*({ previousChunks }) {
        if (previousChunks.length > 0) yield previousChunks;
    };
    const getAppendNewlineGenerator = ({ binary, preserveNewlines, readableObjectMode, state })=>binary || preserveNewlines || readableObjectMode ? void 0 : {
            transform: appendNewlineGenerator.bind(void 0, state)
        };
    const appendNewlineGenerator = function*({ isWindowsNewline = false }, chunk) {
        const { unixNewline, windowsNewline, LF, concatBytes } = 'string' == typeof chunk ? linesStringInfo : linesUint8ArrayInfo;
        if (chunk.at(-1) === LF) {
            yield chunk;
            return;
        }
        const newline = isWindowsNewline ? windowsNewline : unixNewline;
        yield concatBytes(chunk, newline);
    };
    const concatString = (firstChunk, secondChunk)=>`${firstChunk}${secondChunk}`;
    const linesStringInfo = {
        windowsNewline: '\r\n',
        unixNewline: '\n',
        LF: '\n',
        concatBytes: concatString
    };
    const concatUint8Array = (firstChunk, secondChunk)=>{
        const chunk = new Uint8Array(firstChunk.length + secondChunk.length);
        chunk.set(firstChunk, 0);
        chunk.set(secondChunk, firstChunk.length);
        return chunk;
    };
    const linesUint8ArrayInfo = {
        windowsNewline: new Uint8Array([
            0x0D,
            0x0A
        ]),
        unixNewline: new Uint8Array([
            0x0A
        ]),
        LF: 0x0A,
        concatBytes: concatUint8Array
    };
    const external_node_buffer_namespaceObject = require("node:buffer");
    const getValidateTransformInput = (writableObjectMode, optionName)=>writableObjectMode ? void 0 : validateStringTransformInput.bind(void 0, optionName);
    const validateStringTransformInput = function*(optionName, chunk) {
        if ('string' != typeof chunk && !isUint8Array(chunk) && !external_node_buffer_namespaceObject.Buffer.isBuffer(chunk)) throw new TypeError(`The \`${optionName}\` option's transform must use "objectMode: true" to receive as input: ${typeof chunk}.`);
        yield chunk;
    };
    const getValidateTransformReturn = (readableObjectMode, optionName)=>readableObjectMode ? validateObjectTransformReturn.bind(void 0, optionName) : validateStringTransformReturn.bind(void 0, optionName);
    const validateObjectTransformReturn = function*(optionName, chunk) {
        validateEmptyReturn(optionName, chunk);
        yield chunk;
    };
    const validateStringTransformReturn = function*(optionName, chunk) {
        validateEmptyReturn(optionName, chunk);
        if ('string' != typeof chunk && !isUint8Array(chunk)) throw new TypeError(`The \`${optionName}\` option's function must yield a string or an Uint8Array, not ${typeof chunk}.`);
        yield chunk;
    };
    const validateEmptyReturn = (optionName, chunk)=>{
        if (null == chunk) throw new TypeError(`The \`${optionName}\` option's function must not call \`yield ${chunk}\`.
Instead, \`yield\` should either be called with a value, or not be called at all. For example:
  if (condition) { yield value; }`);
    };
    const getEncodingTransformGenerator = (binary, encoding, skipped)=>{
        if (skipped) return;
        if (binary) return {
            transform: encodingUint8ArrayGenerator.bind(void 0, new TextEncoder())
        };
        const stringDecoder = new external_node_string_decoder_namespaceObject.StringDecoder(encoding);
        return {
            transform: encodingStringGenerator.bind(void 0, stringDecoder),
            final: encodingStringFinal.bind(void 0, stringDecoder)
        };
    };
    const encodingUint8ArrayGenerator = function*(textEncoder, chunk) {
        if (external_node_buffer_namespaceObject.Buffer.isBuffer(chunk)) yield bufferToUint8Array(chunk);
        else if ('string' == typeof chunk) yield textEncoder.encode(chunk);
        else yield chunk;
    };
    const encodingStringGenerator = function*(stringDecoder, chunk) {
        yield isUint8Array(chunk) ? stringDecoder.write(chunk) : chunk;
    };
    const encodingStringFinal = function*(stringDecoder) {
        const lastChunk = stringDecoder.end();
        if ('' !== lastChunk) yield lastChunk;
    };
    const pushChunks = (0, external_node_util_namespaceObject.callbackify)(async (getChunks, state, getChunksArguments, transformStream)=>{
        state.currentIterable = getChunks(...getChunksArguments);
        try {
            for await (const chunk of state.currentIterable)transformStream.push(chunk);
        } finally{
            delete state.currentIterable;
        }
    });
    const transformChunk = async function*(chunk, generators, index) {
        if (index === generators.length) {
            yield chunk;
            return;
        }
        const { transform = identityGenerator } = generators[index];
        for await (const transformedChunk of transform(chunk))yield* transformChunk(transformedChunk, generators, index + 1);
    };
    const finalChunks = async function*(generators) {
        for (const [index, { final }] of Object.entries(generators))yield* generatorFinalChunks(final, Number(index), generators);
    };
    const generatorFinalChunks = async function*(final, index, generators) {
        if (void 0 === final) return;
        for await (const finalChunk of final())yield* transformChunk(finalChunk, generators, index + 1);
    };
    const destroyTransform = (0, external_node_util_namespaceObject.callbackify)(async ({ currentIterable }, error)=>{
        if (void 0 !== currentIterable) {
            await (error ? currentIterable.throw(error) : currentIterable.return());
            return;
        }
        if (error) throw error;
    });
    const identityGenerator = function*(chunk) {
        yield chunk;
    };
    const pushChunksSync = (getChunksSync, getChunksArguments, transformStream, done)=>{
        try {
            for (const chunk of getChunksSync(...getChunksArguments))transformStream.push(chunk);
            done();
        } catch (error) {
            done(error);
        }
    };
    const runTransformSync = (generators, chunks)=>[
            ...chunks.flatMap((chunk)=>[
                    ...transformChunkSync(chunk, generators, 0)
                ]),
            ...finalChunksSync(generators)
        ];
    const transformChunkSync = function*(chunk, generators, index) {
        if (index === generators.length) {
            yield chunk;
            return;
        }
        const { transform = run_sync_identityGenerator } = generators[index];
        for (const transformedChunk of transform(chunk))yield* transformChunkSync(transformedChunk, generators, index + 1);
    };
    const finalChunksSync = function*(generators) {
        for (const [index, { final }] of Object.entries(generators))yield* generatorFinalChunksSync(final, Number(index), generators);
    };
    const generatorFinalChunksSync = function*(final, index, generators) {
        if (void 0 === final) return;
        for (const finalChunk of final())yield* transformChunkSync(finalChunk, generators, index + 1);
    };
    const run_sync_identityGenerator = function*(chunk) {
        yield chunk;
    };
    const generatorToStream = ({ value, value: { transform, final, writableObjectMode, readableObjectMode }, optionName }, { encoding })=>{
        const state = {};
        const generators = addInternalGenerators(value, encoding, optionName);
        const transformAsync = isAsyncGenerator(transform);
        const finalAsync = isAsyncGenerator(final);
        const transformMethod = transformAsync ? pushChunks.bind(void 0, transformChunk, state) : pushChunksSync.bind(void 0, transformChunkSync);
        const finalMethod = transformAsync || finalAsync ? pushChunks.bind(void 0, finalChunks, state) : pushChunksSync.bind(void 0, finalChunksSync);
        const destroyMethod = transformAsync || finalAsync ? destroyTransform.bind(void 0, state) : void 0;
        const stream = new external_node_stream_namespaceObject.Transform({
            writableObjectMode,
            writableHighWaterMark: (0, external_node_stream_namespaceObject.getDefaultHighWaterMark)(writableObjectMode),
            readableObjectMode,
            readableHighWaterMark: (0, external_node_stream_namespaceObject.getDefaultHighWaterMark)(readableObjectMode),
            transform (chunk, encoding, done) {
                transformMethod([
                    chunk,
                    generators,
                    0
                ], this, done);
            },
            flush (done) {
                finalMethod([
                    generators
                ], this, done);
            },
            destroy: destroyMethod
        });
        return {
            stream
        };
    };
    const runGeneratorsSync = (chunks, stdioItems, encoding, isInput)=>{
        const generators = stdioItems.filter(({ type })=>'generator' === type);
        const reversedGenerators = isInput ? generators.reverse() : generators;
        for (const { value, optionName } of reversedGenerators){
            const generators = addInternalGenerators(value, encoding, optionName);
            chunks = runTransformSync(generators, chunks);
        }
        return chunks;
    };
    const addInternalGenerators = ({ transform, final, binary, writableObjectMode, readableObjectMode, preserveNewlines }, encoding, optionName)=>{
        const state = {};
        return [
            {
                transform: getValidateTransformInput(writableObjectMode, optionName)
            },
            getEncodingTransformGenerator(binary, encoding, writableObjectMode),
            getSplitLinesGenerator(binary, preserveNewlines, writableObjectMode, state),
            {
                transform,
                final
            },
            {
                transform: getValidateTransformReturn(readableObjectMode, optionName)
            },
            getAppendNewlineGenerator({
                binary,
                preserveNewlines,
                readableObjectMode,
                state
            })
        ].filter(Boolean);
    };
    const addInputOptionsSync = (fileDescriptors, options)=>{
        for (const fdNumber of getInputFdNumbers(fileDescriptors))addInputOptionSync(fileDescriptors, fdNumber, options);
    };
    const getInputFdNumbers = (fileDescriptors)=>new Set(Object.entries(fileDescriptors).filter(([, { direction }])=>'input' === direction).map(([fdNumber])=>Number(fdNumber)));
    const addInputOptionSync = (fileDescriptors, fdNumber, options)=>{
        const { stdioItems } = fileDescriptors[fdNumber];
        const allStdioItems = stdioItems.filter(({ contents })=>void 0 !== contents);
        if (0 === allStdioItems.length) return;
        if (0 !== fdNumber) {
            const [{ type, optionName }] = allStdioItems;
            throw new TypeError(`Only the \`stdin\` option, not \`${optionName}\`, can be ${TYPE_TO_MESSAGE[type]} with synchronous methods.`);
        }
        const allContents = allStdioItems.map(({ contents })=>contents);
        const transformedContents = allContents.map((contents)=>applySingleInputGeneratorsSync(contents, stdioItems));
        options.input = joinToUint8Array(transformedContents);
    };
    const applySingleInputGeneratorsSync = (contents, stdioItems)=>{
        const newContents = runGeneratorsSync(contents, stdioItems, 'utf8', true);
        validateSerializable(newContents);
        return joinToUint8Array(newContents);
    };
    const validateSerializable = (newContents)=>{
        const invalidItem = newContents.find((item)=>'string' != typeof item && !isUint8Array(item));
        if (void 0 !== invalidItem) throw new TypeError(`The \`stdin\` option is invalid: when passing objects as input, a transform must be used to serialize them to strings or Uint8Arrays: ${invalidItem}.`);
    };
    const shouldLogOutput = ({ stdioItems, encoding, verboseInfo, fdNumber })=>'all' !== fdNumber && isFullVerbose(verboseInfo, fdNumber) && !BINARY_ENCODINGS.has(encoding) && fdUsesVerbose(fdNumber) && (stdioItems.some(({ type, value })=>'native' === type && PIPED_STDIO_VALUES.has(value)) || stdioItems.every(({ type })=>TRANSFORM_TYPES.has(type)));
    const fdUsesVerbose = (fdNumber)=>1 === fdNumber || 2 === fdNumber;
    const PIPED_STDIO_VALUES = new Set([
        'pipe',
        'overlapped'
    ]);
    const logLines = async (linesIterable, stream, fdNumber, verboseInfo)=>{
        for await (const line of linesIterable)if (!isPipingStream(stream)) logLine(line, fdNumber, verboseInfo);
    };
    const logLinesSync = (linesArray, fdNumber, verboseInfo)=>{
        for (const line of linesArray)logLine(line, fdNumber, verboseInfo);
    };
    const isPipingStream = (stream)=>stream._readableState.pipes.length > 0;
    const logLine = (line, fdNumber, verboseInfo)=>{
        const verboseMessage = serializeVerboseMessage(line);
        verboseLog({
            type: 'output',
            verboseMessage,
            fdNumber,
            verboseInfo
        });
    };
    const transformOutputSync = ({ fileDescriptors, syncResult: { output }, options, isMaxBuffer, verboseInfo })=>{
        if (null === output) return {
            output: Array.from({
                length: 3
            })
        };
        const state = {};
        const outputFiles = new Set([]);
        const transformedOutput = output.map((result, fdNumber)=>transformOutputResultSync({
                result,
                fileDescriptors,
                fdNumber,
                state,
                outputFiles,
                isMaxBuffer,
                verboseInfo
            }, options));
        return {
            output: transformedOutput,
            ...state
        };
    };
    const transformOutputResultSync = ({ result, fileDescriptors, fdNumber, state, outputFiles, isMaxBuffer, verboseInfo }, { buffer, encoding, lines, stripFinalNewline, maxBuffer })=>{
        if (null === result) return;
        const truncatedResult = truncateMaxBufferSync(result, isMaxBuffer, maxBuffer);
        const uint8ArrayResult = bufferToUint8Array(truncatedResult);
        const { stdioItems, objectMode } = fileDescriptors[fdNumber];
        const chunks = runOutputGeneratorsSync([
            uint8ArrayResult
        ], stdioItems, encoding, state);
        const { serializedResult, finalResult = serializedResult } = serializeChunks({
            chunks,
            objectMode,
            encoding,
            lines,
            stripFinalNewline,
            fdNumber
        });
        logOutputSync({
            serializedResult,
            fdNumber,
            state,
            verboseInfo,
            encoding,
            stdioItems,
            objectMode
        });
        const returnedResult = buffer[fdNumber] ? finalResult : void 0;
        try {
            if (void 0 === state.error) writeToFiles(serializedResult, stdioItems, outputFiles);
            return returnedResult;
        } catch (error) {
            state.error = error;
            return returnedResult;
        }
    };
    const runOutputGeneratorsSync = (chunks, stdioItems, encoding, state)=>{
        try {
            return runGeneratorsSync(chunks, stdioItems, encoding, false);
        } catch (error) {
            state.error = error;
            return chunks;
        }
    };
    const serializeChunks = ({ chunks, objectMode, encoding, lines, stripFinalNewline, fdNumber })=>{
        if (objectMode) return {
            serializedResult: chunks
        };
        if ('buffer' === encoding) return {
            serializedResult: joinToUint8Array(chunks)
        };
        const serializedResult = joinToString(chunks, encoding);
        if (lines[fdNumber]) return {
            serializedResult,
            finalResult: splitLinesSync(serializedResult, !stripFinalNewline[fdNumber], objectMode)
        };
        return {
            serializedResult
        };
    };
    const logOutputSync = ({ serializedResult, fdNumber, state, verboseInfo, encoding, stdioItems, objectMode })=>{
        if (!shouldLogOutput({
            stdioItems,
            encoding,
            verboseInfo,
            fdNumber
        })) return;
        const linesArray = splitLinesSync(serializedResult, false, objectMode);
        try {
            logLinesSync(linesArray, fdNumber, verboseInfo);
        } catch (error) {
            state.error ??= error;
        }
    };
    const writeToFiles = (serializedResult, stdioItems, outputFiles)=>{
        for (const { path, append } of stdioItems.filter(({ type })=>FILE_TYPES.has(type))){
            const pathString = 'string' == typeof path ? path : path.toString();
            if (append || outputFiles.has(pathString)) (0, external_node_fs_namespaceObject.appendFileSync)(path, serializedResult);
            else {
                outputFiles.add(pathString);
                (0, external_node_fs_namespaceObject.writeFileSync)(path, serializedResult);
            }
        }
    };
    const getAllSync = ([, stdout, stderr], options)=>{
        if (!options.all) return;
        if (void 0 === stdout) return stderr;
        if (void 0 === stderr) return stdout;
        if (Array.isArray(stdout)) return Array.isArray(stderr) ? [
            ...stdout,
            ...stderr
        ] : [
            ...stdout,
            stripNewline(stderr, options, 'all')
        ];
        if (Array.isArray(stderr)) return [
            stripNewline(stdout, options, 'all'),
            ...stderr
        ];
        if (isUint8Array(stdout) && isUint8Array(stderr)) return concatUint8Arrays([
            stdout,
            stderr
        ]);
        return `${stdout}${stderr}`;
    };
    const waitForExit = async (subprocess, context)=>{
        const [exitCode, signal] = await waitForExitOrError(subprocess);
        context.isForcefullyTerminated ??= false;
        return [
            exitCode,
            signal
        ];
    };
    const waitForExitOrError = async (subprocess)=>{
        const [spawnPayload, exitPayload] = await Promise.allSettled([
            (0, external_node_events_namespaceObject.once)(subprocess, 'spawn'),
            (0, external_node_events_namespaceObject.once)(subprocess, 'exit')
        ]);
        if ('rejected' === spawnPayload.status) return [];
        return 'rejected' === exitPayload.status ? waitForSubprocessExit(subprocess) : exitPayload.value;
    };
    const waitForSubprocessExit = async (subprocess)=>{
        try {
            return await (0, external_node_events_namespaceObject.once)(subprocess, 'exit');
        } catch  {
            return waitForSubprocessExit(subprocess);
        }
    };
    const waitForSuccessfulExit = async (exitPromise)=>{
        const [exitCode, signal] = await exitPromise;
        if (!isSubprocessErrorExit(exitCode, signal) && isFailedExit(exitCode, signal)) throw new DiscardedError();
        return [
            exitCode,
            signal
        ];
    };
    const isSubprocessErrorExit = (exitCode, signal)=>void 0 === exitCode && void 0 === signal;
    const isFailedExit = (exitCode, signal)=>0 !== exitCode || null !== signal;
    const getExitResultSync = ({ error, status: exitCode, signal, output }, { maxBuffer })=>{
        const resultError = getResultError(error, exitCode, signal);
        const timedOut = resultError?.code === 'ETIMEDOUT';
        const isMaxBuffer = isMaxBufferSync(resultError, output, maxBuffer);
        return {
            resultError,
            exitCode,
            signal,
            timedOut,
            isMaxBuffer
        };
    };
    const getResultError = (error, exitCode, signal)=>{
        if (void 0 !== error) return error;
        return isFailedExit(exitCode, signal) ? new DiscardedError() : void 0;
    };
    const execaCoreSync = (rawFile, rawArguments, rawOptions)=>{
        const { file, commandArguments, command, escapedCommand, startTime, verboseInfo, options, fileDescriptors } = handleSyncArguments(rawFile, rawArguments, rawOptions);
        const result = spawnSubprocessSync({
            file,
            commandArguments,
            options,
            command,
            escapedCommand,
            verboseInfo,
            fileDescriptors,
            startTime
        });
        return handleResult(result, verboseInfo, options);
    };
    const handleSyncArguments = (rawFile, rawArguments, rawOptions)=>{
        const { command, escapedCommand, startTime, verboseInfo } = handleCommand(rawFile, rawArguments, rawOptions);
        const syncOptions = normalizeSyncOptions(rawOptions);
        const { file, commandArguments, options } = normalizeOptions(rawFile, rawArguments, syncOptions);
        validateSyncOptions(options);
        const fileDescriptors = handleStdioSync(options, verboseInfo);
        return {
            file,
            commandArguments,
            command,
            escapedCommand,
            startTime,
            verboseInfo,
            options,
            fileDescriptors
        };
    };
    const normalizeSyncOptions = (options)=>options.node && !options.ipc ? {
            ...options,
            ipc: false
        } : options;
    const validateSyncOptions = ({ ipc, ipcInput, detached, cancelSignal })=>{
        if (ipcInput) throwInvalidSyncOption('ipcInput');
        if (ipc) throwInvalidSyncOption('ipc: true');
        if (detached) throwInvalidSyncOption('detached: true');
        if (cancelSignal) throwInvalidSyncOption('cancelSignal');
    };
    const throwInvalidSyncOption = (value)=>{
        throw new TypeError(`The "${value}" option cannot be used with synchronous methods.`);
    };
    const spawnSubprocessSync = ({ file, commandArguments, options, command, escapedCommand, verboseInfo, fileDescriptors, startTime })=>{
        const syncResult = runSubprocessSync({
            file,
            commandArguments,
            options,
            command,
            escapedCommand,
            fileDescriptors,
            startTime
        });
        if (syncResult.failed) return syncResult;
        const { resultError, exitCode, signal, timedOut, isMaxBuffer } = getExitResultSync(syncResult, options);
        const { output, error = resultError } = transformOutputSync({
            fileDescriptors,
            syncResult,
            options,
            isMaxBuffer,
            verboseInfo
        });
        const stdio = output.map((stdioOutput, fdNumber)=>stripNewline(stdioOutput, options, fdNumber));
        const all = stripNewline(getAllSync(output, options), options, 'all');
        return getSyncResult({
            error,
            exitCode,
            signal,
            timedOut,
            isMaxBuffer,
            stdio,
            all,
            options,
            command,
            escapedCommand,
            startTime
        });
    };
    const runSubprocessSync = ({ file, commandArguments, options, command, escapedCommand, fileDescriptors, startTime })=>{
        try {
            addInputOptionsSync(fileDescriptors, options);
            const normalizedOptions = normalizeSpawnSyncOptions(options);
            return (0, external_node_child_process_namespaceObject.spawnSync)(file, commandArguments, normalizedOptions);
        } catch (error) {
            return makeEarlyError({
                error,
                command,
                escapedCommand,
                fileDescriptors,
                options,
                startTime,
                isSync: true
            });
        }
    };
    const normalizeSpawnSyncOptions = ({ encoding, maxBuffer, ...options })=>({
            ...options,
            encoding: 'buffer',
            maxBuffer: getMaxBufferSync(maxBuffer)
        });
    const getSyncResult = ({ error, exitCode, signal, timedOut, isMaxBuffer, stdio, all, options, command, escapedCommand, startTime })=>void 0 === error ? makeSuccessResult({
            command,
            escapedCommand,
            stdio,
            all,
            ipcOutput: [],
            options,
            startTime
        }) : makeError({
            error,
            command,
            escapedCommand,
            timedOut,
            isCanceled: false,
            isGracefullyCanceled: false,
            isMaxBuffer,
            isForcefullyTerminated: false,
            exitCode,
            signal,
            stdio,
            all,
            ipcOutput: [],
            options,
            startTime,
            isSync: true
        });
    const getOneMessage = ({ anyProcess, channel, isSubprocess, ipc }, { reference = true, filter } = {})=>{
        validateIpcMethod({
            methodName: 'getOneMessage',
            isSubprocess,
            ipc,
            isConnected: forward_isConnected(anyProcess)
        });
        return getOneMessageAsync({
            anyProcess,
            channel,
            isSubprocess,
            filter,
            reference
        });
    };
    const getOneMessageAsync = async ({ anyProcess, channel, isSubprocess, filter, reference })=>{
        addReference(channel, reference);
        const ipcEmitter = getIpcEmitter(anyProcess, channel, isSubprocess);
        const controller = new AbortController();
        try {
            return await Promise.race([
                getMessage(ipcEmitter, filter, controller),
                get_one_throwOnDisconnect(ipcEmitter, isSubprocess, controller),
                throwOnStrictError(ipcEmitter, isSubprocess, controller)
            ]);
        } catch (error) {
            disconnect(anyProcess);
            throw error;
        } finally{
            controller.abort();
            removeReference(channel, reference);
        }
    };
    const getMessage = async (ipcEmitter, filter, { signal })=>{
        if (void 0 === filter) {
            const [message] = await (0, external_node_events_namespaceObject.once)(ipcEmitter, 'message', {
                signal
            });
            return message;
        }
        for await (const [message] of (0, external_node_events_namespaceObject.on)(ipcEmitter, 'message', {
            signal
        }))if (filter(message)) return message;
    };
    const get_one_throwOnDisconnect = async (ipcEmitter, isSubprocess, { signal })=>{
        await (0, external_node_events_namespaceObject.once)(ipcEmitter, 'disconnect', {
            signal
        });
        throwOnEarlyDisconnect(isSubprocess);
    };
    const throwOnStrictError = async (ipcEmitter, isSubprocess, { signal })=>{
        const [error] = await (0, external_node_events_namespaceObject.once)(ipcEmitter, 'strict:error', {
            signal
        });
        throw getStrictResponseError(error, isSubprocess);
    };
    const getEachMessage = ({ anyProcess, channel, isSubprocess, ipc }, { reference = true } = {})=>loopOnMessages({
            anyProcess,
            channel,
            isSubprocess,
            ipc,
            shouldAwait: !isSubprocess,
            reference
        });
    const loopOnMessages = ({ anyProcess, channel, isSubprocess, ipc, shouldAwait, reference })=>{
        validateIpcMethod({
            methodName: 'getEachMessage',
            isSubprocess,
            ipc,
            isConnected: forward_isConnected(anyProcess)
        });
        addReference(channel, reference);
        const ipcEmitter = getIpcEmitter(anyProcess, channel, isSubprocess);
        const controller = new AbortController();
        const state = {};
        stopOnDisconnect(anyProcess, ipcEmitter, controller);
        abortOnStrictError({
            ipcEmitter,
            isSubprocess,
            controller,
            state
        });
        return iterateOnMessages({
            anyProcess,
            channel,
            ipcEmitter,
            isSubprocess,
            shouldAwait,
            controller,
            state,
            reference
        });
    };
    const stopOnDisconnect = async (anyProcess, ipcEmitter, controller)=>{
        try {
            await (0, external_node_events_namespaceObject.once)(ipcEmitter, 'disconnect', {
                signal: controller.signal
            });
            controller.abort();
        } catch  {}
    };
    const abortOnStrictError = async ({ ipcEmitter, isSubprocess, controller, state })=>{
        try {
            const [error] = await (0, external_node_events_namespaceObject.once)(ipcEmitter, 'strict:error', {
                signal: controller.signal
            });
            state.error = getStrictResponseError(error, isSubprocess);
            controller.abort();
        } catch  {}
    };
    const iterateOnMessages = async function*({ anyProcess, channel, ipcEmitter, isSubprocess, shouldAwait, controller, state, reference }) {
        try {
            for await (const [message] of (0, external_node_events_namespaceObject.on)(ipcEmitter, 'message', {
                signal: controller.signal
            })){
                throwIfStrictError(state);
                yield message;
            }
        } catch  {
            throwIfStrictError(state);
        } finally{
            controller.abort();
            removeReference(channel, reference);
            if (!isSubprocess) disconnect(anyProcess);
            if (shouldAwait) await anyProcess;
        }
    };
    const throwIfStrictError = ({ error })=>{
        if (error) throw error;
    };
    const addIpcMethods = (subprocess, { ipc })=>{
        Object.assign(subprocess, getIpcMethods(subprocess, false, ipc));
    };
    const getIpcExport = ()=>{
        const anyProcess = external_node_process_namespaceObject;
        const isSubprocess = true;
        const ipc = void 0 !== external_node_process_namespaceObject.channel;
        return {
            ...getIpcMethods(anyProcess, isSubprocess, ipc),
            getCancelSignal: getCancelSignal.bind(void 0, {
                anyProcess,
                channel: anyProcess.channel,
                isSubprocess,
                ipc
            })
        };
    };
    const getIpcMethods = (anyProcess, isSubprocess, ipc)=>({
            sendMessage: sendMessage.bind(void 0, {
                anyProcess,
                channel: anyProcess.channel,
                isSubprocess,
                ipc
            }),
            getOneMessage: getOneMessage.bind(void 0, {
                anyProcess,
                channel: anyProcess.channel,
                isSubprocess,
                ipc
            }),
            getEachMessage: getEachMessage.bind(void 0, {
                anyProcess,
                channel: anyProcess.channel,
                isSubprocess,
                ipc
            })
        });
    const handleEarlyError = ({ error, command, escapedCommand, fileDescriptors, options, startTime, verboseInfo })=>{
        cleanupCustomStreams(fileDescriptors);
        const subprocess = new external_node_child_process_namespaceObject.ChildProcess();
        createDummyStreams(subprocess, fileDescriptors);
        Object.assign(subprocess, {
            readable: early_error_readable,
            writable: early_error_writable,
            duplex: early_error_duplex
        });
        const earlyError = makeEarlyError({
            error,
            command,
            escapedCommand,
            fileDescriptors,
            options,
            startTime,
            isSync: false
        });
        const promise = handleDummyPromise(earlyError, verboseInfo, options);
        return {
            subprocess,
            promise
        };
    };
    const createDummyStreams = (subprocess, fileDescriptors)=>{
        const stdin = createDummyStream();
        const stdout = createDummyStream();
        const stderr = createDummyStream();
        const extraStdio = Array.from({
            length: fileDescriptors.length - 3
        }, createDummyStream);
        const all = createDummyStream();
        const stdio = [
            stdin,
            stdout,
            stderr,
            ...extraStdio
        ];
        Object.assign(subprocess, {
            stdin,
            stdout,
            stderr,
            all,
            stdio
        });
    };
    const createDummyStream = ()=>{
        const stream = new external_node_stream_namespaceObject.PassThrough();
        stream.end();
        return stream;
    };
    const early_error_readable = ()=>new external_node_stream_namespaceObject.Readable({
            read () {}
        });
    const early_error_writable = ()=>new external_node_stream_namespaceObject.Writable({
            write () {}
        });
    const early_error_duplex = ()=>new external_node_stream_namespaceObject.Duplex({
            read () {},
            write () {}
        });
    const handleDummyPromise = async (error, verboseInfo, options)=>handleResult(error, verboseInfo, options);
    const handleStdioAsync = (options, verboseInfo)=>handleStdio(addPropertiesAsync, options, verboseInfo, false);
    const forbiddenIfAsync = ({ type, optionName })=>{
        throw new TypeError(`The \`${optionName}\` option cannot be ${TYPE_TO_MESSAGE[type]}.`);
    };
    const handle_async_addProperties = {
        fileNumber: forbiddenIfAsync,
        generator: generatorToStream,
        asyncGenerator: generatorToStream,
        nodeStream: ({ value })=>({
                stream: value
            }),
        webTransform ({ value: { transform, writableObjectMode, readableObjectMode } }) {
            const objectMode = writableObjectMode || readableObjectMode;
            const stream = external_node_stream_namespaceObject.Duplex.fromWeb(transform, {
                objectMode
            });
            return {
                stream
            };
        },
        duplex: ({ value: { transform } })=>({
                stream: transform
            }),
        native () {}
    };
    const addPropertiesAsync = {
        input: {
            ...handle_async_addProperties,
            fileUrl: ({ value })=>({
                    stream: (0, external_node_fs_namespaceObject.createReadStream)(value)
                }),
            filePath: ({ value: { file } })=>({
                    stream: (0, external_node_fs_namespaceObject.createReadStream)(file)
                }),
            webStream: ({ value })=>({
                    stream: external_node_stream_namespaceObject.Readable.fromWeb(value)
                }),
            iterable: ({ value })=>({
                    stream: external_node_stream_namespaceObject.Readable.from(value)
                }),
            asyncIterable: ({ value })=>({
                    stream: external_node_stream_namespaceObject.Readable.from(value)
                }),
            string: ({ value })=>({
                    stream: external_node_stream_namespaceObject.Readable.from(value)
                }),
            uint8Array: ({ value })=>({
                    stream: external_node_stream_namespaceObject.Readable.from(external_node_buffer_namespaceObject.Buffer.from(value))
                })
        },
        output: {
            ...handle_async_addProperties,
            fileUrl: ({ value })=>({
                    stream: (0, external_node_fs_namespaceObject.createWriteStream)(value)
                }),
            filePath: ({ value: { file, append } })=>({
                    stream: (0, external_node_fs_namespaceObject.createWriteStream)(file, append ? {
                        flags: 'a'
                    } : {})
                }),
            webStream: ({ value })=>({
                    stream: external_node_stream_namespaceObject.Writable.fromWeb(value)
                }),
            iterable: forbiddenIfAsync,
            asyncIterable: forbiddenIfAsync,
            string: forbiddenIfAsync,
            uint8Array: forbiddenIfAsync
        }
    };
    const external_node_stream_promises_namespaceObject = require("node:stream/promises");
    function mergeStreams(streams) {
        if (!Array.isArray(streams)) throw new TypeError(`Expected an array, got \`${typeof streams}\`.`);
        for (const stream of streams)validateStream(stream);
        const objectMode = streams.some(({ readableObjectMode })=>readableObjectMode);
        const highWaterMark = getHighWaterMark(streams, objectMode);
        const passThroughStream = new MergedStream({
            objectMode,
            writableHighWaterMark: highWaterMark,
            readableHighWaterMark: highWaterMark
        });
        for (const stream of streams)passThroughStream.add(stream);
        return passThroughStream;
    }
    const getHighWaterMark = (streams, objectMode)=>{
        if (0 === streams.length) return (0, external_node_stream_namespaceObject.getDefaultHighWaterMark)(objectMode);
        const highWaterMarks = streams.filter(({ readableObjectMode })=>readableObjectMode === objectMode).map(({ readableHighWaterMark })=>readableHighWaterMark);
        return Math.max(...highWaterMarks);
    };
    class MergedStream extends external_node_stream_namespaceObject.PassThrough {
        #streams = new Set([]);
        #ended = new Set([]);
        #aborted = new Set([]);
        #onFinished;
        #unpipeEvent = Symbol('unpipe');
        #streamPromises = new WeakMap();
        add(stream) {
            validateStream(stream);
            if (this.#streams.has(stream)) return;
            this.#streams.add(stream);
            this.#onFinished ??= onMergedStreamFinished(this, this.#streams, this.#unpipeEvent);
            const streamPromise = endWhenStreamsDone({
                passThroughStream: this,
                stream,
                streams: this.#streams,
                ended: this.#ended,
                aborted: this.#aborted,
                onFinished: this.#onFinished,
                unpipeEvent: this.#unpipeEvent
            });
            this.#streamPromises.set(stream, streamPromise);
            stream.pipe(this, {
                end: false
            });
        }
        async remove(stream) {
            validateStream(stream);
            if (!this.#streams.has(stream)) return false;
            const streamPromise = this.#streamPromises.get(stream);
            if (void 0 === streamPromise) return false;
            this.#streamPromises.delete(stream);
            stream.unpipe(this);
            await streamPromise;
            return true;
        }
    }
    const onMergedStreamFinished = async (passThroughStream, streams, unpipeEvent)=>{
        updateMaxListeners(passThroughStream, PASSTHROUGH_LISTENERS_COUNT);
        const controller = new AbortController();
        try {
            await Promise.race([
                onMergedStreamEnd(passThroughStream, controller),
                onInputStreamsUnpipe(passThroughStream, streams, unpipeEvent, controller)
            ]);
        } finally{
            controller.abort();
            updateMaxListeners(passThroughStream, -PASSTHROUGH_LISTENERS_COUNT);
        }
    };
    const onMergedStreamEnd = async (passThroughStream, { signal })=>{
        try {
            await (0, external_node_stream_promises_namespaceObject.finished)(passThroughStream, {
                signal,
                cleanup: true
            });
        } catch (error) {
            errorOrAbortStream(passThroughStream, error);
            throw error;
        }
    };
    const onInputStreamsUnpipe = async (passThroughStream, streams, unpipeEvent, { signal })=>{
        for await (const [unpipedStream] of (0, external_node_events_namespaceObject.on)(passThroughStream, 'unpipe', {
            signal
        }))if (streams.has(unpipedStream)) unpipedStream.emit(unpipeEvent);
    };
    const validateStream = (stream)=>{
        if ('function' != typeof stream?.pipe) throw new TypeError(`Expected a readable stream, got: \`${typeof stream}\`.`);
    };
    const endWhenStreamsDone = async ({ passThroughStream, stream, streams, ended, aborted, onFinished, unpipeEvent })=>{
        updateMaxListeners(passThroughStream, PASSTHROUGH_LISTENERS_PER_STREAM);
        const controller = new AbortController();
        try {
            await Promise.race([
                afterMergedStreamFinished(onFinished, stream, controller),
                onInputStreamEnd({
                    passThroughStream,
                    stream,
                    streams,
                    ended,
                    aborted,
                    controller
                }),
                onInputStreamUnpipe({
                    stream,
                    streams,
                    ended,
                    aborted,
                    unpipeEvent,
                    controller
                })
            ]);
        } finally{
            controller.abort();
            updateMaxListeners(passThroughStream, -PASSTHROUGH_LISTENERS_PER_STREAM);
        }
        if (streams.size > 0 && streams.size === ended.size + aborted.size) {
            if (0 === ended.size && aborted.size > 0) abortStream(passThroughStream);
            else endStream(passThroughStream);
        }
    };
    const afterMergedStreamFinished = async (onFinished, stream, { signal })=>{
        try {
            await onFinished;
            if (!signal.aborted) abortStream(stream);
        } catch (error) {
            if (!signal.aborted) errorOrAbortStream(stream, error);
        }
    };
    const onInputStreamEnd = async ({ passThroughStream, stream, streams, ended, aborted, controller: { signal } })=>{
        try {
            await (0, external_node_stream_promises_namespaceObject.finished)(stream, {
                signal,
                cleanup: true,
                readable: true,
                writable: false
            });
            if (streams.has(stream)) ended.add(stream);
        } catch (error) {
            if (signal.aborted || !streams.has(stream)) return;
            if (isAbortError(error)) aborted.add(stream);
            else errorStream(passThroughStream, error);
        }
    };
    const onInputStreamUnpipe = async ({ stream, streams, ended, aborted, unpipeEvent, controller: { signal } })=>{
        await (0, external_node_events_namespaceObject.once)(stream, unpipeEvent, {
            signal
        });
        if (!stream.readable) return (0, external_node_events_namespaceObject.once)(signal, 'abort', {
            signal
        });
        streams.delete(stream);
        ended.delete(stream);
        aborted.delete(stream);
    };
    const endStream = (stream)=>{
        if (stream.writable) stream.end();
    };
    const errorOrAbortStream = (stream, error)=>{
        if (isAbortError(error)) abortStream(stream);
        else errorStream(stream, error);
    };
    const isAbortError = (error)=>error?.code === 'ERR_STREAM_PREMATURE_CLOSE';
    const abortStream = (stream)=>{
        if (stream.readable || stream.writable) stream.destroy();
    };
    const errorStream = (stream, error)=>{
        if (!stream.destroyed) {
            stream.once('error', noop);
            stream.destroy(error);
        }
    };
    const noop = ()=>{};
    const updateMaxListeners = (passThroughStream, increment)=>{
        const maxListeners = passThroughStream.getMaxListeners();
        if (0 !== maxListeners && maxListeners !== Number.POSITIVE_INFINITY) passThroughStream.setMaxListeners(maxListeners + increment);
    };
    const PASSTHROUGH_LISTENERS_COUNT = 2;
    const PASSTHROUGH_LISTENERS_PER_STREAM = 1;
    const pipeStreams = (source, destination)=>{
        source.pipe(destination);
        onSourceFinish(source, destination);
        onDestinationFinish(source, destination);
    };
    const onSourceFinish = async (source, destination)=>{
        if (isStandardStream(source) || isStandardStream(destination)) return;
        try {
            await (0, external_node_stream_promises_namespaceObject.finished)(source, {
                cleanup: true,
                readable: true,
                writable: false
            });
        } catch  {}
        endDestinationStream(destination);
    };
    const endDestinationStream = (destination)=>{
        if (destination.writable) destination.end();
    };
    const onDestinationFinish = async (source, destination)=>{
        if (isStandardStream(source) || isStandardStream(destination)) return;
        try {
            await (0, external_node_stream_promises_namespaceObject.finished)(destination, {
                cleanup: true,
                readable: false,
                writable: true
            });
        } catch  {}
        abortSourceStream(source);
    };
    const abortSourceStream = (source)=>{
        if (source.readable) source.destroy();
    };
    const pipeOutputAsync = (subprocess, fileDescriptors, controller)=>{
        const pipeGroups = new Map();
        for (const [fdNumber, { stdioItems, direction }] of Object.entries(fileDescriptors)){
            for (const { stream } of stdioItems.filter(({ type })=>TRANSFORM_TYPES.has(type)))pipeTransform(subprocess, stream, direction, fdNumber);
            for (const { stream } of stdioItems.filter(({ type })=>!TRANSFORM_TYPES.has(type)))pipeStdioItem({
                subprocess,
                stream,
                direction,
                fdNumber,
                pipeGroups,
                controller
            });
        }
        for (const [outputStream, inputStreams] of pipeGroups.entries()){
            const inputStream = 1 === inputStreams.length ? inputStreams[0] : mergeStreams(inputStreams);
            pipeStreams(inputStream, outputStream);
        }
    };
    const pipeTransform = (subprocess, stream, direction, fdNumber)=>{
        'output' === direction ? pipeStreams(subprocess.stdio[fdNumber], stream) : pipeStreams(stream, subprocess.stdio[fdNumber]);
        const streamProperty = SUBPROCESS_STREAM_PROPERTIES[fdNumber];
        if (void 0 !== streamProperty) subprocess[streamProperty] = stream;
        subprocess.stdio[fdNumber] = stream;
    };
    const SUBPROCESS_STREAM_PROPERTIES = [
        'stdin',
        'stdout',
        'stderr'
    ];
    const pipeStdioItem = ({ subprocess, stream, direction, fdNumber, pipeGroups, controller })=>{
        if (void 0 === stream) return;
        setStandardStreamMaxListeners(stream, controller);
        const [inputStream, outputStream] = 'output' === direction ? [
            stream,
            subprocess.stdio[fdNumber]
        ] : [
            subprocess.stdio[fdNumber],
            stream
        ];
        const outputStreams = pipeGroups.get(inputStream) ?? [];
        pipeGroups.set(inputStream, [
            ...outputStreams,
            outputStream
        ]);
    };
    const setStandardStreamMaxListeners = (stream, { signal })=>{
        if (isStandardStream(stream)) incrementMaxListeners(stream, MAX_LISTENERS_INCREMENT, signal);
    };
    const MAX_LISTENERS_INCREMENT = 2;
    const signals_signals = [];
    signals_signals.push('SIGHUP', 'SIGINT', 'SIGTERM');
    if ('win32' !== process.platform) signals_signals.push('SIGALRM', 'SIGABRT', 'SIGVTALRM', 'SIGXCPU', 'SIGXFSZ', 'SIGUSR2', 'SIGTRAP', 'SIGSYS', 'SIGQUIT', 'SIGIOT');
    if ('linux' === process.platform) signals_signals.push('SIGIO', 'SIGPOLL', 'SIGPWR', 'SIGSTKFLT');
    const processOk = (process1)=>!!process1 && 'object' == typeof process1 && 'function' == typeof process1.removeListener && 'function' == typeof process1.emit && 'function' == typeof process1.reallyExit && 'function' == typeof process1.listeners && 'function' == typeof process1.kill && 'number' == typeof process1.pid && 'function' == typeof process1.on;
    const kExitEmitter = Symbol.for('signal-exit emitter');
    const global1 = globalThis;
    const ObjectDefineProperty = Object.defineProperty.bind(Object);
    class Emitter {
        emitted = {
            afterExit: false,
            exit: false
        };
        listeners = {
            afterExit: [],
            exit: []
        };
        count = 0;
        id = Math.random();
        constructor(){
            if (global1[kExitEmitter]) return global1[kExitEmitter];
            ObjectDefineProperty(global1, kExitEmitter, {
                value: this,
                writable: false,
                enumerable: false,
                configurable: false
            });
        }
        on(ev, fn) {
            this.listeners[ev].push(fn);
        }
        removeListener(ev, fn) {
            const list = this.listeners[ev];
            const i = list.indexOf(fn);
            if (-1 === i) return;
            if (0 === i && 1 === list.length) list.length = 0;
            else list.splice(i, 1);
        }
        emit(ev, code, signal) {
            if (this.emitted[ev]) return false;
            this.emitted[ev] = true;
            let ret = false;
            for (const fn of this.listeners[ev])ret = true === fn(code, signal) || ret;
            if ('exit' === ev) ret = this.emit('afterExit', code, signal) || ret;
            return ret;
        }
    }
    class SignalExitBase {
    }
    const signalExitWrap = (handler)=>({
            onExit (cb, opts) {
                return handler.onExit(cb, opts);
            },
            load () {
                return handler.load();
            },
            unload () {
                return handler.unload();
            }
        });
    class SignalExitFallback extends SignalExitBase {
        onExit() {
            return ()=>{};
        }
        load() {}
        unload() {}
    }
    class SignalExit extends SignalExitBase {
        #hupSig = 'win32' === mjs_process.platform ? 'SIGINT' : 'SIGHUP';
        #emitter = new Emitter();
        #process;
        #originalProcessEmit;
        #originalProcessReallyExit;
        #sigListeners = {};
        #loaded = false;
        constructor(process1){
            super();
            this.#process = process1;
            this.#sigListeners = {};
            for (const sig of signals_signals)this.#sigListeners[sig] = ()=>{
                const listeners = this.#process.listeners(sig);
                let { count } = this.#emitter;
                const p = process1;
                if ('object' == typeof p.__signal_exit_emitter__ && 'number' == typeof p.__signal_exit_emitter__.count) count += p.__signal_exit_emitter__.count;
                if (listeners.length === count) {
                    this.unload();
                    const ret = this.#emitter.emit('exit', null, sig);
                    const s = 'SIGHUP' === sig ? this.#hupSig : sig;
                    if (!ret) process1.kill(process1.pid, s);
                }
            };
            this.#originalProcessReallyExit = process1.reallyExit;
            this.#originalProcessEmit = process1.emit;
        }
        onExit(cb, opts) {
            if (!processOk(this.#process)) return ()=>{};
            if (false === this.#loaded) this.load();
            const ev = opts?.alwaysLast ? 'afterExit' : 'exit';
            this.#emitter.on(ev, cb);
            return ()=>{
                this.#emitter.removeListener(ev, cb);
                if (0 === this.#emitter.listeners['exit'].length && 0 === this.#emitter.listeners['afterExit'].length) this.unload();
            };
        }
        load() {
            if (this.#loaded) return;
            this.#loaded = true;
            this.#emitter.count += 1;
            for (const sig of signals_signals)try {
                const fn = this.#sigListeners[sig];
                if (fn) this.#process.on(sig, fn);
            } catch (_) {}
            this.#process.emit = (ev, ...a)=>this.#processEmit(ev, ...a);
            this.#process.reallyExit = (code)=>this.#processReallyExit(code);
        }
        unload() {
            if (!this.#loaded) return;
            this.#loaded = false;
            signals_signals.forEach((sig)=>{
                const listener = this.#sigListeners[sig];
                if (!listener) throw new Error('Listener not defined for signal: ' + sig);
                try {
                    this.#process.removeListener(sig, listener);
                } catch (_) {}
            });
            this.#process.emit = this.#originalProcessEmit;
            this.#process.reallyExit = this.#originalProcessReallyExit;
            this.#emitter.count -= 1;
        }
        #processReallyExit(code) {
            if (!processOk(this.#process)) return 0;
            this.#process.exitCode = code || 0;
            this.#emitter.emit('exit', this.#process.exitCode, null);
            return this.#originalProcessReallyExit.call(this.#process, this.#process.exitCode);
        }
        #processEmit(ev, ...args) {
            const og = this.#originalProcessEmit;
            if (!('exit' === ev && processOk(this.#process))) return og.call(this.#process, ev, ...args);
            {
                if ('number' == typeof args[0]) this.#process.exitCode = args[0];
                const ret = og.call(this.#process, ev, ...args);
                this.#emitter.emit('exit', this.#process.exitCode, null);
                return ret;
            }
        }
    }
    const mjs_process = globalThis.process;
    const { onExit, load, unload } = signalExitWrap(processOk(mjs_process) ? new SignalExit(mjs_process) : new SignalExitFallback());
    const cleanupOnExit = (subprocess, { cleanup, detached }, { signal })=>{
        if (!cleanup || detached) return;
        const removeExitHandler = onExit(()=>{
            subprocess.kill();
        });
        (0, external_node_events_namespaceObject.addAbortListener)(signal, ()=>{
            removeExitHandler();
        });
    };
    const normalizePipeArguments = ({ source, sourcePromise, boundOptions, createNested }, ...pipeArguments)=>{
        const startTime = getStartTime();
        const { destination, destinationStream, destinationError, from, unpipeSignal } = getDestinationStream(boundOptions, createNested, pipeArguments);
        const { sourceStream, sourceError } = getSourceStream(source, from);
        const { options: sourceOptions, fileDescriptors } = SUBPROCESS_OPTIONS.get(source);
        return {
            sourcePromise,
            sourceStream,
            sourceOptions,
            sourceError,
            destination,
            destinationStream,
            destinationError,
            unpipeSignal,
            fileDescriptors,
            startTime
        };
    };
    const getDestinationStream = (boundOptions, createNested, pipeArguments)=>{
        try {
            const { destination, pipeOptions: { from, to, unpipeSignal } = {} } = getDestination(boundOptions, createNested, ...pipeArguments);
            const destinationStream = getToStream(destination, to);
            return {
                destination,
                destinationStream,
                from,
                unpipeSignal
            };
        } catch (error) {
            return {
                destinationError: error
            };
        }
    };
    const getDestination = (boundOptions, createNested, firstArgument, ...pipeArguments)=>{
        if (Array.isArray(firstArgument)) {
            const destination = createNested(mapDestinationArguments, boundOptions)(firstArgument, ...pipeArguments);
            return {
                destination,
                pipeOptions: boundOptions
            };
        }
        if ('string' == typeof firstArgument || firstArgument instanceof URL || isDenoExecPath(firstArgument)) {
            if (Object.keys(boundOptions).length > 0) throw new TypeError('Please use .pipe("file", ..., options) or .pipe(execa("file", ..., options)) instead of .pipe(options)("file", ...).');
            const [rawFile, rawArguments, rawOptions] = normalizeParameters(firstArgument, ...pipeArguments);
            const destination = createNested(mapDestinationArguments)(rawFile, rawArguments, rawOptions);
            return {
                destination,
                pipeOptions: rawOptions
            };
        }
        if (SUBPROCESS_OPTIONS.has(firstArgument)) {
            if (Object.keys(boundOptions).length > 0) throw new TypeError('Please use .pipe(options)`command` or .pipe($(options)`command`) instead of .pipe(options)($`command`).');
            return {
                destination: firstArgument,
                pipeOptions: pipeArguments[0]
            };
        }
        throw new TypeError(`The first argument must be a template string, an options object, or an Execa subprocess: ${firstArgument}`);
    };
    const mapDestinationArguments = ({ options })=>({
            options: {
                ...options,
                stdin: 'pipe',
                piped: true
            }
        });
    const getSourceStream = (source, from)=>{
        try {
            const sourceStream = getFromStream(source, from);
            return {
                sourceStream
            };
        } catch (error) {
            return {
                sourceError: error
            };
        }
    };
    const handlePipeArgumentsError = ({ sourceStream, sourceError, destinationStream, destinationError, fileDescriptors, sourceOptions, startTime })=>{
        const error = getPipeArgumentsError({
            sourceStream,
            sourceError,
            destinationStream,
            destinationError
        });
        if (void 0 !== error) throw createNonCommandError({
            error,
            fileDescriptors,
            sourceOptions,
            startTime
        });
    };
    const getPipeArgumentsError = ({ sourceStream, sourceError, destinationStream, destinationError })=>{
        if (void 0 !== sourceError && void 0 !== destinationError) return destinationError;
        if (void 0 !== destinationError) {
            abortSourceStream(sourceStream);
            return destinationError;
        }
        if (void 0 !== sourceError) {
            endDestinationStream(destinationStream);
            return sourceError;
        }
    };
    const createNonCommandError = ({ error, fileDescriptors, sourceOptions, startTime })=>makeEarlyError({
            error,
            command: PIPE_COMMAND_MESSAGE,
            escapedCommand: PIPE_COMMAND_MESSAGE,
            fileDescriptors,
            options: sourceOptions,
            startTime,
            isSync: false
        });
    const PIPE_COMMAND_MESSAGE = 'source.pipe(destination)';
    const waitForBothSubprocesses = async (subprocessPromises)=>{
        const [{ status: sourceStatus, reason: sourceReason, value: sourceResult = sourceReason }, { status: destinationStatus, reason: destinationReason, value: destinationResult = destinationReason }] = await subprocessPromises;
        if (!destinationResult.pipedFrom.includes(sourceResult)) destinationResult.pipedFrom.push(sourceResult);
        if ('rejected' === destinationStatus) throw destinationResult;
        if ('rejected' === sourceStatus) throw sourceResult;
        return destinationResult;
    };
    const pipeSubprocessStream = (sourceStream, destinationStream, maxListenersController)=>{
        const mergedStream = MERGED_STREAMS.has(destinationStream) ? pipeMoreSubprocessStream(sourceStream, destinationStream) : pipeFirstSubprocessStream(sourceStream, destinationStream);
        incrementMaxListeners(sourceStream, SOURCE_LISTENERS_PER_PIPE, maxListenersController.signal);
        incrementMaxListeners(destinationStream, DESTINATION_LISTENERS_PER_PIPE, maxListenersController.signal);
        cleanupMergedStreamsMap(destinationStream);
        return mergedStream;
    };
    const pipeFirstSubprocessStream = (sourceStream, destinationStream)=>{
        const mergedStream = mergeStreams([
            sourceStream
        ]);
        pipeStreams(mergedStream, destinationStream);
        MERGED_STREAMS.set(destinationStream, mergedStream);
        return mergedStream;
    };
    const pipeMoreSubprocessStream = (sourceStream, destinationStream)=>{
        const mergedStream = MERGED_STREAMS.get(destinationStream);
        mergedStream.add(sourceStream);
        return mergedStream;
    };
    const cleanupMergedStreamsMap = async (destinationStream)=>{
        try {
            await (0, external_node_stream_promises_namespaceObject.finished)(destinationStream, {
                cleanup: true,
                readable: false,
                writable: true
            });
        } catch  {}
        MERGED_STREAMS.delete(destinationStream);
    };
    const MERGED_STREAMS = new WeakMap();
    const SOURCE_LISTENERS_PER_PIPE = 2;
    const DESTINATION_LISTENERS_PER_PIPE = 1;
    const unpipeOnAbort = (unpipeSignal, unpipeContext)=>void 0 === unpipeSignal ? [] : [
            unpipeOnSignalAbort(unpipeSignal, unpipeContext)
        ];
    const unpipeOnSignalAbort = async (unpipeSignal, { sourceStream, mergedStream, fileDescriptors, sourceOptions, startTime })=>{
        await (0, external_node_util_namespaceObject.aborted)(unpipeSignal, sourceStream);
        await mergedStream.remove(sourceStream);
        const error = new Error('Pipe canceled by `unpipeSignal` option.');
        throw createNonCommandError({
            error,
            fileDescriptors,
            sourceOptions,
            startTime
        });
    };
    const pipeToSubprocess = (sourceInfo, ...pipeArguments)=>{
        if (isPlainObject(pipeArguments[0])) return pipeToSubprocess.bind(void 0, {
            ...sourceInfo,
            boundOptions: {
                ...sourceInfo.boundOptions,
                ...pipeArguments[0]
            }
        });
        const { destination, ...normalizedInfo } = normalizePipeArguments(sourceInfo, ...pipeArguments);
        const promise = handlePipePromise({
            ...normalizedInfo,
            destination
        });
        promise.pipe = pipeToSubprocess.bind(void 0, {
            ...sourceInfo,
            source: destination,
            sourcePromise: promise,
            boundOptions: {}
        });
        return promise;
    };
    const handlePipePromise = async ({ sourcePromise, sourceStream, sourceOptions, sourceError, destination, destinationStream, destinationError, unpipeSignal, fileDescriptors, startTime })=>{
        const subprocessPromises = getSubprocessPromises(sourcePromise, destination);
        handlePipeArgumentsError({
            sourceStream,
            sourceError,
            destinationStream,
            destinationError,
            fileDescriptors,
            sourceOptions,
            startTime
        });
        const maxListenersController = new AbortController();
        try {
            const mergedStream = pipeSubprocessStream(sourceStream, destinationStream, maxListenersController);
            return await Promise.race([
                waitForBothSubprocesses(subprocessPromises),
                ...unpipeOnAbort(unpipeSignal, {
                    sourceStream,
                    mergedStream,
                    sourceOptions,
                    fileDescriptors,
                    startTime
                })
            ]);
        } finally{
            maxListenersController.abort();
        }
    };
    const getSubprocessPromises = (sourcePromise, destination)=>Promise.allSettled([
            sourcePromise,
            destination
        ]);
    const utils_identity = (value)=>value;
    const utils_noop = ()=>void 0;
    const getContentsProperty = ({ contents })=>contents;
    const throwObjectStream = (chunk)=>{
        throw new Error(`Streams in object mode are not supported: ${String(chunk)}`);
    };
    const getLengthProperty = (convertedChunk)=>convertedChunk.length;
    async function getStreamAsArray(stream, options) {
        return getStreamContents(stream, arrayMethods, options);
    }
    const initArray = ()=>({
            contents: []
        });
    const array_increment = ()=>1;
    const addArrayChunk = (convertedChunk, { contents })=>{
        contents.push(convertedChunk);
        return contents;
    };
    const arrayMethods = {
        init: initArray,
        convertChunk: {
            string: utils_identity,
            buffer: utils_identity,
            arrayBuffer: utils_identity,
            dataView: utils_identity,
            typedArray: utils_identity,
            others: utils_identity
        },
        getSize: array_increment,
        truncateChunk: utils_noop,
        addChunk: addArrayChunk,
        getFinalChunk: utils_noop,
        finalize: getContentsProperty
    };
    async function getStreamAsArrayBuffer(stream, options) {
        return getStreamContents(stream, arrayBufferMethods, options);
    }
    const initArrayBuffer = ()=>({
            contents: new ArrayBuffer(0)
        });
    const useTextEncoder = (chunk)=>array_buffer_textEncoder.encode(chunk);
    const array_buffer_textEncoder = new TextEncoder();
    const useUint8Array = (chunk)=>new Uint8Array(chunk);
    const useUint8ArrayWithOffset = (chunk)=>new Uint8Array(chunk.buffer, chunk.byteOffset, chunk.byteLength);
    const truncateArrayBufferChunk = (convertedChunk, chunkSize)=>convertedChunk.slice(0, chunkSize);
    const addArrayBufferChunk = (convertedChunk, { contents, length: previousLength }, length)=>{
        const newContents = hasArrayBufferResize() ? resizeArrayBuffer(contents, length) : resizeArrayBufferSlow(contents, length);
        new Uint8Array(newContents).set(convertedChunk, previousLength);
        return newContents;
    };
    const resizeArrayBufferSlow = (contents, length)=>{
        if (length <= contents.byteLength) return contents;
        const arrayBuffer = new ArrayBuffer(getNewContentsLength(length));
        new Uint8Array(arrayBuffer).set(new Uint8Array(contents), 0);
        return arrayBuffer;
    };
    const resizeArrayBuffer = (contents, length)=>{
        if (length <= contents.maxByteLength) {
            contents.resize(length);
            return contents;
        }
        const arrayBuffer = new ArrayBuffer(length, {
            maxByteLength: getNewContentsLength(length)
        });
        new Uint8Array(arrayBuffer).set(new Uint8Array(contents), 0);
        return arrayBuffer;
    };
    const getNewContentsLength = (length)=>SCALE_FACTOR ** Math.ceil(Math.log(length) / Math.log(SCALE_FACTOR));
    const SCALE_FACTOR = 2;
    const finalizeArrayBuffer = ({ contents, length })=>hasArrayBufferResize() ? contents : contents.slice(0, length);
    const hasArrayBufferResize = ()=>'resize' in ArrayBuffer.prototype;
    const arrayBufferMethods = {
        init: initArrayBuffer,
        convertChunk: {
            string: useTextEncoder,
            buffer: useUint8Array,
            arrayBuffer: useUint8Array,
            dataView: useUint8ArrayWithOffset,
            typedArray: useUint8ArrayWithOffset,
            others: throwObjectStream
        },
        getSize: getLengthProperty,
        truncateChunk: truncateArrayBufferChunk,
        addChunk: addArrayBufferChunk,
        getFinalChunk: utils_noop,
        finalize: finalizeArrayBuffer
    };
    async function getStreamAsString(stream, options) {
        return getStreamContents(stream, stringMethods, options);
    }
    const initString = ()=>({
            contents: '',
            textDecoder: new TextDecoder()
        });
    const useTextDecoder = (chunk, { textDecoder })=>textDecoder.decode(chunk, {
            stream: true
        });
    const addStringChunk = (convertedChunk, { contents })=>contents + convertedChunk;
    const truncateStringChunk = (convertedChunk, chunkSize)=>convertedChunk.slice(0, chunkSize);
    const getFinalStringChunk = ({ textDecoder })=>{
        const finalChunk = textDecoder.decode();
        return '' === finalChunk ? void 0 : finalChunk;
    };
    const stringMethods = {
        init: initString,
        convertChunk: {
            string: utils_identity,
            buffer: useTextDecoder,
            arrayBuffer: useTextDecoder,
            dataView: useTextDecoder,
            typedArray: useTextDecoder,
            others: throwObjectStream
        },
        getSize: getLengthProperty,
        truncateChunk: truncateStringChunk,
        addChunk: addStringChunk,
        getFinalChunk: getFinalStringChunk,
        finalize: getContentsProperty
    };
    const iterateOnSubprocessStream = ({ subprocessStdout, subprocess, binary, shouldEncode, encoding, preserveNewlines })=>{
        const controller = new AbortController();
        stopReadingOnExit(subprocess, controller);
        return iterateOnStream({
            stream: subprocessStdout,
            controller,
            binary,
            shouldEncode: !subprocessStdout.readableObjectMode && shouldEncode,
            encoding,
            shouldSplit: !subprocessStdout.readableObjectMode,
            preserveNewlines
        });
    };
    const stopReadingOnExit = async (subprocess, controller)=>{
        try {
            await subprocess;
        } catch  {} finally{
            controller.abort();
        }
    };
    const iterateForResult = ({ stream, onStreamEnd, lines, encoding, stripFinalNewline, allMixed })=>{
        const controller = new AbortController();
        stopReadingOnStreamEnd(onStreamEnd, controller, stream);
        const objectMode = stream.readableObjectMode && !allMixed;
        return iterateOnStream({
            stream,
            controller,
            binary: 'buffer' === encoding,
            shouldEncode: !objectMode,
            encoding,
            shouldSplit: !objectMode && lines,
            preserveNewlines: !stripFinalNewline
        });
    };
    const stopReadingOnStreamEnd = async (onStreamEnd, controller, stream)=>{
        try {
            await onStreamEnd;
        } catch  {
            stream.destroy();
        } finally{
            controller.abort();
        }
    };
    const iterateOnStream = ({ stream, controller, binary, shouldEncode, encoding, shouldSplit, preserveNewlines })=>{
        const onStdoutChunk = (0, external_node_events_namespaceObject.on)(stream, 'data', {
            signal: controller.signal,
            highWaterMark: HIGH_WATER_MARK,
            highWatermark: HIGH_WATER_MARK
        });
        return iterateOnData({
            onStdoutChunk,
            controller,
            binary,
            shouldEncode,
            encoding,
            shouldSplit,
            preserveNewlines
        });
    };
    const DEFAULT_OBJECT_HIGH_WATER_MARK = (0, external_node_stream_namespaceObject.getDefaultHighWaterMark)(true);
    const HIGH_WATER_MARK = DEFAULT_OBJECT_HIGH_WATER_MARK;
    const iterateOnData = async function*({ onStdoutChunk, controller, binary, shouldEncode, encoding, shouldSplit, preserveNewlines }) {
        const generators = getGenerators({
            binary,
            shouldEncode,
            encoding,
            shouldSplit,
            preserveNewlines
        });
        try {
            for await (const [chunk] of onStdoutChunk)yield* transformChunkSync(chunk, generators, 0);
        } catch (error) {
            if (!controller.signal.aborted) throw error;
        } finally{
            yield* finalChunksSync(generators);
        }
    };
    const getGenerators = ({ binary, shouldEncode, encoding, shouldSplit, preserveNewlines })=>[
            getEncodingTransformGenerator(binary, encoding, !shouldEncode),
            getSplitLinesGenerator(binary, preserveNewlines, !shouldSplit, {})
        ].filter(Boolean);
    const getStreamOutput = async ({ stream, onStreamEnd, fdNumber, encoding, buffer, maxBuffer, lines, allMixed, stripFinalNewline, verboseInfo, streamInfo })=>{
        const logPromise = logOutputAsync({
            stream,
            onStreamEnd,
            fdNumber,
            encoding,
            allMixed,
            verboseInfo,
            streamInfo
        });
        if (!buffer) {
            await Promise.all([
                resumeStream(stream),
                logPromise
            ]);
            return;
        }
        const stripFinalNewlineValue = getStripFinalNewline(stripFinalNewline, fdNumber);
        const iterable = iterateForResult({
            stream,
            onStreamEnd,
            lines,
            encoding,
            stripFinalNewline: stripFinalNewlineValue,
            allMixed
        });
        const [output] = await Promise.all([
            contents_getStreamContents({
                stream,
                iterable,
                fdNumber,
                encoding,
                maxBuffer,
                lines
            }),
            logPromise
        ]);
        return output;
    };
    const logOutputAsync = async ({ stream, onStreamEnd, fdNumber, encoding, allMixed, verboseInfo, streamInfo: { fileDescriptors } })=>{
        if (!shouldLogOutput({
            stdioItems: fileDescriptors[fdNumber]?.stdioItems,
            encoding,
            verboseInfo,
            fdNumber
        })) return;
        const linesIterable = iterateForResult({
            stream,
            onStreamEnd,
            lines: true,
            encoding,
            stripFinalNewline: true,
            allMixed
        });
        await logLines(linesIterable, stream, fdNumber, verboseInfo);
    };
    const resumeStream = async (stream)=>{
        await (0, promises_namespaceObject.setImmediate)();
        if (null === stream.readableFlowing) stream.resume();
    };
    const contents_getStreamContents = async ({ stream, stream: { readableObjectMode }, iterable, fdNumber, encoding, maxBuffer, lines })=>{
        try {
            if (readableObjectMode || lines) return await getStreamAsArray(iterable, {
                maxBuffer
            });
            if ('buffer' === encoding) return new Uint8Array(await getStreamAsArrayBuffer(iterable, {
                maxBuffer
            }));
            return await getStreamAsString(iterable, {
                maxBuffer
            });
        } catch (error) {
            return handleBufferedData(handleMaxBuffer({
                error,
                stream,
                readableObjectMode,
                lines,
                encoding,
                fdNumber
            }));
        }
    };
    const getBufferedData = async (streamPromise)=>{
        try {
            return await streamPromise;
        } catch (error) {
            return handleBufferedData(error);
        }
    };
    const handleBufferedData = ({ bufferedData })=>isArrayBuffer(bufferedData) ? new Uint8Array(bufferedData) : bufferedData;
    const waitForStream = async (stream, fdNumber, streamInfo, { isSameDirection, stopOnExit = false } = {})=>{
        const state = handleStdinDestroy(stream, streamInfo);
        const abortController = new AbortController();
        try {
            await Promise.race([
                ...stopOnExit ? [
                    streamInfo.exitPromise
                ] : [],
                (0, external_node_stream_promises_namespaceObject.finished)(stream, {
                    cleanup: true,
                    signal: abortController.signal
                })
            ]);
        } catch (error) {
            if (!state.stdinCleanedUp) handleStreamError(error, fdNumber, streamInfo, isSameDirection);
        } finally{
            abortController.abort();
        }
    };
    const handleStdinDestroy = (stream, { originalStreams: [originalStdin], subprocess })=>{
        const state = {
            stdinCleanedUp: false
        };
        if (stream === originalStdin) spyOnStdinDestroy(stream, subprocess, state);
        return state;
    };
    const spyOnStdinDestroy = (subprocessStdin, subprocess, state)=>{
        const { _destroy } = subprocessStdin;
        subprocessStdin._destroy = (...destroyArguments)=>{
            setStdinCleanedUp(subprocess, state);
            _destroy.call(subprocessStdin, ...destroyArguments);
        };
    };
    const setStdinCleanedUp = ({ exitCode, signalCode }, state)=>{
        if (null !== exitCode || null !== signalCode) state.stdinCleanedUp = true;
    };
    const handleStreamError = (error, fdNumber, streamInfo, isSameDirection)=>{
        if (!shouldIgnoreStreamError(error, fdNumber, streamInfo, isSameDirection)) throw error;
    };
    const shouldIgnoreStreamError = (error, fdNumber, streamInfo, isSameDirection = true)=>{
        if (streamInfo.propagating) return isStreamEpipe(error) || isStreamAbort(error);
        streamInfo.propagating = true;
        return isInputFileDescriptor(streamInfo, fdNumber) === isSameDirection ? isStreamEpipe(error) : isStreamAbort(error);
    };
    const isInputFileDescriptor = ({ fileDescriptors }, fdNumber)=>'all' !== fdNumber && 'input' === fileDescriptors[fdNumber].direction;
    const isStreamAbort = (error)=>error?.code === 'ERR_STREAM_PREMATURE_CLOSE';
    const isStreamEpipe = (error)=>error?.code === 'EPIPE';
    const waitForStdioStreams = ({ subprocess, encoding, buffer, maxBuffer, lines, stripFinalNewline, verboseInfo, streamInfo })=>subprocess.stdio.map((stream, fdNumber)=>waitForSubprocessStream({
                stream,
                fdNumber,
                encoding,
                buffer: buffer[fdNumber],
                maxBuffer: maxBuffer[fdNumber],
                lines: lines[fdNumber],
                allMixed: false,
                stripFinalNewline,
                verboseInfo,
                streamInfo
            }));
    const waitForSubprocessStream = async ({ stream, fdNumber, encoding, buffer, maxBuffer, lines, allMixed, stripFinalNewline, verboseInfo, streamInfo })=>{
        if (!stream) return;
        const onStreamEnd = waitForStream(stream, fdNumber, streamInfo);
        if (isInputFileDescriptor(streamInfo, fdNumber)) {
            await onStreamEnd;
            return;
        }
        const [output] = await Promise.all([
            getStreamOutput({
                stream,
                onStreamEnd,
                fdNumber,
                encoding,
                buffer,
                maxBuffer,
                lines,
                allMixed,
                stripFinalNewline,
                verboseInfo,
                streamInfo
            }),
            onStreamEnd
        ]);
        return output;
    };
    const makeAllStream = ({ stdout, stderr }, { all })=>all && (stdout || stderr) ? mergeStreams([
            stdout,
            stderr
        ].filter(Boolean)) : void 0;
    const waitForAllStream = ({ subprocess, encoding, buffer, maxBuffer, lines, stripFinalNewline, verboseInfo, streamInfo })=>waitForSubprocessStream({
            ...getAllStream(subprocess, buffer),
            fdNumber: 'all',
            encoding,
            maxBuffer: maxBuffer[1] + maxBuffer[2],
            lines: lines[1] || lines[2],
            allMixed: getAllMixed(subprocess),
            stripFinalNewline,
            verboseInfo,
            streamInfo
        });
    const getAllStream = ({ stdout, stderr, all }, [, bufferStdout, bufferStderr])=>{
        const buffer = bufferStdout || bufferStderr;
        if (!buffer) return {
            stream: all,
            buffer
        };
        if (!bufferStdout) return {
            stream: stderr,
            buffer
        };
        if (!bufferStderr) return {
            stream: stdout,
            buffer
        };
        return {
            stream: all,
            buffer
        };
    };
    const getAllMixed = ({ all, stdout, stderr })=>all && stdout && stderr && stdout.readableObjectMode !== stderr.readableObjectMode;
    const shouldLogIpc = (verboseInfo)=>isFullVerbose(verboseInfo, 'ipc');
    const logIpcOutput = (message, verboseInfo)=>{
        const verboseMessage = serializeVerboseMessage(message);
        verboseLog({
            type: 'ipc',
            verboseMessage,
            fdNumber: 'ipc',
            verboseInfo
        });
    };
    const waitForIpcOutput = async ({ subprocess, buffer: bufferArray, maxBuffer: maxBufferArray, ipc, ipcOutput, verboseInfo })=>{
        if (!ipc) return ipcOutput;
        const isVerbose = shouldLogIpc(verboseInfo);
        const buffer = getFdSpecificValue(bufferArray, 'ipc');
        const maxBuffer = getFdSpecificValue(maxBufferArray, 'ipc');
        for await (const message of loopOnMessages({
            anyProcess: subprocess,
            channel: subprocess.channel,
            isSubprocess: false,
            ipc,
            shouldAwait: false,
            reference: true
        })){
            if (buffer) {
                checkIpcMaxBuffer(subprocess, ipcOutput, maxBuffer);
                ipcOutput.push(message);
            }
            if (isVerbose) logIpcOutput(message, verboseInfo);
        }
        return ipcOutput;
    };
    const getBufferedIpcOutput = async (ipcOutputPromise, ipcOutput)=>{
        await Promise.allSettled([
            ipcOutputPromise
        ]);
        return ipcOutput;
    };
    const waitForSubprocessResult = async ({ subprocess, options: { encoding, buffer, maxBuffer, lines, timeoutDuration: timeout, cancelSignal, gracefulCancel, forceKillAfterDelay, stripFinalNewline, ipc, ipcInput }, context, verboseInfo, fileDescriptors, originalStreams, onInternalError, controller })=>{
        const exitPromise = waitForExit(subprocess, context);
        const streamInfo = {
            originalStreams,
            fileDescriptors,
            subprocess,
            exitPromise,
            propagating: false
        };
        const stdioPromises = waitForStdioStreams({
            subprocess,
            encoding,
            buffer,
            maxBuffer,
            lines,
            stripFinalNewline,
            verboseInfo,
            streamInfo
        });
        const allPromise = waitForAllStream({
            subprocess,
            encoding,
            buffer,
            maxBuffer,
            lines,
            stripFinalNewline,
            verboseInfo,
            streamInfo
        });
        const ipcOutput = [];
        const ipcOutputPromise = waitForIpcOutput({
            subprocess,
            buffer,
            maxBuffer,
            ipc,
            ipcOutput,
            verboseInfo
        });
        const originalPromises = waitForOriginalStreams(originalStreams, subprocess, streamInfo);
        const customStreamsEndPromises = waitForCustomStreamsEnd(fileDescriptors, streamInfo);
        try {
            return await Promise.race([
                Promise.all([
                    {},
                    waitForSuccessfulExit(exitPromise),
                    Promise.all(stdioPromises),
                    allPromise,
                    ipcOutputPromise,
                    sendIpcInput(subprocess, ipcInput),
                    ...originalPromises,
                    ...customStreamsEndPromises
                ]),
                onInternalError,
                throwOnSubprocessError(subprocess, controller),
                ...throwOnTimeout(subprocess, timeout, context, controller),
                ...throwOnCancel({
                    subprocess,
                    cancelSignal,
                    gracefulCancel,
                    context,
                    controller
                }),
                ...throwOnGracefulCancel({
                    subprocess,
                    cancelSignal,
                    gracefulCancel,
                    forceKillAfterDelay,
                    context,
                    controller
                })
            ]);
        } catch (error) {
            context.terminationReason ??= 'other';
            return Promise.all([
                {
                    error
                },
                exitPromise,
                Promise.all(stdioPromises.map((stdioPromise)=>getBufferedData(stdioPromise))),
                getBufferedData(allPromise),
                getBufferedIpcOutput(ipcOutputPromise, ipcOutput),
                Promise.allSettled(originalPromises),
                Promise.allSettled(customStreamsEndPromises)
            ]);
        }
    };
    const waitForOriginalStreams = (originalStreams, subprocess, streamInfo)=>originalStreams.map((stream, fdNumber)=>stream === subprocess.stdio[fdNumber] ? void 0 : waitForStream(stream, fdNumber, streamInfo));
    const waitForCustomStreamsEnd = (fileDescriptors, streamInfo)=>fileDescriptors.flatMap(({ stdioItems }, fdNumber)=>stdioItems.filter(({ value, stream = value })=>isStream(stream, {
                    checkOpen: false
                }) && !isStandardStream(stream)).map(({ type, value, stream = value })=>waitForStream(stream, fdNumber, streamInfo, {
                    isSameDirection: TRANSFORM_TYPES.has(type),
                    stopOnExit: 'native' === type
                })));
    const throwOnSubprocessError = async (subprocess, { signal })=>{
        const [error] = await (0, external_node_events_namespaceObject.once)(subprocess, 'error', {
            signal
        });
        throw error;
    };
    const initializeConcurrentStreams = ()=>({
            readableDestroy: new WeakMap(),
            writableFinal: new WeakMap(),
            writableDestroy: new WeakMap()
        });
    const addConcurrentStream = (concurrentStreams, stream, waitName)=>{
        const weakMap = concurrentStreams[waitName];
        if (!weakMap.has(stream)) weakMap.set(stream, []);
        const promises = weakMap.get(stream);
        const promise = createDeferred();
        promises.push(promise);
        const resolve = promise.resolve.bind(promise);
        return {
            resolve,
            promises
        };
    };
    const waitForConcurrentStreams = async ({ resolve, promises }, subprocess)=>{
        resolve();
        const [isSubprocessExit] = await Promise.race([
            Promise.allSettled([
                true,
                subprocess
            ]),
            Promise.all([
                false,
                ...promises
            ])
        ]);
        return !isSubprocessExit;
    };
    const safeWaitForSubprocessStdin = async (subprocessStdin)=>{
        if (void 0 === subprocessStdin) return;
        try {
            await waitForSubprocessStdin(subprocessStdin);
        } catch  {}
    };
    const safeWaitForSubprocessStdout = async (subprocessStdout)=>{
        if (void 0 === subprocessStdout) return;
        try {
            await waitForSubprocessStdout(subprocessStdout);
        } catch  {}
    };
    const waitForSubprocessStdin = async (subprocessStdin)=>{
        await (0, external_node_stream_promises_namespaceObject.finished)(subprocessStdin, {
            cleanup: true,
            readable: false,
            writable: true
        });
    };
    const waitForSubprocessStdout = async (subprocessStdout)=>{
        await (0, external_node_stream_promises_namespaceObject.finished)(subprocessStdout, {
            cleanup: true,
            readable: true,
            writable: false
        });
    };
    const waitForSubprocess = async (subprocess, error)=>{
        await subprocess;
        if (error) throw error;
    };
    const destroyOtherStream = (stream, isOpen, error)=>{
        if (error && !isStreamAbort(error)) stream.destroy(error);
        else if (isOpen) stream.destroy();
    };
    const createReadable = ({ subprocess, concurrentStreams, encoding }, { from, binary: binaryOption = true, preserveNewlines = true } = {})=>{
        const binary = binaryOption || BINARY_ENCODINGS.has(encoding);
        const { subprocessStdout, waitReadableDestroy } = getSubprocessStdout(subprocess, from, concurrentStreams);
        const { readableEncoding, readableObjectMode, readableHighWaterMark } = getReadableOptions(subprocessStdout, binary);
        const { read, onStdoutDataDone } = getReadableMethods({
            subprocessStdout,
            subprocess,
            binary,
            encoding,
            preserveNewlines
        });
        const readable = new external_node_stream_namespaceObject.Readable({
            read,
            destroy: (0, external_node_util_namespaceObject.callbackify)(onReadableDestroy.bind(void 0, {
                subprocessStdout,
                subprocess,
                waitReadableDestroy
            })),
            highWaterMark: readableHighWaterMark,
            objectMode: readableObjectMode,
            encoding: readableEncoding
        });
        onStdoutFinished({
            subprocessStdout,
            onStdoutDataDone,
            readable,
            subprocess
        });
        return readable;
    };
    const getSubprocessStdout = (subprocess, from, concurrentStreams)=>{
        const subprocessStdout = getFromStream(subprocess, from);
        const waitReadableDestroy = addConcurrentStream(concurrentStreams, subprocessStdout, 'readableDestroy');
        return {
            subprocessStdout,
            waitReadableDestroy
        };
    };
    const getReadableOptions = ({ readableEncoding, readableObjectMode, readableHighWaterMark }, binary)=>binary ? {
            readableEncoding,
            readableObjectMode,
            readableHighWaterMark
        } : {
            readableEncoding,
            readableObjectMode: true,
            readableHighWaterMark: DEFAULT_OBJECT_HIGH_WATER_MARK
        };
    const getReadableMethods = ({ subprocessStdout, subprocess, binary, encoding, preserveNewlines })=>{
        const onStdoutDataDone = createDeferred();
        const onStdoutData = iterateOnSubprocessStream({
            subprocessStdout,
            subprocess,
            binary,
            shouldEncode: !binary,
            encoding,
            preserveNewlines
        });
        return {
            read () {
                onRead(this, onStdoutData, onStdoutDataDone);
            },
            onStdoutDataDone
        };
    };
    const onRead = async (readable, onStdoutData, onStdoutDataDone)=>{
        try {
            const { value, done } = await onStdoutData.next();
            if (done) onStdoutDataDone.resolve();
            else readable.push(value);
        } catch  {}
    };
    const onStdoutFinished = async ({ subprocessStdout, onStdoutDataDone, readable, subprocess, subprocessStdin })=>{
        try {
            await waitForSubprocessStdout(subprocessStdout);
            await subprocess;
            await safeWaitForSubprocessStdin(subprocessStdin);
            await onStdoutDataDone;
            if (readable.readable) readable.push(null);
        } catch (error) {
            await safeWaitForSubprocessStdin(subprocessStdin);
            destroyOtherReadable(readable, error);
        }
    };
    const onReadableDestroy = async ({ subprocessStdout, subprocess, waitReadableDestroy }, error)=>{
        if (await waitForConcurrentStreams(waitReadableDestroy, subprocess)) {
            destroyOtherReadable(subprocessStdout, error);
            await waitForSubprocess(subprocess, error);
        }
    };
    const destroyOtherReadable = (stream, error)=>{
        destroyOtherStream(stream, stream.readable, error);
    };
    const createWritable = ({ subprocess, concurrentStreams }, { to } = {})=>{
        const { subprocessStdin, waitWritableFinal, waitWritableDestroy } = getSubprocessStdin(subprocess, to, concurrentStreams);
        const writable = new external_node_stream_namespaceObject.Writable({
            ...getWritableMethods(subprocessStdin, subprocess, waitWritableFinal),
            destroy: (0, external_node_util_namespaceObject.callbackify)(onWritableDestroy.bind(void 0, {
                subprocessStdin,
                subprocess,
                waitWritableFinal,
                waitWritableDestroy
            })),
            highWaterMark: subprocessStdin.writableHighWaterMark,
            objectMode: subprocessStdin.writableObjectMode
        });
        onStdinFinished(subprocessStdin, writable);
        return writable;
    };
    const getSubprocessStdin = (subprocess, to, concurrentStreams)=>{
        const subprocessStdin = getToStream(subprocess, to);
        const waitWritableFinal = addConcurrentStream(concurrentStreams, subprocessStdin, 'writableFinal');
        const waitWritableDestroy = addConcurrentStream(concurrentStreams, subprocessStdin, 'writableDestroy');
        return {
            subprocessStdin,
            waitWritableFinal,
            waitWritableDestroy
        };
    };
    const getWritableMethods = (subprocessStdin, subprocess, waitWritableFinal)=>({
            write: onWrite.bind(void 0, subprocessStdin),
            final: (0, external_node_util_namespaceObject.callbackify)(onWritableFinal.bind(void 0, subprocessStdin, subprocess, waitWritableFinal))
        });
    const onWrite = (subprocessStdin, chunk, encoding, done)=>{
        if (subprocessStdin.write(chunk, encoding)) done();
        else subprocessStdin.once('drain', done);
    };
    const onWritableFinal = async (subprocessStdin, subprocess, waitWritableFinal)=>{
        if (await waitForConcurrentStreams(waitWritableFinal, subprocess)) {
            if (subprocessStdin.writable) subprocessStdin.end();
            await subprocess;
        }
    };
    const onStdinFinished = async (subprocessStdin, writable, subprocessStdout)=>{
        try {
            await waitForSubprocessStdin(subprocessStdin);
            if (writable.writable) writable.end();
        } catch (error) {
            await safeWaitForSubprocessStdout(subprocessStdout);
            destroyOtherWritable(writable, error);
        }
    };
    const onWritableDestroy = async ({ subprocessStdin, subprocess, waitWritableFinal, waitWritableDestroy }, error)=>{
        await waitForConcurrentStreams(waitWritableFinal, subprocess);
        if (await waitForConcurrentStreams(waitWritableDestroy, subprocess)) {
            destroyOtherWritable(subprocessStdin, error);
            await waitForSubprocess(subprocess, error);
        }
    };
    const destroyOtherWritable = (stream, error)=>{
        destroyOtherStream(stream, stream.writable, error);
    };
    const createDuplex = ({ subprocess, concurrentStreams, encoding }, { from, to, binary: binaryOption = true, preserveNewlines = true } = {})=>{
        const binary = binaryOption || BINARY_ENCODINGS.has(encoding);
        const { subprocessStdout, waitReadableDestroy } = getSubprocessStdout(subprocess, from, concurrentStreams);
        const { subprocessStdin, waitWritableFinal, waitWritableDestroy } = getSubprocessStdin(subprocess, to, concurrentStreams);
        const { readableEncoding, readableObjectMode, readableHighWaterMark } = getReadableOptions(subprocessStdout, binary);
        const { read, onStdoutDataDone } = getReadableMethods({
            subprocessStdout,
            subprocess,
            binary,
            encoding,
            preserveNewlines
        });
        const duplex = new external_node_stream_namespaceObject.Duplex({
            read,
            ...getWritableMethods(subprocessStdin, subprocess, waitWritableFinal),
            destroy: (0, external_node_util_namespaceObject.callbackify)(onDuplexDestroy.bind(void 0, {
                subprocessStdout,
                subprocessStdin,
                subprocess,
                waitReadableDestroy,
                waitWritableFinal,
                waitWritableDestroy
            })),
            readableHighWaterMark,
            writableHighWaterMark: subprocessStdin.writableHighWaterMark,
            readableObjectMode,
            writableObjectMode: subprocessStdin.writableObjectMode,
            encoding: readableEncoding
        });
        onStdoutFinished({
            subprocessStdout,
            onStdoutDataDone,
            readable: duplex,
            subprocess,
            subprocessStdin
        });
        onStdinFinished(subprocessStdin, duplex, subprocessStdout);
        return duplex;
    };
    const onDuplexDestroy = async ({ subprocessStdout, subprocessStdin, subprocess, waitReadableDestroy, waitWritableFinal, waitWritableDestroy }, error)=>{
        await Promise.all([
            onReadableDestroy({
                subprocessStdout,
                subprocess,
                waitReadableDestroy
            }, error),
            onWritableDestroy({
                subprocessStdin,
                subprocess,
                waitWritableFinal,
                waitWritableDestroy
            }, error)
        ]);
    };
    const createIterable = (subprocess, encoding, { from, binary: binaryOption = false, preserveNewlines = false } = {})=>{
        const binary = binaryOption || BINARY_ENCODINGS.has(encoding);
        const subprocessStdout = getFromStream(subprocess, from);
        const onStdoutData = iterateOnSubprocessStream({
            subprocessStdout,
            subprocess,
            binary,
            shouldEncode: true,
            encoding,
            preserveNewlines
        });
        return iterateOnStdoutData(onStdoutData, subprocessStdout, subprocess);
    };
    const iterateOnStdoutData = async function*(onStdoutData, subprocessStdout, subprocess) {
        try {
            yield* onStdoutData;
        } finally{
            if (subprocessStdout.readable) subprocessStdout.destroy();
            await subprocess;
        }
    };
    const addConvertedStreams = (subprocess, { encoding })=>{
        const concurrentStreams = initializeConcurrentStreams();
        subprocess.readable = createReadable.bind(void 0, {
            subprocess,
            concurrentStreams,
            encoding
        });
        subprocess.writable = createWritable.bind(void 0, {
            subprocess,
            concurrentStreams
        });
        subprocess.duplex = createDuplex.bind(void 0, {
            subprocess,
            concurrentStreams,
            encoding
        });
        subprocess.iterable = createIterable.bind(void 0, subprocess, encoding);
        subprocess[Symbol.asyncIterator] = createIterable.bind(void 0, subprocess, encoding, {});
    };
    const mergePromise = (subprocess, promise)=>{
        for (const [property, descriptor] of descriptors){
            const value = descriptor.value.bind(promise);
            Reflect.defineProperty(subprocess, property, {
                ...descriptor,
                value
            });
        }
    };
    const nativePromisePrototype = (async ()=>{})().constructor.prototype;
    const descriptors = [
        'then',
        'catch',
        'finally'
    ].map((property)=>[
            property,
            Reflect.getOwnPropertyDescriptor(nativePromisePrototype, property)
        ]);
    const execaCoreAsync = (rawFile, rawArguments, rawOptions, createNested)=>{
        const { file, commandArguments, command, escapedCommand, startTime, verboseInfo, options, fileDescriptors } = handleAsyncArguments(rawFile, rawArguments, rawOptions);
        const { subprocess, promise } = spawnSubprocessAsync({
            file,
            commandArguments,
            options,
            startTime,
            verboseInfo,
            command,
            escapedCommand,
            fileDescriptors
        });
        subprocess.pipe = pipeToSubprocess.bind(void 0, {
            source: subprocess,
            sourcePromise: promise,
            boundOptions: {},
            createNested
        });
        mergePromise(subprocess, promise);
        SUBPROCESS_OPTIONS.set(subprocess, {
            options,
            fileDescriptors
        });
        return subprocess;
    };
    const handleAsyncArguments = (rawFile, rawArguments, rawOptions)=>{
        const { command, escapedCommand, startTime, verboseInfo } = handleCommand(rawFile, rawArguments, rawOptions);
        const { file, commandArguments, options: normalizedOptions } = normalizeOptions(rawFile, rawArguments, rawOptions);
        const options = handleAsyncOptions(normalizedOptions);
        const fileDescriptors = handleStdioAsync(options, verboseInfo);
        return {
            file,
            commandArguments,
            command,
            escapedCommand,
            startTime,
            verboseInfo,
            options,
            fileDescriptors
        };
    };
    const handleAsyncOptions = ({ timeout, signal, ...options })=>{
        if (void 0 !== signal) throw new TypeError('The "signal" option has been renamed to "cancelSignal" instead.');
        return {
            ...options,
            timeoutDuration: timeout
        };
    };
    const spawnSubprocessAsync = ({ file, commandArguments, options, startTime, verboseInfo, command, escapedCommand, fileDescriptors })=>{
        let subprocess;
        try {
            subprocess = (0, external_node_child_process_namespaceObject.spawn)(file, commandArguments, options);
        } catch (error) {
            return handleEarlyError({
                error,
                command,
                escapedCommand,
                fileDescriptors,
                options,
                startTime,
                verboseInfo
            });
        }
        const controller = new AbortController();
        (0, external_node_events_namespaceObject.setMaxListeners)(Number.POSITIVE_INFINITY, controller.signal);
        const originalStreams = [
            ...subprocess.stdio
        ];
        pipeOutputAsync(subprocess, fileDescriptors, controller);
        cleanupOnExit(subprocess, options, controller);
        const context = {};
        const onInternalError = createDeferred();
        subprocess.kill = subprocessKill.bind(void 0, {
            kill: subprocess.kill.bind(subprocess),
            options,
            onInternalError,
            context,
            controller
        });
        subprocess.all = makeAllStream(subprocess, options);
        addConvertedStreams(subprocess, options);
        addIpcMethods(subprocess, options);
        const promise = handlePromise({
            subprocess,
            options,
            startTime,
            verboseInfo,
            fileDescriptors,
            originalStreams,
            command,
            escapedCommand,
            context,
            onInternalError,
            controller
        });
        return {
            subprocess,
            promise
        };
    };
    const handlePromise = async ({ subprocess, options, startTime, verboseInfo, fileDescriptors, originalStreams, command, escapedCommand, context, onInternalError, controller })=>{
        const [errorInfo, [exitCode, signal], stdioResults, allResult, ipcOutput] = await waitForSubprocessResult({
            subprocess,
            options,
            context,
            verboseInfo,
            fileDescriptors,
            originalStreams,
            onInternalError,
            controller
        });
        controller.abort();
        onInternalError.resolve();
        const stdio = stdioResults.map((stdioResult, fdNumber)=>stripNewline(stdioResult, options, fdNumber));
        const all = stripNewline(allResult, options, 'all');
        const result = getAsyncResult({
            errorInfo,
            exitCode,
            signal,
            stdio,
            all,
            ipcOutput,
            context,
            options,
            command,
            escapedCommand,
            startTime
        });
        return handleResult(result, verboseInfo, options);
    };
    const getAsyncResult = ({ errorInfo, exitCode, signal, stdio, all, ipcOutput, context, options, command, escapedCommand, startTime })=>'error' in errorInfo ? makeError({
            error: errorInfo.error,
            command,
            escapedCommand,
            timedOut: 'timeout' === context.terminationReason,
            isCanceled: 'cancel' === context.terminationReason || 'gracefulCancel' === context.terminationReason,
            isGracefullyCanceled: 'gracefulCancel' === context.terminationReason,
            isMaxBuffer: errorInfo.error instanceof MaxBufferError,
            isForcefullyTerminated: context.isForcefullyTerminated,
            exitCode,
            signal,
            stdio,
            all,
            ipcOutput,
            options,
            startTime,
            isSync: false
        }) : makeSuccessResult({
            command,
            escapedCommand,
            stdio,
            all,
            ipcOutput,
            options,
            startTime
        });
    const mergeOptions = (boundOptions, options)=>{
        const newOptions = Object.fromEntries(Object.entries(options).map(([optionName, optionValue])=>[
                optionName,
                mergeOption(optionName, boundOptions[optionName], optionValue)
            ]));
        return {
            ...boundOptions,
            ...newOptions
        };
    };
    const mergeOption = (optionName, boundOptionValue, optionValue)=>{
        if (DEEP_OPTIONS.has(optionName) && isPlainObject(boundOptionValue) && isPlainObject(optionValue)) return {
            ...boundOptionValue,
            ...optionValue
        };
        return optionValue;
    };
    const DEEP_OPTIONS = new Set([
        'env',
        ...FD_SPECIFIC_OPTIONS
    ]);
    const createExeca = (mapArguments, boundOptions, deepOptions, setBoundExeca)=>{
        const createNested = (mapArguments, boundOptions, setBoundExeca)=>createExeca(mapArguments, boundOptions, deepOptions, setBoundExeca);
        const boundExeca = (...execaArguments)=>callBoundExeca({
                mapArguments,
                deepOptions,
                boundOptions,
                setBoundExeca,
                createNested
            }, ...execaArguments);
        if (void 0 !== setBoundExeca) setBoundExeca(boundExeca, createNested, boundOptions);
        return boundExeca;
    };
    const callBoundExeca = ({ mapArguments, deepOptions = {}, boundOptions = {}, setBoundExeca, createNested }, firstArgument, ...nextArguments)=>{
        if (isPlainObject(firstArgument)) return createNested(mapArguments, mergeOptions(boundOptions, firstArgument), setBoundExeca);
        const { file, commandArguments, options, isSync } = parseArguments({
            mapArguments,
            firstArgument,
            nextArguments,
            deepOptions,
            boundOptions
        });
        return isSync ? execaCoreSync(file, commandArguments, options) : execaCoreAsync(file, commandArguments, options, createNested);
    };
    const parseArguments = ({ mapArguments, firstArgument, nextArguments, deepOptions, boundOptions })=>{
        const callArguments = isTemplateString(firstArgument) ? parseTemplates(firstArgument, nextArguments) : [
            firstArgument,
            ...nextArguments
        ];
        const [initialFile, initialArguments, initialOptions] = normalizeParameters(...callArguments);
        const mergedOptions = mergeOptions(mergeOptions(deepOptions, boundOptions), initialOptions);
        const { file = initialFile, commandArguments = initialArguments, options = mergedOptions, isSync = false } = mapArguments({
            file: initialFile,
            commandArguments: initialArguments,
            options: mergedOptions
        });
        return {
            file,
            commandArguments,
            options,
            isSync
        };
    };
    const mapCommandAsync = ({ file, commandArguments })=>parseCommand(file, commandArguments);
    const mapCommandSync = ({ file, commandArguments })=>({
            ...parseCommand(file, commandArguments),
            isSync: true
        });
    const parseCommand = (command, unusedArguments)=>{
        if (unusedArguments.length > 0) throw new TypeError(`The command and its arguments must be passed as a single string: ${command} ${unusedArguments}.`);
        const [file, ...commandArguments] = parseCommandString(command);
        return {
            file,
            commandArguments
        };
    };
    const parseCommandString = (command)=>{
        if ('string' != typeof command) throw new TypeError(`The command must be a string: ${String(command)}.`);
        const trimmedCommand = command.trim();
        if ('' === trimmedCommand) return [];
        const tokens = [];
        for (const token of trimmedCommand.split(SPACES_REGEXP)){
            const previousToken = tokens.at(-1);
            if (previousToken && previousToken.endsWith('\\')) tokens[tokens.length - 1] = `${previousToken.slice(0, -1)} ${token}`;
            else tokens.push(token);
        }
        return tokens;
    };
    const SPACES_REGEXP = / +/g;
    const setScriptSync = (boundExeca, createNested, boundOptions)=>{
        boundExeca.sync = createNested(mapScriptSync, boundOptions);
        boundExeca.s = boundExeca.sync;
    };
    const mapScriptAsync = ({ options })=>getScriptOptions(options);
    const mapScriptSync = ({ options })=>({
            ...getScriptOptions(options),
            isSync: true
        });
    const getScriptOptions = (options)=>({
            options: {
                ...getScriptStdinOption(options),
                ...options
            }
        });
    const getScriptStdinOption = ({ input, inputFile, stdio })=>void 0 === input && void 0 === inputFile && void 0 === stdio ? {
            stdin: 'inherit'
        } : {};
    const deepScriptOptions = {
        preferLocal: true
    };
    const execa = createExeca(()=>({}));
    createExeca(()=>({
            isSync: true
        }));
    createExeca(mapCommandAsync);
    createExeca(mapCommandSync);
    createExeca(mapNode);
    createExeca(mapScriptAsync, {}, deepScriptOptions, setScriptSync);
    const { sendMessage: execa_sendMessage, getOneMessage: execa_getOneMessage, getEachMessage: execa_getEachMessage, getCancelSignal: execa_getCancelSignal } = getIpcExport();
    async function exportBundles({ platforms, bundlePath, environment }) {
        const title = `Exporting ${platforms.join(", ").toLocaleLowerCase()} bundles`;
        const spinner = prompts_namespaceObject.spinner();
        spinner.start(`Starting ${title}...`);
        try {
            await execa("expo", [
                "export",
                ...platforms.flatMap((platform)=>[
                        "--platform",
                        platform.toLocaleLowerCase()
                    ]),
                "--output-dir",
                bundlePath,
                "--clear"
            ], {
                env: {
                    ...process.env,
                    NODE_ENV: environment
                }
            });
            spinner.stop(`✅ ${title} completed successfully!`);
        } catch (error) {
            spinner.stop(`❌ ${title} failed: ${error.message}`);
            throw error;
        }
    }
    const external_node_fs_promises_namespaceObject = require("node:fs/promises");
    async function exportExpoConfig({ expoConfigPath }) {
        const spinner = prompts_namespaceObject.spinner();
        spinner.start("Starting Exporting ExpoConfig...");
        try {
            const { stdout } = await execa("expo", [
                "config",
                "--type",
                "public",
                "--json"
            ], {
                env: process.env
            });
            await external_node_fs_promises_namespaceObject.writeFile(external_node_path_namespaceObject.join(expoConfigPath, "expoConfig.json"), stdout);
            spinner.stop("✅ Exporting ExpoConfig completed successfully!");
        } catch (e) {
            spinner.stop(`❌ Exporting ExpoConfig failed: ${e.message}`);
            throw e;
        }
    }
    const external_uuid_namespaceObject = require("uuid");
    const parseStdout = (stdout)=>{
        const env = stdout.split("\n").filter((line)=>line.includes("=")).map((e)=>e.split("=")).reduce((acc, [key, value])=>({
                ...acc,
                [key]: value
            }), {});
        return env;
    };
    const external_dotenv_namespaceObject = require("dotenv");
    async function loadEASEnv(environment) {
        const { stdout } = await execa("eas", [
            "env:list",
            environment
        ], {
            stdio: "pipe"
        });
        const parsedEnv = parseStdout(stdout);
        external_dotenv_namespaceObject.populate(process.env, parsedEnv, {
            override: true
        });
    }
    async function loadFileEnv(environment) {
        const envFiles = [
            `.env.${environment}.local`,
            ".env.local",
            `.env.${environment}`,
            ".env"
        ];
        for (const file of envFiles){
            const filePath = external_node_path_namespaceObject.resolve((0, node_namespaceObject.getCwd)(), file);
            try {
                await external_node_fs_namespaceObject.promises.access(filePath);
                external_dotenv_namespaceObject.config({
                    path: filePath,
                    override: true
                });
            } catch (error) {}
        }
    }
    async function loadEnv(envSource, environment) {
        const spinner = prompts_namespaceObject.spinner();
        spinner.start("Loading env from Expo server ...");
        try {
            switch(envSource){
                case "eas":
                    await loadEASEnv(environment);
                    break;
                case "file":
                    await loadFileEnv(environment);
                    break;
                default:
                    throw new Error("Invalid env source");
            }
            spinner.stop("✅ Loading env completed successfully!");
        } catch (e) {
            spinner.stop(`❌ Loading env failed: ${e.message}`);
            throw new Error("This project does not manage environment variables through EAS. Please upload the environment variables via eas env or expo.dev.");
        }
    }
    async function setupDeployment(bundlePath) {
        const platforms = await selectPlatforms();
        const environment = await selectEnvironment();
        const envSource = await selectEnvSource();
        await loadEnv(envSource, environment);
        const config = await loadConfig();
        const runtimeVersion = await getRuntimeVersion(config.runtimeVersion);
        await exportBundles({
            platforms,
            bundlePath,
            environment
        });
        await exportExpoConfig({
            expoConfigPath: bundlePath
        });
        const bundleId = (0, external_uuid_namespaceObject.v4)();
        const cloudPath = `${runtimeVersion}/${environment}/${bundleId}`;
        return {
            bundleId,
            cloudPath,
            platforms,
            environment,
            runtimeVersion,
            config,
            envSource
        };
    }
    async function uploadBundle(deploymentConfig, bundlePath) {
        const { cloudPath, config } = deploymentConfig;
        const spinner = prompts_namespaceObject.spinner();
        spinner.start("Preparing file upload...");
        try {
            const storageClient = config.storage;
            await storageClient.uploadDirectory({
                cloudPath,
                directoryPath: bundlePath
            });
            spinner.stop("✅ Uploading completed successfully!");
        } catch (e) {
            spinner.stop(`❌ Uploading failed: ${e.message}`);
            throw e;
        }
    }
    async function updateVersionCursor(deploymentConfig) {
        const { bundleId, environment, platforms, runtimeVersion, config } = deploymentConfig;
        const cursorSpinner = prompts_namespaceObject.spinner();
        cursorSpinner.start("Version cursor updating...");
        const dbClient = await config.db;
        await dbClient.init?.();
        try {
            await dbClient.create({
                bundle: {
                    bundleId,
                    createdAt: Date.now(),
                    environment,
                    gitHash: "",
                    supportAndroid: platforms.includes("android"),
                    supportIos: platforms.includes("ios"),
                    runtimeVersion,
                    updatePolicy: "NORMAL_UPDATE"
                }
            });
            await dbClient.sync?.();
            cursorSpinner.stop("✅ Updating version cursor completed successfully!");
        } catch (e) {
            cursorSpinner.stop(`❌ Uploading version cursor failed: ${e.message}`);
            throw e;
        }
    }
    async function cleanup_cleanup(bundlePath) {
        try {
            await (0, external_node_fs_promises_namespaceObject.rm)(bundlePath, {
                recursive: true,
                force: true
            });
            prompts_namespaceObject.log.error("Cleaned up temporary files.");
        } catch (err) {
            prompts_namespaceObject.log.error(err);
        }
    }
    async function deploy() {
        const cwd = (0, node_namespaceObject.getCwd)();
        const bundlePath = external_node_path_namespaceObject.resolve(cwd, "./dist");
        try {
            const deploymentConfig = await setupDeployment(bundlePath);
            await uploadBundle(deploymentConfig, bundlePath);
            await updateVersionCursor(deploymentConfig);
            prompts_namespaceObject.outro("🚀 Deployment Successful");
            prompts_namespaceObject.note(JSON.stringify({
                bundleId: deploymentConfig.bundleId,
                runtimeVersion: deploymentConfig.runtimeVersion,
                platforms: deploymentConfig.platforms,
                cloudPath: deploymentConfig.cloudPath,
                environment: deploymentConfig.environment,
                envSource: deploymentConfig.envSource
            }, null, 2));
        } catch (e) {
            console.error(e);
            prompts_namespaceObject.outro("Deployment failed");
        } finally{
            await cleanup_cleanup(bundlePath);
        }
    }
    const createConfigTemplate = ({ db, storage })=>{
        const importMethods = [];
        let storageClientInstance = "";
        let dbClientInstance = "";
        switch(storage){
            case "AWS_S3":
                importMethods.push("AWSS3StorageClient");
                storageClientInstance = `
const storageClient = new AWSS3StorageClient({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    bucketName: process.env.AWS_BUCKET_NAME!,
    region: process.env.AWS_REGION!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
});
            `;
                break;
            case "FIREBASE":
                importMethods.push("FirebaseStorageClient");
                storageClientInstance = `
const storageClient = new FirebaseStorageClient({
    credential: process.env.FIREBASE_CREDENTIAL!,
    bucketName: process.env.FIREBASE_BUCKET_NAME!,
});
            `;
                break;
            case "SUPABASE":
                importMethods.push("SupabaseStorageClient");
                storageClientInstance = `
const storageClient = new SupabaseStorageClient({
    bucketName: process.env.SUPABASE_BUCKET_NAME,
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_KEY,
});
            `;
                break;
            case "CUSTOM":
                importMethods.push("StorageClient");
                storageClientInstance = `
const generateStorageClient = (): StorageClient => {
	return {
		getFile: () => {},
		getFileSignedUrl: () => {},
		uploadDirectory: () => {},
		uploadFile: () => {},
		uploadLocalFile: () => {},
	};
};
const storageClient = generateStorageClient();
`;
                break;
            default:
                break;
        }
        switch(db){
            case "FIREBASE":
                importMethods.push("FirebaseDbClient");
                dbClientInstance = `
const dbClient = new FirebaseDbClient({
    credential: process.env.FIREBASE_CREDENTIAL!,
    databaseId: process.env.FIREBASE_DATABASE_ID!,
});
            `;
                break;
            case "LOWDB":
                importMethods.push("LowDbClient");
                dbClientInstance = `
const dbClient = new LowDbClient({
    downloadJSONFile: () => storageClient.getFile({ key: "cursor.json" }),
    uploadJSONFile: (file: Buffer) =>
    storageClient.uploadFile({ key: "cursor.json", file }),
});
            `;
                break;
            case "SUPABASE":
                importMethods.push("SupabaseDbClient");
                dbClientInstance = `
const dbClient = new SupabaseDbClient({
    tableName: process.env.SUPABASE_TABLE_NAME!,
    supabaseUrl: process.env.SUPABASE_URL!,
    supabaseKey: process.env.SUPABASE_KEY!,
});
            `;
                break;
            case "CUSTOM":
                importMethods.push("DbClient");
                dbClientInstance = `
const generateDbClient = (): DbClient => {
	return {
		create: () => {},
		delete: () => {},
		find: () => {},
		findAll: () => {},
		readAll: () => {},
		toBuffer: () => {},
		update: () => {},
	};
};
const dbClient = generateDbClient();
`;
                break;
            default:
                break;
        }
        return `
import { defineConfig } from "@cloud-push/react-native";
import { ${[
            importMethods.join(", ")
        ]} } from "@cloud-push/cloud";
${storageClientInstance}
${dbClientInstance}
export default defineConfig(() => ({
	storage: storageClient,
	db: dbClient,
}));
`;
    };
    const init_init = async ()=>{
        try {
            const db = await (0, node_namespaceObject.selectDbClient)();
            const storage = await (0, node_namespaceObject.selectStorageClient)();
            const template = createConfigTemplate({
                db,
                storage
            });
            const cwd = (0, node_namespaceObject.getCwd)();
            const filePath = external_node_path_namespaceObject.resolve(cwd, "cloud-push.config.ts");
            external_node_fs_namespaceObject.writeFileSync(filePath, template.trimStart(), "utf8");
            prompts_namespaceObject.outro("Config Generated Successfully! 🎉");
        } catch (e) {
            console.error(e);
            prompts_namespaceObject.outro("Config Generation failed");
        }
    };
    const program = new external_commander_namespaceObject.Command();
    let isExiting = false;
    process.on("SIGINT", async ()=>{
        if (isExiting) return;
        isExiting = true;
        prompts_namespaceObject.log.error("\n\n🛑 Process interrupted. Cleaning up...");
        process.exit(1);
    });
    program.command("deploy").description("Upload bundle").action(deploy);
    program.command("init").action(init_init);
    program.parse(process.argv);
    if (!process.argv.slice(2).length) program.outputHelp();
})();
var __webpack_export_target__ = exports;
for(var __webpack_i__ in __webpack_exports__)__webpack_export_target__[__webpack_i__] = __webpack_exports__[__webpack_i__];
if (__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, '__esModule', {
    value: true
});
