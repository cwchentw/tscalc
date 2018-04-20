import * as ast from "./ast";
import * as lexer from "./lexer";
import * as token from "./token";

/* The language spec of Parser:
   STMT: EXPR (, EXPR, EXPR, ...) // We have only one STMT currently.
   EXPR: TERM ((Add/Sub) TERM)
   TERM: VALUE ((Mul/Div/Mod) VALUE)
   VALUE: FACTOR ((Pow) FACTOR)
   FACTOR: BUILTIN( ELEMENT (, ELEMENT, ...) )  // Unimplemented yet
   ELEMENT: (Add/Sub) Int|Float|NaN|Inf|Const
   Add: +
   Sub: -
   Mul: *
   Div: /
   Mod: %
   Pow: **
   BUILTIN: sin, cos, tan, ... as those functions in JavaScript.
   Int: an integer as that in JavaScript
   Float: an floating-point number as that in JavaScript.
   NaN: NaN in JavaScript
   Inf: Infinity: in JavaScript
   Const: PI and E in JavaScript
 */
export class Parser {
    private lexer: lexer.Lexer;
    private currentToken: token.Token;
    private stmt: ast.AST[];
    private index: number;

    public constructor(lexer: lexer.Lexer) {
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

    // STMT: EXPR (, EXPR, EXPR, ...)
    private run = () => {
        this.currentToken = this.lexer.next();
        while (this.currentToken !== null) {
            const expr = this.parseExpr();

            if (expr === null) {
                break;
            }

            this.stmt.push(expr);

            if (this.currentToken.token() === token.Type.EOF) {
                this.eat(token.Type.EOF);
            }
        }
    }

    // EXPR: TERM ((Add/Sub) TERM)
    private parseExpr = () => {
        let expr = this.parseTerm();

        if (expr === null) {
            return null;
        }

        while (this.currentToken.token() === token.Type.Add ||
            this.currentToken.token() === token.Type.Sub) {
            const t = this.currentToken;

            if (t.token() === token.Type.Add) {
                this.eat(token.Type.Add);
            }

            if (t.token() === token.Type.Sub) {
                this.eat(token.Type.Sub);
            }

            const other = this.parseTerm();

            if (other === null) {
                throw new Error("Uneven " + t.value() + " expression");
            }

            expr = new ast.BiOpAST(t, expr, other);
        }

        return expr;
    }

    // TERM: VALUE ((Mul/Div/Mod) VALUE)
    private parseTerm = () => {
        let term = this.parseValue();

        if (term === null) {
            return null;
        }

        while (this.currentToken.token() === token.Type.Mul ||
            this.currentToken.token() === token.Type.Div ||
            this.currentToken.token() === token.Type.Mod) {
            const t = this.currentToken;

            if (t.token() === token.Type.Mul) {
                this.eat(token.Type.Mul);
            }

            if (t.token() === token.Type.Div) {
                this.eat(token.Type.Div);
            }

            if (t.token() === token.Type.Mod) {
                this.eat(token.Type.Mod);
            }

            const other = this.parseValue();

            if (other === null) {
                throw new Error("Uneven " + t.value() + " term");
            }

            term = new ast.BiOpAST(t, term, other);
        }

        return term;
    }

    // VALUE: FACTOR ((Pow) FACTOR)
    private parseValue = () => {
        let value = this.parseFactor();

        if (value === null) {
            return null;
        }

        while (this.currentToken.token() === token.Type.Pow) {
            const t = this.currentToken;

            if (t.token() === token.Type.Pow) {
                this.eat(token.Type.Pow);
            }

            const other = this.parseFactor();

            if (other === null) {
                throw new Error("Uneven " + t.value() + " value");
            }

            value = new ast.BiOpAST(t, value, other);
        }

        return value;
    }
    
    // FACTOR: BUILTIN( ELEMENT (, ELEMENT, ...) )
    // Unimplemented.

    // ELEMENT: (Add/Sub) Int|Float|NaN|Inf|Const
    private parseFactor = () => {
        const t = this.currentToken;

        if (t.token() === token.Type.Integer) {
            this.eat(token.Type.Integer);
            return new ast.FactorAST(t);
        } else if (t.token() === token.Type.Float) {
            this.eat(token.Type.Float);
            return new ast.FactorAST(t);
        } else if (t.token() === token.Type.TNaN) {
            this.eat(token.Type.TNaN);
            return new ast.FactorAST(t);
        } else if (t.token() === token.Type.TInfinity) {
            this.eat(token.Type.TInfinity);
            return new ast.FactorAST(t);
        } else if (t.token() === token.Type.TPI) {
            this.eat(token.Type.TPI);
            return new ast.FactorAST(t);
        } else if (t.token() == token.Type.TE) {
            this.eat(token.Type.TE);
            return new ast.FactorAST(t);
        } else if (t.token() === token.Type.Add) {
            this.eat(token.Type.Add);
            return new ast.UniOpAST(t, this.parseFactor());
        } else if (t.token() === token.Type.Sub) {
            this.eat(token.Type.Sub);
            return new ast.UniOpAST(t, this.parseFactor());
        } else if (t.token() === token.Type.LeftParen) {
            this.eat(token.Type.LeftParen);
            const expr = this.parseExpr();
            this.eat(token.Type.RightParen);
            return expr;
        } else if (t.token() === token.Type.EOF) {
            this.eat(token.Type.EOF);
            return null;
        } else if (t === null) {
            return null;
        } else {
            throw new Error("Unknown token: " + t.value());
        }
    }

    private eat = (t: token.Type) => {
        if (t !== this.currentToken.token()) {
            throw new Error("Wrong token: -->" + this.currentToken.value() + "<--");
        }
        this.currentToken = this.lexer.next();
    }
}
