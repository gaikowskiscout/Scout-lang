import { Scanner } from "./scanner"

const scanner = new Scanner("123 456.789 0 42. 12.34.56");
const tokens = scanner.scanTokens();

console.log(tokens)

export class Scout {
    private hadError = false;
    run(source: string): void {
        console.log(source)
    }
    
    reportError(line: number, message: string): void {
        console.error(`[line ${line}] Error: ${message}`);
        this.hadError = true
    }

    get hasError(): boolean {
        return this.hadError;
    }
}