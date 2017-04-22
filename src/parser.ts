import * as ast from "./ast";
import * as lex from "./lexer";
import * as token from "./token";

export class Parser {
    private lexer: lex.Lexer;
    private currentToken: token.Token;
    private stmt: ast.AST[];
    private index: number;

    public constructor(lexer: lex.Lexer) {
        this.lexer = lexer;
        this.stmt = [];
        this.index = -1;

        this.run();
    }

    public next = () => {
        this.index += 1;
        if (this.index > this.stmt.length - 1) {
            return null;
        }
        return this.stmt[this.index];
    }

    private run = () => {
        this.currentToken = this.lexer.next();
        while (this.currentToken !== null) {
            const expr = this.parseExpr();

            if (expr === null) {
                break;
            }

            this.stmt.push(expr);

            if (this.currentToken.token() === token.TokenType.EOF) {
                this.eat(token.TokenType.EOF);
            }
        }
    }

    // expr: TERM ((Add|Sub) TERM)
    private parseExpr = () => {
        let expr = this.parseTerm();

        if (expr === null) {
            return null;
        }

        while (this.currentToken.token() === token.TokenType.Add ||
            this.currentToken.token() === token.TokenType.Sub) {
            const t = this.currentToken;

            if (t.token() === token.TokenType.Add) {
                this.eat(token.TokenType.Add);
            }

            if (t.token() === token.TokenType.Sub) {
                this.eat(token.TokenType.Sub);
            }

            const other = this.parseTerm();

            if (other === null) {
                throw new Error("Uneven " + t.value() + " expression");
            }

            expr = new ast.BiOpAST(t, expr, other);
        }

        return expr;
    }

    // term: VALUE ((Mul|Div|Mod) VALUE)
    private parseTerm = () => {
        let term = this.parseValue();

        if (term === null) {
            return null;
        }

        while (this.currentToken.token() === token.TokenType.Mul ||
            this.currentToken.token() === token.TokenType.Div ||
            this.currentToken.token() === token.TokenType.Mod) {
            const t = this.currentToken;

            if (t.token() === token.TokenType.Mul) {
                this.eat(token.TokenType.Mul);
            }

            if (t.token() === token.TokenType.Div) {
                this.eat(token.TokenType.Div);
            }

            if (t.token() === token.TokenType.Mod) {
                this.eat(token.TokenType.Mod);
            }

            const other = this.parseValue();

            if (other === null) {
                throw new Error("Uneven " + t.value() + " term");
            }

            term = new ast.BiOpAST(t, term, other);
        }

        return term;
    }

    // value: FACTOR ((Pow) FACTOR)
    private parseValue = () => {
        let value = this.parseFactor();

        if (value === null) {
            return null;
        }

        while (this.currentToken.token() === token.TokenType.Pow) {
            const t = this.currentToken;

            if (t.token() === token.TokenType.Pow) {
                this.eat(token.TokenType.Pow);
            }

            const other = this.parseFactor();

            if (other === null) {
                throw new Error("Uneven " + t.value() + " value");
            }

            value = new ast.BiOpAST(t, value, other);
        }

        return value;
    }

    // factor: (Add/Sub) Integer|Float
    private parseFactor = () => {
        const t = this.currentToken;

        if (t.token() === token.TokenType.Integer) {
            this.eat(token.TokenType.Integer);
            return new ast.FactorAST(t);
        } else if (t.token() === token.TokenType.Float) {
            this.eat(token.TokenType.Float);
            return new ast.FactorAST(t);
        } else if (t.token() === token.TokenType.Add) {
            this.eat(token.TokenType.Add);
            return new ast.UniOpAST(t, this.parseFactor());
        } else if (t.token() === token.TokenType.Sub) {
            this.eat(token.TokenType.Sub);
            return new ast.UniOpAST(t, this.parseFactor());
        } else if (t.token() === token.TokenType.LeftParen) {
            this.eat(token.TokenType.LeftParen);
            const expr = this.parseExpr();
            this.eat(token.TokenType.RightParen);
            return expr;
        } else if (t.token() === token.TokenType.EOF) {
            this.eat(token.TokenType.EOF);
            return null;
        } else if (t === null) {
            return null;
        } else {
            throw new Error("Unknown token: " + t.value());
        }
    }

    private eat = (t: token.TokenType) => {
        if (t !== this.currentToken.token()) {
            throw new Error("Wrong token: -->" + this.currentToken.value() + "<--");
        }
        this.currentToken = this.lexer.next();
    }
}
