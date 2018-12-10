"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var BaseCommandService_1 = require("./BaseCommandService");
var chalk_1 = __importDefault(require("chalk"));
var _3rdparty_async_1 = require("../../helpers/3rdparty-async");
var InitializeCommandService = /** @class */ (function (_super) {
    __extends(InitializeCommandService, _super);
    //  Fields
    //  Properties
    //  Constructors
    function InitializeCommandService() {
        return _super.call(this) || this;
    }
    //  API Methods
    InitializeCommandService.prototype.Setup = function (program) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, program
                        .command('initialize')
                        .alias('init')
                        .description('Initialize location as an LCU compatible directory.')
                        .option('-r|--repository <repo>', 'The Template repository path to use as default for all projects (default: lowcodeunit-devkit/lcu-cli-templates-core).')
                        .option('-t|--temp-path <temp>', "The temporary files path to use (default: {{userHomePath}}\\smart-matrix\\lcu).")
                        .action(function (options) { return __awaiter(_this, void 0, void 0, function () {
                        var context, answers, err_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.isLcuInitialized()];
                                case 1:
                                    if (!_a.sent()) return [3 /*break*/, 2];
                                    this.establishSectionHeader('LCU Already Initialized', 'yellow');
                                    return [3 /*break*/, 6];
                                case 2:
                                    this.establishSectionHeader('Initializing');
                                    context = {
                                        projectsPath: 'projects',
                                        repo: options.repository || 'lowcodeunit-devkit/lcu-cli-templates-core',
                                        tempPath: options.tempPath || '{{userHomePath}}\\smart-matrix\\lcu'
                                    };
                                    _a.label = 3;
                                case 3:
                                    _a.trys.push([3, 5, , 6]);
                                    return [4 /*yield*/, this.establishTemplatesRepo(this.pathJoin(context.tempPath, 'repos', context.repo), context.repo)];
                                case 4:
                                    answers = _a.sent();
                                    context = Object.assign(context, answers);
                                    // await this.processTemplates(context);
                                    this.Ora.succeed('Completed initialization of the LCU');
                                    this.establishNextSteps(['Initialize a new project:', 'lcu proj [project-name]']);
                                    return [3 /*break*/, 6];
                                case 5:
                                    err_1 = _a.sent();
                                    this.Ora.fail("Issue establishing templates");
                                    process.exit(1);
                                    return [3 /*break*/, 6];
                                case 6: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    //  Helpers
    InitializeCommandService.prototype.establishTemplatesRepo = function (repoTempPath, repo) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var ora, answers;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    ora = this.Ora.start("Loading Templates Repository '" + repo + "'");
                                    return [4 /*yield*/, _3rdparty_async_1.AsyncHelpers.rimraf(repoTempPath).catch(function (err) {
                                            ora.fail("Issue cleaning temp path @ '" + chalk_1.default.yellow(repoTempPath) + "': " + chalk_1.default.red(err));
                                            process.exit(1);
                                        })];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, _3rdparty_async_1.AsyncHelpers.downloadGit(repo, repoTempPath).catch(function (err) {
                                            ora.fail("Template loading failed with: \n\t" + chalk_1.default.red(err));
                                            process.exit(1);
                                        })];
                                case 2:
                                    _a.sent();
                                    ora.succeed("Loaded Templates to '" + repoTempPath + "'");
                                    answers = this.inquir(repoTempPath);
                                    resolve(answers);
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    InitializeCommandService.prototype.processTemplates = function (context) {
        return __awaiter(this, void 0, void 0, function () {
            var ora, lcuFile, lcuConfig;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ora = this.Ora.start('Started creation of LCU config file...');
                        return [4 /*yield*/, this.loadLCUConfigTemplate(context.tempPath, 'repos', context.repo, this.SysPath)];
                    case 1:
                        lcuFile = _a.sent();
                        return [4 /*yield*/, this.compileTemplate(lcuFile, context)];
                    case 2:
                        lcuFile = _a.sent();
                        lcuConfig = JSON.parse(lcuFile);
                        return [4 /*yield*/, this.saveLCUConfig(lcuConfig)];
                    case 3:
                        _a.sent();
                        ora.succeed('Completed creation of the LCU config file.');
                        return [2 /*return*/];
                }
            });
        });
    };
    return InitializeCommandService;
}(BaseCommandService_1.BaseCommandService));
exports.InitializeCommandService = InitializeCommandService;
