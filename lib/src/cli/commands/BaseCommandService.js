"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var logger_1 = require("./../../logging/logger");
var inquirer_1 = __importDefault(require("inquirer"));
var fs_extra_1 = __importDefault(require("fs-extra"));
var path_1 = __importDefault(require("path"));
var ora_1 = __importDefault(require("ora"));
var chalk_1 = __importDefault(require("chalk"));
var user_home_1 = __importDefault(require("user-home"));
var clear_1 = __importDefault(require("clear"));
var fs_extra_2 = require("fs-extra");
var lodash_1 = __importDefault(require("lodash"));
var defaultChalkColor = 'blue';
var BaseCommandService = /** @class */ (function () {
    //  Constructors
    function BaseCommandService() {
        this.SysPath = '_sys';
    }
    Object.defineProperty(BaseCommandService.prototype, "userHomePath", {
        //  Constants
        //  Fields
        get: function () {
            return user_home_1.default;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseCommandService.prototype, "Ora", {
        //  Properties
        get: function () {
            return ora_1.default();
        },
        enumerable: true,
        configurable: true
    });
    //  Helpers
    BaseCommandService.prototype.clear = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                clear_1.default();
                return [2 /*return*/];
            });
        });
    };
    BaseCommandService.prototype.establishNextSteps = function (steps, color) {
        if (color === void 0) { color = defaultChalkColor; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                logger_1.Logger.Basic('\n');
                steps.forEach(function (step) {
                    logger_1.Logger.Basic(chalk_1.default[color]("\t" + step));
                });
                logger_1.Logger.Basic('\n');
                return [2 /*return*/];
            });
        });
    };
    BaseCommandService.prototype.establishSectionHeader = function (title, color, showHeader, length) {
        if (color === void 0) { color = defaultChalkColor; }
        if (showHeader === void 0) { showHeader = true; }
        if (length === void 0) { length = 100; }
        return __awaiter(this, void 0, void 0, function () {
            var surroundLength, splitSize, outer, inner;
            return __generator(this, function (_a) {
                surroundLength = length - title.length;
                splitSize = Math.round((surroundLength / 2) / 3);
                outer = new Array(splitSize * 2).join('=');
                inner = new Array(splitSize).join('-');
                if (showHeader)
                    this.establishHeader();
                logger_1.Logger.Basic(chalk_1.default[color]("" + outer + inner + "  " + title + "  " + inner + outer));
                return [2 /*return*/];
            });
        });
    };
    BaseCommandService.prototype.establishHeader = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.clear();
                logger_1.Logger.Headline("LCU-CLI");
                return [2 /*return*/];
            });
        });
    };
    BaseCommandService.prototype.inquir = function (questions, errMsg, exitOnError) {
        if (exitOnError === void 0) { exitOnError = true; }
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!lodash_1.default.isString(questions)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.loadTemplateInquirerQuestions(questions)];
                    case 1:
                        questions = _a.sent();
                        _a.label = 2;
                    case 2: return [4 /*yield*/, inquirer_1.default.prompt(questions).catch(function (err) {
                            _this.Ora.fail(errMsg || err);
                            if (exitOnError)
                                process.exit(1);
                        })];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    BaseCommandService.prototype.isLcuInitialized = function () {
        return __awaiter(this, void 0, void 0, function () {
            var err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, fs_extra_1.default.stat('lcu.json')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 2:
                        err_1 = _a.sent();
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    BaseCommandService.prototype.jsonCleanup = function (value) {
        return value.replace(/[\\]/g, "\\$&");
    };
    BaseCommandService.prototype.loadCLIConfig = function (rootPath) {
        return __awaiter(this, void 0, void 0, function () {
            var file;
            return __generator(this, function (_a) {
                file = path_1.default.join(rootPath, "lcu-cli-config.json");
                return [2 /*return*/, this.loadJSON(file)];
            });
        });
    };
    BaseCommandService.prototype.loadLCUConfig = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.loadJSON('lcu.json')];
            });
        });
    };
    BaseCommandService.prototype.loadFile = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            var fileContent, content;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fs_extra_2.readFile(file)];
                    case 1:
                        fileContent = _a.sent();
                        content = fileContent.toString('utf8');
                        return [2 /*return*/, content];
                }
            });
        });
    };
    BaseCommandService.prototype.loadJS = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            var js;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadFile(file)];
                    case 1:
                        js = _a.sent();
                        return [2 /*return*/, eval(js)];
                }
            });
        });
    };
    BaseCommandService.prototype.loadJSON = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            var json;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadFile(file)];
                    case 1:
                        json = _a.sent();
                        return [2 /*return*/, JSON.parse(json)];
                }
            });
        });
    };
    BaseCommandService.prototype.loadTemplateInquirerQuestions = function (rootPath) {
        return __awaiter(this, void 0, void 0, function () {
            var file;
            return __generator(this, function (_a) {
                file = path_1.default.join(rootPath, this.SysPath + "/inquir.js");
                try {
                    return [2 /*return*/, this.loadJS(file)];
                }
                catch (err) {
                    console.log(err);
                    return [2 /*return*/, []];
                }
                return [2 /*return*/];
            });
        });
    };
    BaseCommandService.prototype.mergeObjects = function (root, merged) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Object.assign(root, merged)];
            });
        });
    };
    return BaseCommandService;
}());
exports.BaseCommandService = BaseCommandService;
