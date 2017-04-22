import * as ast from "./ast";
import * as lex from "./lexer";
import * as parse from "./parser";
import * as token from "./token";

export class Evaluator {
    private interpreter: Interpreter;

    constructor(s: string) {
        this.interpreter =
            new Interpreter(new parse.Parser(new lex.Lexer(s)));
    }

    public run = () => {
        return this.interpreter.run();
    }
}

export class Interpreter {
    private parser: parse.Parser;

    constructor(p: parse.Parser) {
        this.parser = p;
    }

    public run = () => {
        const ast = this.parser.next();

        if (ast === null) {
            return null;
        }

        return this.eval(ast);
    }

    private eval = (a: ast.AST) => {
        if (a instanceof ast.BiOpAST) {
            const t = a.token();
            const left = this.eval(a.getLeftChild());
            const right = this.eval(a.getRightChild());

            if (t.token() === token.TokenType.Add) {
                return left + right;
            } else if (t.token() === token.TokenType.Sub) {
                return left - right;
            } else if (t.token() === token.TokenType.Mul) {
                return left * right;
            } else if (t.token() === token.TokenType.Div) {
                return left / right;
            } else if (t.token() === token.TokenType.Mod) {
                return left % right;
            } else if (t.token() === token.TokenType.Pow) {
                return Math.pow(left, right);
            } else {
                throw new Error("Unable to eval due to unknown bi-op");
            }
        } else if (a instanceof ast.UniOpAST) {
            const t = a.token();
            const factor = this.eval(a.getChild());

            if (t.token() === token.TokenType.Add) {
                return factor;
            } else if (t.token() === token.TokenType.Sub) {
                return -factor;
            } else {
                throw new Error("Unable to eval due to unknown uni-op");
            }
        } else if (a instanceof ast.FactorAST) {
            const t = a.token();

            if (t.token() === token.TokenType.Integer) {
                return parseInt(t.value(), 10);
            } else if (t.token() === token.TokenType.Float) {
                return parseFloat(t.value());
            } else {
                throw new Error("Unable to eval due to unknown factor");
            }
        } else {
            throw new Error("Unable to eval due to unknown AST");
        }
    }
}



