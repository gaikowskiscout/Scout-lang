import { Token } from "./token"
import { TokenType } from "./tokenType"

export class Scanner {
    private source: string;
    private tokens: Token[] = [];
    private start: number = 0;
    private current: number = 0;
    private line: number = 1;

    constructor(source: string){
        this.source = source;
    }

    private scanToken(): void {
        const c = this.advance();

        switch (c) {
            case " ":
            case "\r":
            case "\t":
                break

            case '"':
                this.string();
                break;

            case "\n":
                this.line++;
                break;

            case "(":
                this.addToken(TokenType.LEFT_PAREN);
                break;

            case ")":
                this.addToken(TokenType.RIGHT_PAREN);
                break;

            case "{":
                this.addToken(TokenType.LEFT_BRACE);
                break;

            case "}":
                this.addToken(TokenType.RIGHT_BRACE);
                break;

            case ",":
                this.addToken(TokenType.COMMA);
                break;

            case ".":
                this.addToken(TokenType.DOT);
                break;

            case "-":
                this.addToken(TokenType.MINUS);
                break;

            case "+":
                this.addToken(TokenType.PLUS);
                break;

            case ";":
                this.addToken(TokenType.SEMICOLON);
                break;

            case "/":
                if (this.peek() === "/") {
                    while (this.peek() !== "\n" && !this.isAtEnd()) {
                        this.advance();
                    }
                } else {
                    this.addToken(TokenType.SLASH)
                }
                break;

            case "*":
                this.addToken(TokenType.STAR);
                break;
        }
    }

    private string(): void {
        while (this.peek() !== '"' && !this.isAtEnd()) {
            if (this.peek() === "\n") this.line++;
            this.advance();
        }

        if (this.isAtEnd()) return;
        this.advance();
        this.addToken(TokenType.STRING);
    }

    private addToken(type: TokenType): void {
        const text = this.source.substring(this.start, this.current)
        this.tokens.push(new Token(type, text, null, this.line))
    }

    scanTokens(): Token[] {
        while (!this.isAtEnd()) {
            this.start = this.current;
            this.scanToken();

        }
        return this.tokens;
    }

    private isAtEnd(): boolean {
        return this.current >= this.source.length;
    }

    private advance(): string {
        return this.source[this.current++]
    }

    private peek(): string {
        if (this.isAtEnd()) return "\0"
        return this.source[this.current]
    }
}