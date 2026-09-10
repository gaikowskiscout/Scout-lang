"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scout = void 0;
const scanner_1 = require("./scanner");
const scanner = new scanner_1.Scanner("123 456.789 0 42. 12.34.56");
const tokens = scanner.scanTokens();
console.log(tokens);
class Scout {
    hadError = false;
    run(source) {
        console.log(source);
    }
    reportError(line, message) {
        console.error(`[line ${line}] Error: ${message}`);
        this.hadError = true;
    }
    get hasError() {
        return this.hadError;
    }
}
exports.Scout = Scout;
