import { Token } from "./token"
import { TokenType } from "./tokenType"

export class Scanner {
    // The source code to scan
    private source: string;
    private tokens: Token[] = [];
    private start: number = 0;
    private current: number = 0;
    private line: number = 1;
    private error: (line: number, message: string) => void;

    private keywords: Map<string, TokenType> = new Map([
        ["and", TokenType.AND],
        ["class", TokenType.CLASS],
        ["else", TokenType.ELSE],
        ["false", TokenType.FALSE],
        ["for", TokenType.FOR],
        ["fun", TokenType.FUN],
        ["if", TokenType.IF],
        ["nil", TokenType.NIL],
        ["or", TokenType.OR],
        ["print", TokenType.PRINT],
        ["return", TokenType.RETURN],
        ["super", TokenType.SUPER],
        ["this", TokenType.THIS],
        ["true", TokenType.TRUE],
        ["var", TokenType.VAR],
        ["while", TokenType.WHILE]
        ]);
    

    constructor(
        source: string,
        error: (line: number, message: string) => void
    ){
        this.source = source;
        this.error = error;
    }

    // Scans the source code and returns an array of tokens
    private scanToken(): void {
        const c = this.advance();

        if (this.isDigit(c)) {
            // Handle numbers here
            this.number();
        } else if (this.isAlpha(c)) {
            // Handle identifiers and keywords here
            this.identifier();
        } else {
            // Handle other single-character tokens and whitespace
            switch (c) {
                case " ":
                case "\r":
                case "\t":
                    break;

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
                    // Check for comments
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
                
                case "!":
                    this.addToken(this.match("=") ? TokenType.BANG_EQUAL : TokenType.BANG);
                    break;
                case "=":
                    this.addToken(this.match("=") ? TokenType.EQUAL_EQUAL : TokenType.EQUAL);
                    break;
                case "<":
                    this.addToken(this.match("=") ? TokenType.LESS_EQUAL : TokenType.LESS);
                    break;
                case ">":
                    this.addToken(this.match("=") ? TokenType.GREATER_EQUAL : TokenType.GREATER);
                    break;
                

                default:
                    this.error(this.line, `Unexpected character: ${c}`);
                    break;
            }
        }
    }
    // Handles string literals
    private string(): void {
        while (this.peek() !== '"' && !this.isAtEnd()) {
            if (this.peek() === "\n") this.line++;
            this.advance();
        }

        if (this.isAtEnd()) return;
        this.advance();
        this.addToken(TokenType.STRING);
    }
    // Handles number literals
    private number(): void {
        while (this.isDigit(this.peek())) this.advance();
        if (this.peek() === "." && this.isDigit(this.peekNext())) {
            this.advance();
            while (this.isDigit(this.peek())) this.advance();
        }
        this.addToken(TokenType.NUMBER);
    }
    // Handles identifiers and keywords
    private identifier(): void {
        while (this.isAlpha(this.peek()) || this.isDigit(this.peek())) this.advance();
        // Check if the identifier is a keyword
        const text = this.source.substring(this.start, this.current);
        const type = this.keywords.get(text);
        // If it's a keyword, add the corresponding token type; otherwise, add it as an identifier
        if (type !== undefined) {
            this.addToken(type);
        } else {
            this.addToken(TokenType.IDENTIFIER);
        }
    }
    // Checks if a character is a digit
    private isDigit(c: string): boolean {
        return c >= "0" && c <= "9";
    }
    // Checks if a character is an alphabetic character or underscore
    private isAlpha(c: string): boolean {
        return (c >= "a" && c <= "z") || (c >= "A" && c <= "Z") || c === "_";
    }
    // Adds a token to the tokens array
    private addToken(type: TokenType): void {
        const text = this.source.substring(this.start, this.current)
        this.tokens.push(new Token(type, text, null, this.line))
    }
    // Checks if the current character matches the expected character and advances the scanner if it does
    private match(expected: string): boolean {
        if (this.isAtEnd()) return false;
        if (this.source[this.current] !== expected) return false;
        this.current++;
        return true;
    }
    // Scans the entire source code and returns an array of tokens
    scanTokens(): Token[] {
        while (!this.isAtEnd()) {
            this.start = this.current;
            this.scanToken();

        }
        return this.tokens;
    }
    // Checks if the scanner has reached the end of the source code
    private isAtEnd(): boolean {
        return this.current >= this.source.length;
    }
    // Advances the scanner and returns the current character
    private advance(): string {
        return this.source[this.current++]
    }
    // Peeks at the current character without advancing the scanner
    private peek(): string {
        if (this.isAtEnd()) return "\0"
        return this.source[this.current]
    }
    // Peeks at the next character without advancing the scanner
    private peekNext(): string {
        if (this.current + 1 >= this.source.length) return "\0"
        return this.source[this.current + 1]
    }
}