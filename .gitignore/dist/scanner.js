"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scanner = void 0;
const token_1 = require("./token");
const tokenType_1 = require("./tokenType");
class Scanner {
    // The source code to scan
    source;
    tokens = [];
    start = 0;
    current = 0;
    line = 1;
    error;
    keywords = new Map([
        ["and", tokenType_1.TokenType.AND],
        ["class", tokenType_1.TokenType.CLASS],
        ["else", tokenType_1.TokenType.ELSE],
        ["false", tokenType_1.TokenType.FALSE],
        ["for", tokenType_1.TokenType.FOR],
        ["fun", tokenType_1.TokenType.FUN],
        ["if", tokenType_1.TokenType.IF],
        ["nil", tokenType_1.TokenType.NIL],
        ["or", tokenType_1.TokenType.OR],
        ["print", tokenType_1.TokenType.PRINT],
        ["return", tokenType_1.TokenType.RETURN],
        ["super", tokenType_1.TokenType.SUPER],
        ["this", tokenType_1.TokenType.THIS],
        ["true", tokenType_1.TokenType.TRUE],
        ["var", tokenType_1.TokenType.VAR],
        ["while", tokenType_1.TokenType.WHILE]
    ]);
    constructor(source, error) {
        this.source = source;
        this.error = error;
    }
    // Scans the source code and returns an array of tokens
    scanToken() {
        const c = this.advance();
        if (this.isDigit(c)) {
            // Handle numbers here
            this.number();
        }
        else if (this.isAlpha(c)) {
            // Handle identifiers and keywords here
            this.identifier();
        }
        else {
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
                    this.addToken(tokenType_1.TokenType.LEFT_PAREN);
                    break;
                case ")":
                    this.addToken(tokenType_1.TokenType.RIGHT_PAREN);
                    break;
                case "{":
                    this.addToken(tokenType_1.TokenType.LEFT_BRACE);
                    break;
                case "}":
                    this.addToken(tokenType_1.TokenType.RIGHT_BRACE);
                    break;
                case ",":
                    this.addToken(tokenType_1.TokenType.COMMA);
                    break;
                case ".":
                    this.addToken(tokenType_1.TokenType.DOT);
                    break;
                case "-":
                    this.addToken(tokenType_1.TokenType.MINUS);
                    break;
                case "+":
                    this.addToken(tokenType_1.TokenType.PLUS);
                    break;
                case ";":
                    this.addToken(tokenType_1.TokenType.SEMICOLON);
                    break;
                case "/":
                    // Check for comments
                    if (this.peek() === "/") {
                        while (this.peek() !== "\n" && !this.isAtEnd()) {
                            this.advance();
                        }
                    }
                    else {
                        this.addToken(tokenType_1.TokenType.SLASH);
                    }
                    break;
                case "*":
                    this.addToken(tokenType_1.TokenType.STAR);
                    break;
                default:
                    this.error(this.line, `Unexpected character: ${c}`);
                    break;
            }
        }
    }
    // Handles string literals
    string() {
        while (this.peek() !== '"' && !this.isAtEnd()) {
            if (this.peek() === "\n")
                this.line++;
            this.advance();
        }
        if (this.isAtEnd())
            return;
        this.advance();
        this.addToken(tokenType_1.TokenType.STRING);
    }
    // Handles number literals
    number() {
        while (this.isDigit(this.peek()))
            this.advance();
        if (this.peek() === "." && this.isDigit(this.peekNext())) {
            this.advance();
            while (this.isDigit(this.peek()))
                this.advance();
        }
        this.addToken(tokenType_1.TokenType.NUMBER);
    }
    // Handles identifiers and keywords
    identifier() {
        while (this.isAlpha(this.peek()) || this.isDigit(this.peek()))
            this.advance();
        // Check if the identifier is a keyword
        const text = this.source.substring(this.start, this.current);
        const type = this.keywords.get(text);
        // If it's a keyword, add the corresponding token type; otherwise, add it as an identifier
        if (type !== undefined) {
            this.addToken(type);
        }
        else {
            this.addToken(tokenType_1.TokenType.IDENTIFIER);
        }
    }
    // Checks if a character is a digit
    isDigit(c) {
        return c >= "0" && c <= "9";
    }
    // Checks if a character is an alphabetic character or underscore
    isAlpha(c) {
        return (c >= "a" && c <= "z") || (c >= "A" && c <= "Z") || c === "_";
    }
    // Adds a token to the tokens array
    addToken(type) {
        const text = this.source.substring(this.start, this.current);
        this.tokens.push(new token_1.Token(type, text, null, this.line));
    }
    // Scans the entire source code and returns an array of tokens
    scanTokens() {
        while (!this.isAtEnd()) {
            this.start = this.current;
            this.scanToken();
        }
        return this.tokens;
    }
    // Checks if the scanner has reached the end of the source code
    isAtEnd() {
        return this.current >= this.source.length;
    }
    // Advances the scanner and returns the current character
    advance() {
        return this.source[this.current++];
    }
    // Peeks at the current character without advancing the scanner
    peek() {
        if (this.isAtEnd())
            return "\0";
        return this.source[this.current];
    }
    // Peeks at the next character without advancing the scanner
    peekNext() {
        if (this.current + 1 >= this.source.length)
            return "\0";
        return this.source[this.current + 1];
    }
}
exports.Scanner = Scanner;
