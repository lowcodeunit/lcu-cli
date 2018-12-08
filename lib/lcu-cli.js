#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./sys/pollyfills");
var logger_1 = require("./logging/logger");
var lcu_cli_service_1 = require("./cli/lcu-cli.service");
var logger = new logger_1.Logger();
;
(function () {
    var cli = new lcu_cli_service_1.LowCodeUnityCLIService('0.0.1', logger);
    cli.SetupCLI().then(function () {
        cli.StartCLI(process.argv).then(function () {
        });
    });
})();
