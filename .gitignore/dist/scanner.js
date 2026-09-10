"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scanner = void 0;
const token_1 = require("./token");
const tokenType_1 = require("./tokenType");
class Scanner {
    source;
    tokens = [];
    start = 0;
    current = 0;
    line = 1;
    constructor(source) {
        this.source = source;
    }
    scanToken() {
        const c = this.advance();
        if (this.isDigit(c)) {
            this.number();
        }
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
        }
    }
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
    isDigit(c) {
        return c >= "0" && c <= "9";
    }
    addToken(type) {
        const text = this.source.substring(this.start, this.current);
        this.tokens.push(new token_1.Token(type, text, null, this.line));
    }
    scanTokens() {
        while (!this.isAtEnd()) {
            this.start = this.current;
            this.scanToken();
        }
        return this.tokens;
    }
    isAtEnd() {
        return this.current >= this.source.length;
    }
    advance() {
        return this.source[this.current++];
    }
    peek() {
        if (this.isAtEnd())
            return "\0";
        return this.source[this.current];
    }
    peekNext() {
        if (this.current + 1 >= this.source.length)
            return "\0";
        return this.source[this.current + 1];
    }
}
exports.Scanner = Scanner;
