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
var logger_1 = require("./../../logging/logger");
var BaseCommandService_1 = require("./BaseCommandService");
var chalk_1 = __importDefault(require("chalk"));
var exeq_1 = __importDefault(require("exeq"));
var _3rdparty_async_1 = require("../../helpers/3rdparty-async");
var UpdateCommandService = /** @class */ (function (_super) {
    __extends(UpdateCommandService, _super);
    //  Fields
    //  Properties
    //  Constructors
    function UpdateCommandService() {
        return _super.call(this) || this;
    }
    //  API Methods
    UpdateCommandService.prototype.Setup = function (program) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, program
                        .command('update')
                        .alias('up')
                        .description('Update location with latest LCU libraries.')
                        .option('-s|--scope <scope>', 'The scope to add the Solution to.')
                        .action(function (options) { return __awaiter(_this, void 0, void 0, function () {
                        var lcuConfig, context, repoTempPath, answers, err_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.isLcuInitialized()];
                                case 1:
                                    if (!!(_a.sent())) return [3 /*break*/, 2];
                                    this.establishSectionHeader('LCU must be Initialized', 'yellow');
                                    this.establishNextSteps(['Initialize the LCU:', 'lcu init']);
                                    return [3 /*break*/, 10];
                                case 2:
                                    this.establishSectionHeader('Updating');
                                    return [4 /*yield*/, this.loadLCUConfig()];
                                case 3:
                                    lcuConfig = _a.sent();
                                    context = {
                                        repo: options.repository || lcuConfig.templates.repository || 'lowcodeunit-devkit/lcu-cli-templates-core',
                                        scopes: options.scope ? options.scope.split(',') : ['@lcu', '@lowcodeunit']
                                    };
                                    lcuConfig.templates.repository = context.repo;
                                    _a.label = 4;
                                case 4:
                                    _a.trys.push([4, 9, , 10]);
                                    return [4 /*yield*/, this.saveLCUConfig(lcuConfig)];
                                case 5:
                                    _a.sent();
                                    repoTempPath = this.pathJoin(this.tempFiles, 'repos', context.repo);
                                    return [4 /*yield*/, this.establishTemplatesRepo(repoTempPath, context.repo)];
                                case 6:
                                    _a.sent();
                                    answers = this.inquir(this.pathJoin(repoTempPath, 'update'));
                                    context = Object.assign(context, answers);
                                    return [4 /*yield*/, this.processTemplates(context, 'update')];
                                case 7:
                                    _a.sent();
                                    return [4 /*yield*/, this.upgradeLCUPackages(context.scopes)];
                                case 8:
                                    _a.sent();
                                    this.Ora.succeed('Completed update of the LCU');
                                    return [3 /*break*/, 10];
                                case 9:
                                    err_1 = _a.sent();
                                    this.Ora.fail("Issue updating LCU");
                                    process.exit(1);
                                    return [3 /*break*/, 10];
                                case 10: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    //  Helpers
    UpdateCommandService.prototype.establishTemplatesRepo = function (repoTempPath, repo) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var ora;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    ora = this.Ora.start("Loading Templates Repository '" + repo + "'");
                                    return [4 /*yield*/, _3rdparty_async_1.AsyncHelpers.rimraf(repoTempPath).catch(function (err) {
                                            ora.fail("Issue cleaning temp path @ '" + chalk_1.default.yellow(repoTempPath) + "': " + chalk_1.default.red(err));
                                            process.exit(1);
                                            reject();
                                        })];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, _3rdparty_async_1.AsyncHelpers.downloadGit(repo, repoTempPath).catch(function (err) {
                                            ora.fail("Template loading failed with: \n\t" + chalk_1.default.red(err));
                                            process.exit(1);
                                            reject();
                                        })];
                                case 2:
                                    _a.sent();
                                    ora.succeed("Loaded Templates to '" + repoTempPath + "'");
                                    resolve();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    UpdateCommandService.prototype.processTemplates = function (context, subPath) {
        return __awaiter(this, void 0, void 0, function () {
            var templatesRepoPath, source;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        templatesRepoPath = this.pathJoin(this.tempFiles, 'repos', context.repo);
                        source = this.pathJoin(templatesRepoPath, subPath);
                        return [4 /*yield*/, this.processTemplateCommands(source, context)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    UpdateCommandService.prototype.upgradeLCUPackages = function (scopes) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var packageJSON, deps, devDeps, lcuUpgradeCommands, depsUpgradeCommands, devDepsUpgradeCommands, upgrade, proc;
                        var _this = this;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.loadJSON('package.json')];
                                case 1:
                                    packageJSON = _a.sent();
                                    deps = packageJSON.dependencies || [];
                                    devDeps = packageJSON.devDependencies || [];
                                    lcuUpgradeCommands = [];
                                    depsUpgradeCommands = Object.keys(deps).map(function (depKey) {
                                        var dep = deps[depKey];
                                        if (scopes.some(function (v) { return depKey.startsWith(v); }))
                                            return depKey + "@latest";
                                        else
                                            return null;
                                    }).filter(function (d) { return d != null; });
                                    if (depsUpgradeCommands && depsUpgradeCommands.length > 0)
                                        lcuUpgradeCommands.push("npm i " + depsUpgradeCommands.join(' ') + " --save");
                                    devDepsUpgradeCommands = Object.keys(devDeps).map(function (depKey) {
                                        var dep = deps[depKey];
                                        if (scopes.some(function (v) { return depKey.startsWith(v); }))
                                            return depKey + "@latest";
                                        else
                                            return null;
                                    }).filter(function (d) { return d != null; });
                                    if (devDepsUpgradeCommands && devDepsUpgradeCommands.length > 0)
                                        lcuUpgradeCommands.push("npm i " + devDepsUpgradeCommands.join(' ') + " --save-dev");
                                    if (lcuUpgradeCommands.length > 0) {
                                        upgrade = lcuUpgradeCommands.join(' && ');
                                        logger_1.Logger.Basic("Executing upgrade command '" + upgrade + "'...");
                                        proc = exeq_1.default(upgrade);
                                        proc.q.on('stdout', function (data) {
                                            logger_1.Logger.Basic(data);
                                        });
                                        proc.q.on('stderr', function (data) {
                                            logger_1.Logger.Basic(data);
                                        });
                                        proc.q.on('killed', function (reason) {
                                            logger_1.Logger.Basic("Killed upgrade command '" + upgrade + "'!");
                                        });
                                        proc.q.on('done', function () { return __awaiter(_this, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                logger_1.Logger.Basic("Executed upgrade command '" + upgrade + "'!");
                                                resolve();
                                                return [2 /*return*/];
                                            });
                                        }); });
                                        proc.q.on('failed', function () {
                                            logger_1.Logger.Basic("Failed upgrade command '" + upgrade + "'!");
                                            reject();
                                        });
                                    }
                                    else {
                                        logger_1.Logger.Basic("Executed upgrade command !");
                                        resolve();
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    return UpdateCommandService;
}(BaseCommandService_1.BaseCommandService));
exports.UpdateCommandService = UpdateCommandService;
