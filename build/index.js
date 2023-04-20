"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var process = __importStar(require("child_process"));
var tls = __importStar(require("tls"));
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var https = __importStar(require("https"));
var certFilePath = path.join(__dirname, "cert.pem");
var npmregistryUrl = "https://registry.npmjs.org/";
// 读取当前目录下的config.json文件, 如果没有则创建
if (!fs.existsSync(path.join(__dirname, "config.json"))) {
    fs.writeFileSync(path.join(__dirname, "config.json"), JSON.stringify({
        wchatRobotToken: "",
        logFile: "",
    }));
}
var config = require("../config.json");
/**
 * 创建证书文件
 */
function createPem() {
    var tlsData = tls.rootCertificates.join("\n");
    fs.writeFileSync(certFilePath, tlsData);
}
/**
 * 删除证书文件
 */
function removePem() {
    fs.unlinkSync(certFilePath);
}
/**
 * 获取npm的registry
 * @returns
 */
function getNpmRegistrySync() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new Promise(function (resolve, reject) {
                        process.exec("npm config get registry", { encoding: "utf-8" }, function (error, stdout, stderr) {
                            if (error) {
                                reject(error);
                            }
                            else {
                                resolve(stdout);
                            }
                        });
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
/**
 * 设置npm的registry
 * @param {*} npmregistry
 * @returns
 */
function setNpmRegistrySync(npmregistry) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new Promise(function (resolve, reject) {
                        process.exec("npm config set registry ".concat(npmregistry), { encoding: "utf-8" }, function (error, stdout, stderr) {
                            if (error) {
                                reject(error);
                            }
                            else {
                                resolve(stdout);
                            }
                        });
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
/**
 * 执行npm audit
 * @returns
 */
function runAuditSync() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new Promise(function (resolve, reject) {
                        process.exec("npm audit", { encoding: "utf-8" }, function (error, stdout, stderr) {
                            if (stdout) {
                                var rulestArr_1 = stdout.split("\n");
                                var highSeverityArr_1 = [];
                                var isSussecc = stdout.includes("found 0 vulnerabilities");
                                rulestArr_1.forEach(function (item, index) {
                                    if (item.includes("Severity: high")) {
                                        highSeverityArr_1.push([
                                            rulestArr_1[index - 1],
                                            rulestArr_1[index],
                                            rulestArr_1[index + 1],
                                        ]);
                                    }
                                    if (item.includes("high severity vulnerabilities")) {
                                        highSeverityArr_1.push(rulestArr_1[index]);
                                    }
                                });
                                fs.writeFile(config.logFile || path.join(__dirname, "auditReport.log"), stdout, function (err) {
                                    if (err) {
                                        console.log("日志文件创建失败！！");
                                        reject({});
                                    }
                                });
                                var allRulest = highSeverityArr_1.pop();
                                var codes = highSeverityArr_1
                                    .map(function (item) {
                                    if (typeof item === "string") {
                                        return "`" + item + "`";
                                    }
                                    else {
                                        return (item.map(function (item) { return "`" + item + "`"; }).join("\r\n") +
                                            "\r\n---------------------\r\n");
                                    }
                                })
                                    .join("\r\n");
                                var option = {
                                    msgtype: "markdown",
                                    markdown: {
                                        content: [
                                            "<font color=\"info\">\u6267\u884Cnpm audit\u7ED3\u679C</font>",
                                            codes,
                                            isSussecc
                                                ? "<font color=\"info\">".concat(stdout, "</font>")
                                                : "<font color=\"info\">".concat(allRulest || "执行异常", "</font>"),
                                        ].join("\r\n"),
                                    },
                                };
                                // 存在token则发送消息
                                if (config.wchatRobotToken) {
                                    createPem();
                                    var req = https.request({
                                        protocol: "https:",
                                        hostname: "qyapi.weixin.qq.com",
                                        path: "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=".concat(config.wchatRobotToken),
                                        port: 443,
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json",
                                        },
                                    }, function (res) { })
                                        .on("error", function (err) {
                                        console.log("Error: ", err.message);
                                    });
                                    req.write(JSON.stringify(option));
                                    req.end();
                                }
                                else {
                                    resolve({});
                                }
                            }
                        });
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
/**
 * 执行入口
 */
function ready() {
    return __awaiter(this, void 0, void 0, function () {
        var registryName, isChangeRegistryName, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getNpmRegistrySync()];
                case 1:
                    registryName = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 8, , 10]);
                    console.log("获取registryName:: ", registryName);
                    isChangeRegistryName = registryName !== npmregistryUrl;
                    if (!isChangeRegistryName) return [3 /*break*/, 4];
                    console.log("设置registryName:: ", npmregistryUrl);
                    return [4 /*yield*/, setNpmRegistrySync(npmregistryUrl)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    // 2. 执行npm audit
                    console.log("执行npm audit:: ");
                    return [4 /*yield*/, runAuditSync()];
                case 5:
                    _a.sent();
                    if (!isChangeRegistryName) return [3 /*break*/, 7];
                    console.log("恢复registryName:: ", registryName);
                    return [4 /*yield*/, setNpmRegistrySync(registryName)];
                case 6:
                    _a.sent();
                    _a.label = 7;
                case 7: return [3 /*break*/, 10];
                case 8:
                    error_1 = _a.sent();
                    // 异常回滚
                    console.log("异常回滚 registryName:: ", registryName);
                    return [4 /*yield*/, setNpmRegistrySync(registryName)];
                case 9:
                    _a.sent();
                    return [3 /*break*/, 10];
                case 10: return [2 /*return*/];
            }
        });
    });
}
function setConfig(name, cmd) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            fs.readFile(path.join(__dirname, "./config.json"), function (err, data) {
                if (err) {
                    console.log("读取配置文件失败");
                    return;
                }
                var config = JSON.parse(String(data));
                config[name] = cmd;
                fs.writeFileSync("./config.json", JSON.stringify(config));
                console.log("Success!");
            });
            return [2 /*return*/];
        });
    });
}
exports.default = { ready: ready, setConfig: setConfig };
