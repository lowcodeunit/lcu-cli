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
Object.defineProperty(exports, "__esModule", { value: true });
var logger_1 = require("../../logging/logger");
var BaseCommandService_1 = require("./BaseCommandService");
var ElementCommandService = /** @class */ (function (_super) {
    __extends(ElementCommandService, _super);
    //  Fields
    //  Properties
    //  Constructors
    function ElementCommandService() {
        return _super.call(this) || this;
    }
    //  API Methods
    ElementCommandService.prototype.Setup = function (program) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, program
                        .command('element [name]')
                        .alias('el')
                        .description('Initialize an LCU Element from core templates.')
                        .option('-p|--project <project>', 'The project to add the Element to.')
                        .option('--path <path>', 'The path within a project to add the Element to.')
                        .action(function (name, options) { return __awaiter(_this, void 0, void 0, function () {
                        var context, _a, _b, lcuConfig, templateRepoPath, answers, err_1;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0: return [4 /*yield*/, this.isLcuInitialized()];
                                case 1:
                                    if (!!(_c.sent())) return [3 /*break*/, 2];
                                    this.establishSectionHeader('LCU must be Initialized', 'yellow');
                                    this.establishNextSteps(['Initialize the LCU:', 'lcu init']);
                                    return [3 /*break*/, 13];
                                case 2:
                                    this.establishSectionHeader('LCU Element Setup');
                                    context = {
                                        name: name,
                                        path: options.path || 'src/lib',
                                        projectName: options.project,
                                        template: null
                                    };
                                    _a = context;
                                    return [4 /*yield*/, this.ensureName(context.name)];
                                case 3:
                                    _a.name = _c.sent();
                                    _b = context;
                                    return [4 /*yield*/, this.ensureInquired(context.projectName, 'projectName')];
                                case 4:
                                    _b.projectName = _c.sent();
                                    _c.label = 5;
                                case 5:
                                    _c.trys.push([5, 12, , 13]);
                                    return [4 /*yield*/, this.loadLCUConfig()];
                                case 6:
                                    lcuConfig = _c.sent();
                                    templateRepoPath = this.pathJoin(this.tempFiles, 'repos', lcuConfig.templates.repository, 'element');
                                    return [4 /*yield*/, this.inquir(templateRepoPath)];
                                case 7:
                                    answers = _c.sent();
                                    return [4 /*yield*/, this.mergeObjects(context, answers)];
                                case 8:
                                    context = _c.sent();
                                    return [4 /*yield*/, this.processTemplateInquiries(templateRepoPath, context)];
                                case 9:
                                    answers = _c.sent();
                                    return [4 /*yield*/, this.mergeObjects(context, answers)];
                                case 10:
                                    context = _c.sent();
                                    logger_1.Logger.Basic(context);
                                    return [4 /*yield*/, this.processTemplateCommands(this.pathJoin(templateRepoPath, context.template), context)];
                                case 11:
                                    _c.sent();
                                    this.Ora.succeed("Completed setup for element " + context.projectName + ".");
                                    return [3 /*break*/, 13];
                                case 12:
                                    err_1 = _c.sent();
                                    this.Ora.fail("Issue establishing element: \r\n" + err_1);
                                    process.exit(1);
                                    return [3 /*break*/, 13];
                                case 13: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    //  Helpers
    ElementCommandService.prototype.ensureName = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ensureInquired(name, 'name')];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ElementCommandService.prototype.processTemplateInquiries = function (templatesRepoPath, context) {
        return __awaiter(this, void 0, void 0, function () {
            var cliConfig, questions, setupQuestions, answers, repoTemplateTempPath, templateAnswers;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadCLIConfig()];
                    case 1:
                        cliConfig = _a.sent();
                        questions = [
                            {
                                type: 'list',
                                name: 'template',
                                message: "Choose " + cliConfig.Elements.Title + ":",
                                choices: cliConfig.Elements.Options
                            }
                        ];
                        return [4 /*yield*/, this.loadTemplateInquirerQuestions(templatesRepoPath)];
                    case 2:
                        setupQuestions = _a.sent();
                        if (setupQuestions && setupQuestions.length > 0)
                            questions.push.apply(questions, setupQuestions);
                        return [4 /*yield*/, this.inquir(questions)];
                    case 3:
                        answers = _a.sent();
                        repoTemplateTempPath = this.pathJoin(templatesRepoPath, answers.template);
                        return [4 /*yield*/, this.inquir(repoTemplateTempPath)];
                    case 4:
                        templateAnswers = _a.sent();
                        return [4 /*yield*/, this.mergeObjects(answers, templateAnswers)];
                    case 5:
                        answers = _a.sent();
                        return [2 /*return*/, answers];
                }
            });
        });
    };
    return ElementCommandService;
}(BaseCommandService_1.BaseCommandService));
exports.ElementCommandService = ElementCommandService;
