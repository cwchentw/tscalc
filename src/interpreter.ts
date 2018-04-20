import * as ast from "./ast";
import * as lexer from "./lexer";
import * as parser from "./parser";
import * as token from "./token";

// Evaluator is just a helper class for Interpreter.
export class Evaluator {
    private interpreter: Interpreter;

    constructor(s: string) {
        this.interpreter =
            new Interpreter(new parser.Parser(new lexer.Lexer(s)));
    }

    public run = () => {
        return this.interpreter.run();
    }
}

// Interpreter consumes a Parser, running the program on-the-fly.
export class Interpreter {
    private parser: parser.Parser;

    constructor(p: parser.Parser) {
        this.parser = p;
    }

    public run = () => {
        // This interpreter receives only one AST.
        const ast = this.parser.next();

        if (ast === null) {
            return null;
        }

        /*  Walk through the AST and runs it on-the-fly, 
            namely a tree-walking interpreter. */
        return this.eval(ast);
    }

    // eval consumes a AST and runs it.
    private eval = (a: ast.AST) => {
        if (a instanceof ast.BiOpAST) {
            // Get current token.
            const t = a.token();
            // Recursively call and eval child ASTs.
            const left = this.eval(a.getLeftChild());
            const right = this.eval(a.getRightChild());

            /*  This interpreter utilizes underlying JavaScript runtime
                to run the program. */
            if (t.token() === token.Type.Add) {
                return left + right;
            } else if (t.token() === token.Type.Sub) {
                return left - right;
            } else if (t.token() === token.Type.Mul) {
                return left * right;
            } else if (t.token() === token.Type.Div) {
                return left / right;
            } else if (t.token() === token.Type.Mod) {
                return left % right;
            } else if (t.token() === token.Type.Pow) {
                return Math.pow(left, right);
            } else {
                throw new Error("Unable to eval unknown bi-op AST");
            }
        } else if (a instanceof ast.UniOpAST) {
            // Get current token.
            const t = a.token();
            // Recursively call and eval the child AST.
            const factor = this.eval(a.getChild());
            
            /*  This interpreter utilizes underlying JavaScript runtime
                to run the program. */
            if (t.token() === token.Type.Add) {
                return factor;
            } else if (t.token() === token.Type.Sub) {
                return -factor;
            } else {
                throw new Error("Unable to eval unknown uni-op AST");
            }
        } else if (a instanceof ast.FactorAST) {
            // Get current token.
            const t = a.token();

            /*  This interpreter utilizes underlying JavaScript runtime
                to run the program. */
            if (t.token() === token.Type.Integer) {
                return parseInt(t.value(), 10);
            } else if (t.token() === token.Type.Float) {
                return parseFloat(t.value());
            } else if (t.token() === token.Type.TNaN) {
                return NaN;
            } else if (t.token() === token.Type.TInfinity) {
                return Infinity;
            } else if (t.token() === token.Type.TPI) {
                return Math.PI;
            } else if (t.token() === token.Type.TE) {
                return Math.E;
            } else {
                throw new Error("Unable to eval unknown factor");
            }
        } else {
            throw new Error("Unable to eval unknown AST");
        }
    }
}