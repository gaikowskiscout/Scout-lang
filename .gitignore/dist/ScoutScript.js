"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scout = void 0;
const scanner_1 = require("./scanner");
console.log("Scanning...");
class Scout {
    hadError = false;
    run(source) {
        // create a scanner using source
        const scanner = new scanner_1.Scanner(source, this.reportError);
        const tokens = scanner.scanTokens();
        // print the tokens
        for (const token of tokens) {
            console.log(token);
        }
    }
    reportError = (line, message) => {
        console.error(`[line ${line}] Error: ${message}`);
        this.hadError = true;
    };
    get hasError() {
        return this.hadError;
    }
}
exports.Scout = Scout;
