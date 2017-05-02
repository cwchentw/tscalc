import * as token from "./token";

export class Lexer {
    private pos: number;
    private current: number;
    private offset: number;
    private index: number;
    private strArray: string[];
    private tokens: token.Token[];

    public constructor(input: string) {
        this.pos = 0;
        this.current = 0;
        this.offset = 0;
        this.index = -1;
        this.strArray = input.split("");
        this.tokens = [];

        this.run();
    }

    public next = () => {
        this.index += 1;
        if (this.index >= this.tokens.length) {
            return null;
        }
        return this.tokens[this.index];
    }

    public peek = () => {
        if (this.index + 1 >= this.tokens.length) {
            return null;
        }

        return this.tokens[this.index + 1];
    }

    // Run a finite automata.
    private run = () => {
        let state = this.updateState;
        while (state != null) {
            // Change state.
            state = state();
        }
    }

    private updateState = () => {
        if (this.current >= this.strArray.length) {
            this.tokens.push(
                new token.Token(token.TokenType.EOF, "EOF"));

            // Change state to over.
            return null;
        }

        const s = this.peekString();

        if (s === "(") {
            return this.lexKeyword(1, token.TokenType.LeftParen);
        } else if (s === ")") {
            return this.lexKeyword(1, token.TokenType.RightParen);
        } else if (s === "+") {
            return this.lexKeyword(1, token.TokenType.Add);
        } else if (s === "-") {
            return this.lexKeyword(1, token.TokenType.Sub);
        } else if (s === "*") {
            return this.lexTimes();
        } else if (s === "/") {
            return this.lexKeyword(1, token.TokenType.Div);
        } else if (s === "%") {
            return this.lexKeyword(1, token.TokenType.Mod);
        } else if (this.isUpper(s)) {
            return this.lexWord();
        } else if (this.isDigit(s) || this.isDot(s)) {
            return this.lexNumber();
        } else if (this.isSpace(s)) {
            this.offset += 1;
            this.current += 1;
            this.update();
            return this.updateState;
        } else {
            throw new Error("Unknown string: " + s);
        }
    }
    
    private lexWord = () => {
        let w = this.strArray.slice(this.pos);
        
        if (w.length >= 8) {
            if (w.slice(0, 8).join("") === "Infinity") {
                this.offset += 8;
                this.current += 8;
                this.appendToken(token.TokenType.TInfinity);
                this.update();
                return this.updateState;
            }
        }
        
        if (w.length >= 3) {
            if (w.slice(0, 3).join("") === "NaN") {
                this.offset += 3;
                this.current += 3;
                this.appendToken(token.TokenType.TNaN);
                this.update();
                return this.updateState;
            }
        }

        let s = this.peekString();
        throw new Error("Unknow string: " + s);
    }

    private lexNumber = () => {
        let s = this.peekString();

        if (s === ".") {
            throw new Error("Number with leading dot.");
        }

        while (true) {
            if (this.isDigit(s)) {
                this.offset += 1;
                this.current += 1;
            } else if (this.isDot(s)) {
                this.offset += 1;
                this.current += 1;
                return this.lexFloat();
            } else {
                break;
            }

            if (this.isOutOfBound()) {
                break;
            }

            s = this.peekString();
        }

        this.appendToken(token.TokenType.Integer);
        this.update();

        return this.updateState;
    }

    private lexFloat = () => {
        let s = ".";
        let isDupDot = false;

        while (true) {
            if (this.isDigit(s)) {
                this.offset += 1;
                this.current += 1;
            } else if (this.isDot(s)) {
                if (!isDupDot) {
                    this.offset += 1;
                    this.current += 1;
                    isDupDot = true;
                } else {
                    throw new Error("Duplicated dot in number");
                }
            } else {
                break;
            }

            if (this.isOutOfBound()) {
                break;
            }

            s = this.peekString();
        }

        this.appendToken(token.TokenType.Float);
        this.update();

        return this.updateState;
    }

    private lexTimes = () => {
        if (this.pos + 2 <= this.strArray.length) {
            this.current += 1;
            if (this.peekString() === "*") {
                return this.lexKeyword(2, token.TokenType.Pow);
            }
        }

        return this.lexKeyword(1, token.TokenType.Mul);
    }

    private lexKeyword = (offset: number, t: token.TokenType) => {
        this.offset += offset;
        this.current += offset;

        this.appendToken(t);
        this.update();

        return this.updateState;
    }

    private appendToken = (t: token.TokenType) => {
        const s = this.strArray.slice(this.pos, this.pos + this.offset).join("");

        this.tokens.push(
            new token.Token(t, s),
        );
    }

    private peekString = () => {
        return this.strArray[this.current];
    }
    
    private isUpper = (s: string) => {
        return (s === "A" || s === "B" || s === "C" || s === "D" || s === "E" ||
            s === "F" || s === "G" || s === "H" || s === "I" || s === "J" ||
            s === "K" || s === "L" || s === "M" || s === "N" || s === "O" ||
            s === "P" || s === "Q" || s === "R" || s === "S" || s === "T" ||
            s === "U" || s === "V" || s === "W" || s === "X" || s === "Y" ||
            s === "Z")
    }

    private isDigit = (s: string) => {
        return (s === "0" || s === "1" || s === "2" || s === "3" || s === "4" ||
            s === "5" || s === "6" || s === "7" || s === "8" || s === "9");
    }

    private isDot = (s: string) => {
        return s === ".";
    }

    private isSpace = (s: string) => {
        return (s === " " || s === "\t");
    }

    private isOutOfBound = () => {
        return this.current > this.strArray.length;
    }

    private update = () => {
        this.pos += this.offset;
        this.offset = 0;
        this.current = this.pos;
    }
}
