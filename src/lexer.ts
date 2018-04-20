import * as token from "./token";

// Lexer receives a string and emits an iterator of tokens.
export class Lexer {
    // The start position of a token
    private pos: number;
    // The current position of the lexer.
    private current: number;
    // The offset from pos.
    private offset: number;
    
    // strArray holds the split input string as an array of string.
    private strArray: string[];
    
    // tokens holds an array of Token.
    private tokens: token.Token[];
    // index holds the current location of tokens.
    private index: number;

    public constructor(input: string) {
        // Initialize some values.
        this.pos = 0;
        this.current = 0;
        this.offset = 0;
        this.index = -1;
        this.strArray = input.split("");
        this.tokens = [];

        // Run a finite automata.
        this.run();
    }

    // Emit next token.
    public next = () => {
        this.index += 1;
        if (this.index >= this.tokens.length) {
            return null;
        }
        return this.tokens[this.index];
    }

    // Peek next token without advancing any step.
    public peek = (n = 1) => {
        if (this.index + n >= this.tokens.length) {
            return null;
        }

        return this.tokens[this.index + 1];
    }

    // Run a finite automata.
    private run = () => {
        // Get initial program state.
        let state = this.updateState;
        
        /* Iterate to the next program state 
            while the state is not over, i.e. null. */
        while (state != null) {
            /* `state` change the internal state of the Lexer and
                emits the next program state. */
            state = state();
        }
    }

    /* `updateState` consumes the input string,
        converts the string into a Token, and
        changes the program state */
    private updateState = () => {
        // Push EOF Token to tokens if the input string ends
        if (this.current >= this.strArray.length) {
            this.tokens.push(
                new token.Token(token.Type.EOF, "EOF"));

            // Change the program state to over.
            return null;
        }

        // Peek the next string without consuming it.
        const s = this.peekString();

        // Change the program state according to the next input string.
        if (s === "(") {
            return this.lexKeyword(1, token.Type.LeftParen);
        } else if (s === ")") {
            return this.lexKeyword(1, token.Type.RightParen);
        } else if (s === "+") {
            return this.lexKeyword(1, token.Type.Add);
        } else if (s === "-") {
            return this.lexKeyword(1, token.Type.Sub);
        } else if (s === "*") {
            return this.lexTimes();
        } else if (s === "/") {
            return this.lexKeyword(1, token.Type.Div);
        } else if (s === "%") {
            return this.lexKeyword(1, token.Type.Mod);
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
        const w = this.strArray.slice(this.pos);
        
        if (w.length >= 8) {
            if (w.slice(0, 8).join("") === "Infinity") {
                this.offset += 8;
                this.current += 8;
                this.appendToken(token.Type.TInfinity);
                this.update();
                return this.updateState;
            }
        }
        
        if (w.length >= 3) {
            if (w.slice(0, 3).join("") === "NaN") {
                this.offset += 3;
                this.current += 3;
                this.appendToken(token.Type.TNaN);
                this.update();
                return this.updateState;
            }
        }
        
        if (w.length >= 2) {
            if (w.slice(0, 2).join("") == "PI") {
                this.offset += 2;
                this.current += 2;
                this.appendToken(token.Type.TPI);
                this.update();
                return this.updateState;
            }
        }
        
        if (w.length >= 1) {
            if (w.slice(0, 1).join("") == "E") {
                this.offset += 1;
                this.current += 1;
                this.appendToken(token.Type.TE);
                this.update();
                return this.updateState;
            }
        }

        const s = this.peekString();
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

        this.appendToken(token.Type.Integer);
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

        this.appendToken(token.Type.Float);
        this.update();

        return this.updateState;
    }

    private lexTimes = () => {
        if (this.pos + 2 <= this.strArray.length) {
            this.current += 1;
            if (this.peekString() === "*") {
                return this.lexKeyword(2, token.Type.Pow);
            }
        }

        return this.lexKeyword(1, token.Type.Mul);
    }

    private lexKeyword = (offset: number, t: token.Type) => {
        this.offset += offset;
        this.current += offset;

        this.appendToken(t);
        this.update();

        return this.updateState;
    }

    private appendToken = (t: token.Type) => {
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
            s === "Z");
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
