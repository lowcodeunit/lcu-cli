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
var chalk_1 = __importDefault(require("chalk"));
var _3rdparty_async_1 = require("./../../helpers/3rdparty-async");
var logger_1 = require("./../../logging/logger");
var BaseCommandService_1 = require("./BaseCommandService");
var exeq_1 = __importDefault(require("exeq"));
var ProjectCommandService = /** @class */ (function (_super) {
    __extends(ProjectCommandService, _super);
    //  Fields
    //  Properties
    //  Constructors
    function ProjectCommandService() {
        return _super.call(this) || this;
    }
    //  API Methods
    ProjectCommandService.prototype.Setup = function (program) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, program
                        .command('project [project-name]')
                        .alias('proj')
                        .description('Initialize an LCU project from core templates or custom template directories.')
                        .option('-r|--repository <repo>', 'The Template repository path to use as default for all projects (default: lowcodeunit-devkit/lcu-cli-templates-core).')
                        .option('-p|--projects-path <path>', 'The path to use for projects working directory (default: projects).')
                        .option('-w|--initWith <initWith>', 'The description of what to initialize the libray with...  Blank|Default|Solution|PageElement|SPE (default: Default).')
                        .action(function (projectName, options) { return __awaiter(_this, void 0, void 0, function () {
                        var context, _a, answers, err_1;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, this.isLcuInitialized()];
                                case 1:
                                    if (!_b.sent()) return [3 /*break*/, 2];
                                    this.establishSectionHeader('LCU Already Initialized', 'yellow');
                                    this.establishNextSteps(['Initialize the LCU:', 'lcu init']);
                                    return [3 /*break*/, 10];
                                case 2:
                                    this.establishSectionHeader('Project Setup');
                                    context = {
                                        projectName: projectName,
                                        projectsPath: 'projects',
                                        template: null,
                                        initWith: options.initWith || 'Default',
                                        repo: options.repository || 'lowcodeunit-devkit/lcu-cli-templates-core',
                                        tempPath: '{{userHomePath}}\\smart-matrix\\lcu'
                                    };
                                    _a = context;
                                    return [4 /*yield*/, this.ensureProjectName(context.projectName)];
                                case 3:
                                    _a.projectName = _b.sent();
                                    _b.label = 4;
                                case 4:
                                    _b.trys.push([4, 9, , 10]);
                                    return [4 /*yield*/, this.establishTemplatesRepo(this.pathJoin(context.tempPath, 'repos', context.repo), context.repo)];
                                case 5:
                                    answers = _b.sent();
                                    context = Object.assign(context, answers);
                                    return [4 /*yield*/, this.processTemplateInquiries(context)];
                                case 6:
                                    answers = _b.sent();
                                    return [4 /*yield*/, this.mergeObjects(context, answers)];
                                case 7:
                                    context = _b.sent();
                                    return [4 /*yield*/, this.processTemplates(context)];
                                case 8:
                                    _b.sent();
                                    this.Ora.succeed("Completed setup for project " + context.projectName + ".");
                                    return [3 /*break*/, 10];
                                case 9:
                                    err_1 = _b.sent();
                                    this.Ora.fail("Issue establishing project: \r\n" + err_1);
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
    ProjectCommandService.prototype.ensureProjectName = function (projectName) {
        return __awaiter(this, void 0, void 0, function () {
            var answs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!projectName) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.inquir([
                                {
                                    type: 'input',
                                    name: 'projectName',
                                    message: 'What is the project name?'
                                }
                            ], 'Issue loading project name')];
                    case 1:
                        answs = _a.sent();
                        projectName = answs.projectName;
                        return [3 /*break*/, 0];
                    case 2: return [2 /*return*/, projectName];
                }
            });
        });
    };
    ProjectCommandService.prototype.establishTemplatesRepo = function (repoTempPath, repo) {
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
    ProjectCommandService.prototype.mergeLcuFiles = function (lcuConfig, lcuConfigTemplate, context) {
        return __awaiter(this, void 0, void 0, function () {
            var lcuCfgTemp, tempCfg;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.compileTemplate(lcuConfigTemplate, context)];
                    case 1:
                        lcuCfgTemp = _a.sent();
                        tempCfg = JSON.parse(lcuCfgTemp);
                        return [4 /*yield*/, this.mergeObjects(lcuConfig, tempCfg)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ProjectCommandService.prototype.processTemplateInquiries = function (context) {
        return __awaiter(this, void 0, void 0, function () {
            var templatesRepoPath, cliConfig, repoTemplatesTempPath, setupQuestions, questions, answers, repoTemplateTempPath, templateQuestions, templateAnswers;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        templatesRepoPath = this.pathJoin(context.tempPath, 'repos', context.repo);
                        return [4 /*yield*/, this.loadCLIConfig(templatesRepoPath)];
                    case 1:
                        cliConfig = _a.sent();
                        repoTemplatesTempPath = this.pathJoin(templatesRepoPath, cliConfig.Projects.Root);
                        return [4 /*yield*/, this.loadTemplateInquirerQuestions(repoTemplatesTempPath)];
                    case 2:
                        setupQuestions = _a.sent();
                        questions = [
                            {
                                type: 'list',
                                name: 'template',
                                message: "Choose " + cliConfig.Projects.Title + ":",
                                choices: cliConfig.Projects.Options
                            }
                        ];
                        if (setupQuestions && setupQuestions.length > 0)
                            questions.push.apply(questions, setupQuestions);
                        return [4 /*yield*/, this.inquir(questions)];
                    case 3:
                        answers = _a.sent();
                        repoTemplateTempPath = this.pathJoin(repoTemplatesTempPath, answers.template);
                        return [4 /*yield*/, this.loadTemplateInquirerQuestions(repoTemplateTempPath)];
                    case 4:
                        templateQuestions = _a.sent();
                        return [4 /*yield*/, this.inquir(templateQuestions)];
                    case 5:
                        templateAnswers = _a.sent();
                        return [4 /*yield*/, this.mergeObjects(answers, templateAnswers)];
                    case 6:
                        answers = _a.sent();
                        return [2 /*return*/, answers];
                }
            });
        });
    };
    ProjectCommandService.prototype.processTemplates = function (context) {
        return __awaiter(this, void 0, void 0, function () {
            var templatesRepoPath, cliConfig, source;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        templatesRepoPath = this.pathJoin(context.tempPath, 'repos', context.repo);
                        return [4 /*yield*/, this.loadCLIConfig(templatesRepoPath)];
                    case 1:
                        cliConfig = _a.sent();
                        source = this.pathJoin(templatesRepoPath, cliConfig.Projects.Root, context.template);
                        return [4 /*yield*/, this.processTemplateCommands(source, context)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ProjectCommandService.prototype.processTemplateCommands = function (templateSourcePath, context) {
        return __awaiter(this, void 0, void 0, function () {
            var ora, commandsFile, commands;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ora = this.Ora.start("Loading " + context.template + " commands ...");
                        return [4 /*yield*/, this.compileTemplateFromPath(context, this.pathJoin(templateSourcePath, this.SysPath, 'commands.json'))];
                    case 1:
                        commandsFile = _a.sent();
                        commands = JSON.parse(commandsFile);
                        ora.succeed("Loaded " + context.template + " commands");
                        return [4 /*yield*/, this.processNextCommand(commands, context)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ProjectCommandService.prototype.processNextCommand = function (commands, context) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (commands && commands.length > 0) {
                var command = commands.shift();
                var ora = _this.Ora.start("Executing " + context.template + " command: " + command);
                var proc = exeq_1.default(command);
                proc.q.on('stdout', function (data) {
                    // Logger.Basic(data);
                });
                proc.q.on('stderr', function (data) {
                    logger_1.Logger.Basic(data);
                });
                proc.q.on('killed', function (reason) {
                    ora.fail("Command execution failed for " + command + ": " + reason);
                });
                proc.q.on('done', function () { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                ora.succeed("Successfully executed command: " + command);
                                return [4 /*yield*/, this.processNextCommand(commands, context)];
                            case 1:
                                _a.sent();
                                resolve();
                                return [2 /*return*/];
                        }
                    });
                }); });
                proc.q.on('failed', function () {
                    ora.fail("Failed execution of command: " + command);
                    reject();
                });
            }
            else {
                _this.Ora.succeed("All commands have been processed for template " + context.template);
                resolve();
            }
        });
    };
    return ProjectCommandService;
}(BaseCommandService_1.BaseCommandService));
exports.ProjectCommandService = ProjectCommandService;
