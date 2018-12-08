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
var fs_extra_1 = __importDefault(require("fs-extra"));
var path_1 = __importDefault(require("path"));
var chalk_1 = __importDefault(require("chalk"));
var handlebars_1 = __importDefault(require("handlebars"));
var _3rdparty_async_1 = require("../../helpers/3rdparty-async");
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
                        .option('-p|--projects-path <path>', 'The path to use for projects working directory (default: projects).')
                        .action(function (projectName, options) { return __awaiter(_this, void 0, void 0, function () {
                        var context, _a, lcuConfig;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, this.isLcuInitialized()];
                                case 1:
                                    if (!!(_b.sent())) return [3 /*break*/, 2];
                                    this.establishSectionHeader('LCU Is Not Yet Initialized', 'yellow');
                                    this.establishNextSteps(['Initialize the LCU:', 'lcu init']);
                                    return [3 /*break*/, 5];
                                case 2:
                                    this.establishSectionHeader('Project Setup');
                                    context = {
                                        projectName: projectName,
                                        projectsPath: 'projects'
                                    };
                                    _a = context;
                                    return [4 /*yield*/, this.ensureProjectName(context.projectName)];
                                case 3:
                                    _a.projectName = _b.sent();
                                    return [4 /*yield*/, this.loadLCUConfig()];
                                case 4:
                                    lcuConfig = _b.sent();
                                    try {
                                        // var result = await this.establishTemplates(path.join(lcuConfig.environment.tempPath, 'templates-repo/projects', context.projectName), lcuConfig.templates.repository);
                                        // context = Object.assign(context, result.Answers);
                                        // //  TODO: Parse context against templates
                                        // var files = await this.processTemplates(result.CLI.Projects, context);
                                    }
                                    catch (err) {
                                        this.Ora.fail("Issue establishing templates");
                                        console.log(err);
                                        process.exit(1);
                                    }
                                    _b.label = 5;
                                case 5: return [2 /*return*/];
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
    ProjectCommandService.prototype.establishTemplates = function (repoTempPath, repo) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var ora, config, repoTemplatesTempPath, setupQuestions, questions, answers, repoTemplateTempPath, templateQuestions, templateAnswers;
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
                                    return [4 /*yield*/, this.loadCLIConfig(repoTempPath)];
                                case 3:
                                    config = _a.sent();
                                    repoTemplatesTempPath = path_1.default.join(repoTempPath, config.Projects.Root);
                                    return [4 /*yield*/, this.loadTemplateInquirerQuestions(repoTemplatesTempPath)];
                                case 4:
                                    setupQuestions = _a.sent();
                                    questions = [
                                        {
                                            type: 'list',
                                            name: 'template',
                                            message: "Choose " + config.Projects.Title + ":",
                                            choices: config.Projects.Options
                                        }
                                    ];
                                    if (setupQuestions && setupQuestions.length > 0)
                                        questions.push.apply(questions, setupQuestions);
                                    return [4 /*yield*/, this.inquir(questions)];
                                case 5:
                                    answers = _a.sent();
                                    repoTemplateTempPath = path_1.default.join(repoTemplatesTempPath, answers.template);
                                    return [4 /*yield*/, this.loadTemplateInquirerQuestions(repoTemplateTempPath)];
                                case 6:
                                    templateQuestions = _a.sent();
                                    return [4 /*yield*/, this.inquir(templateQuestions)];
                                case 7:
                                    templateAnswers = _a.sent();
                                    answers = Object.assign(answers, templateAnswers);
                                    resolve({
                                        Answers: answers,
                                        CLI: config
                                    });
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    ProjectCommandService.prototype.loadTemplateInquirerQuestions = function (rootPath) {
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
    ProjectCommandService.prototype.processTemplates = function (cli, context) {
        return __awaiter(this, void 0, void 0, function () {
            var lcuConfig, template, lcuFile;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fs_extra_1.default.readJson(path_1.default.join(context.tempPath, context.projectName, 'templates-repo', cli.Root, 'lcu.json'), { throws: false })];
                    case 1:
                        lcuConfig = _a.sent();
                        template = handlebars_1.default.compile(JSON.stringify(lcuConfig));
                        lcuFile = template(context);
                        lcuConfig = JSON.parse(lcuFile);
                        return [4 /*yield*/, fs_extra_1.default.writeJson('lcu.json', lcuConfig, { spaces: '\t' })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return ProjectCommandService;
}(BaseCommandService_1.BaseCommandService));
exports.ProjectCommandService = ProjectCommandService;
