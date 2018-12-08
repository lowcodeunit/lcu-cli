"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = __importDefault(require("chalk"));
var figlet_1 = __importDefault(require("figlet"));
var Logger = /** @class */ (function () {
    function Logger() {
    }
    Logger.Basic = function (message) {
        console.log(message);
    };
    Logger.Headline = function (headline) {
        this.Basic(chalk_1.default.blue(figlet_1.default.textSync(headline, { horizontalLayout: 'full' })));
    };
    return Logger;
}());
exports.Logger = Logger;
