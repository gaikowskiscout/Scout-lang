import { Scanner } from "./scanner"

console.log("Scanning...")

export class Scout {
    private hadError = false;
    run(source: string): void {
        // create a scanner using source
        const scanner = new Scanner(source, this.reportError);
        const tokens = scanner.scanTokens();
        // print the tokens
        for (const token of tokens) {
            console.log(token);
        }
    }
    
    reportError = (line: number, message: string): void => {
        console.error(`[line ${line}] Error: ${message}`);
        this.hadError = true
    }

    get hasError(): boolean {
        return this.hadError;
    }
}
