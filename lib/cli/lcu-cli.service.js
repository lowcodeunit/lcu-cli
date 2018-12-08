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
var logger_1 = require("../logging/logger");
var fs_1 = require("fs");
var clear_1 = __importDefault(require("clear"));
var path_1 = __importDefault(require("path"));
var commander_1 = __importDefault(require("commander"));
var ora_1 = __importDefault(require("ora"));
var chalk_1 = __importDefault(require("chalk"));
var inquirer_1 = __importDefault(require("inquirer"));
var user_home_1 = __importDefault(require("user-home"));
var _3rdparty_async_1 = require("../helpers/3rdparty-async");
var LowCodeUnityCLIService = /** @class */ (function () {
    //  Constructors
    function LowCodeUnityCLIService(version, logger) {
        this.version = version;
        this.logger = logger;
        this.program = commander_1.default
            .version(this.version, '-v|--version');
        this.SysPath = '_sys';
        console.log(this.currentPath);
    }
    Object.defineProperty(LowCodeUnityCLIService.prototype, "currentPath", {
        //  Fields
        get: function () {
            return process.cwd();
        },
        enumerable: true,
        configurable: true
    });
    //  API Methods
    LowCodeUnityCLIService.prototype.SetupCLI = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.setupCli()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.setupInitializeCommand()];
                    case 2:
                        _a.sent();
                        process.on('SIGINT', function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.handleInteruptCommand()];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        return [2 /*return*/];
                }
            });
        });
    };
    LowCodeUnityCLIService.prototype.StartCLI = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.program.parse(args);
                return [2 /*return*/];
            });
        });
    };
    //  Helpers
    LowCodeUnityCLIService.prototype.ensureProjectName = function (projectName) {
        return __awaiter(this, void 0, void 0, function () {
            var answs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!projectName) return [3 /*break*/, 2];
                        return [4 /*yield*/, inquirer_1.default.prompt([
                                {
                                    type: 'input',
                                    name: 'projectName',
                                    message: 'What is the project name?'
                                }
                            ]).catch(function (err) {
                                ora_1.default("Issue loading project name").fail();
                                process.exit(1);
                            })];
                    case 1:
                        answs = _a.sent();
                        projectName = answs.projectName;
                        return [3 /*break*/, 0];
                    case 2: return [2 /*return*/, projectName];
                }
            });
        });
    };
    LowCodeUnityCLIService.prototype.establishTemplates = function (repoTempPath, repo) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var ora, repoTemplatesTempPath, choices, setupQuestions, questions, answers, repoTemplateTempPath, templateQuestions, templateAnswers;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    ora = ora_1.default("Loading Templates Repository '" + repo + "'").start();
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
                                    repoTemplatesTempPath = path_1.default.join(repoTempPath, 'templates');
                                    return [4 /*yield*/, this.loadTemplateOptions(repoTemplatesTempPath)];
                                case 3:
                                    choices = _a.sent();
                                    return [4 /*yield*/, this.loadTemplateSetupQuestions(repoTemplatesTempPath)];
                                case 4:
                                    setupQuestions = _a.sent();
                                    questions = [
                                        {
                                            type: 'list',
                                            name: 'template',
                                            message: 'Choose Template:',
                                            choices: choices
                                        }
                                    ];
                                    if (setupQuestions && setupQuestions.length > 0)
                                        questions.push.apply(questions, setupQuestions);
                                    return [4 /*yield*/, inquirer_1.default.prompt(questions)];
                                case 5:
                                    answers = _a.sent();
                                    repoTemplateTempPath = path_1.default.join(repoTemplatesTempPath, answers.template);
                                    return [4 /*yield*/, this.loadTemplateSetupQuestions(repoTemplateTempPath)];
                                case 6:
                                    templateQuestions = _a.sent();
                                    return [4 /*yield*/, inquirer_1.default.prompt(templateQuestions)];
                                case 7:
                                    templateAnswers = _a.sent();
                                    answers = Object.assign(answers, templateAnswers);
                                    resolve(answers);
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    LowCodeUnityCLIService.prototype.establishSectionHeader = function (title, showHeader, length) {
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
                logger_1.Logger.Basic(chalk_1.default.blue("" + outer + inner + "  " + title + "  " + inner + outer));
                return [2 /*return*/];
            });
        });
    };
    LowCodeUnityCLIService.prototype.establishHeader = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                clear_1.default();
                logger_1.Logger.Headline("LCU-CLI");
                return [2 /*return*/];
            });
        });
    };
    LowCodeUnityCLIService.prototype.handleInteruptCommand = function () {
        //  TODO: Doesn't Work on windows!?  Maybe anywhere?  Want it to exit without prompt.    
        process.exit(1);
    };
    LowCodeUnityCLIService.prototype.loadTemplateOptions = function (rootPath) {
        return __awaiter(this, void 0, void 0, function () {
            var file;
            return __generator(this, function (_a) {
                file = path_1.default.join(rootPath, this.SysPath + "/options.json");
                return [2 /*return*/, this.loadJSON(file)];
            });
        });
    };
    LowCodeUnityCLIService.prototype.loadTemplateSetupQuestions = function (rootPath) {
        return __awaiter(this, void 0, void 0, function () {
            var file;
            return __generator(this, function (_a) {
                file = path_1.default.join(rootPath, this.SysPath + "/setup.js");
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
    LowCodeUnityCLIService.prototype.loadFile = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            var fileContent, content;
            return __generator(this, function (_a) {
                fileContent = fs_1.readFileSync(file);
                content = fileContent.toString('utf8');
                return [2 /*return*/, content];
            });
        });
    };
    LowCodeUnityCLIService.prototype.loadJS = function (file) {
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
    LowCodeUnityCLIService.prototype.loadJSON = function (file) {
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
    LowCodeUnityCLIService.prototype.setupCli = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.program
                    .description('This is the home of the LCU DevKit and the LCU CLI code.')
                    .action(function () {
                    _this.establishHeader();
                });
                return [2 /*return*/];
            });
        });
    };
    LowCodeUnityCLIService.prototype.setupInitializeCommand = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.program
                    .command('initialize [project-name]')
                    .alias('init')
                    .description('Initialize an LCU project from core templates or custom template directories.')
                    .option('-p|--projects-path <path>', 'The path to initialize the LCU project to.')
                    .option('-r|--repository <repo>', 'The Template repository path to use.')
                    .option('-t|--temp-path <temp>', 'The temp file path to use.')
                    .action(function (projectName, options) { return __awaiter(_this, void 0, void 0, function () {
                    var config, _a, answers;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                this.establishSectionHeader('Initializing');
                                config = {
                                    projectName: projectName,
                                    projectsPath: 'projects',
                                    repo: options.repository || 'smart-matrix/lcu-cli-templates-core',
                                    tempPath: path_1.default.join(options.tempPath || user_home_1.default + "\\smart-matrix\\lcu")
                                };
                                _a = config;
                                return [4 /*yield*/, this.ensureProjectName(config.projectName)];
                            case 1:
                                _a.projectName = _b.sent();
                                return [4 /*yield*/, this.establishTemplates(path_1.default.join(config.tempPath, config.projectName, 'templates-repo'), config.repo).catch(function (err) {
                                        ora_1.default("Issue establish templates").fail();
                                        process.exit(1);
                                    })];
                            case 2:
                                answers = _b.sent();
                                config = Object.assign(config, answers);
                                logger_1.Logger.Basic(config);
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        });
    };
    return LowCodeUnityCLIService;
}());
exports.LowCodeUnityCLIService = LowCodeUnityCLIService;
