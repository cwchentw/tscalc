import * as lex from "./lexer";
import * as token from "./token";

// AST class represents a abstract syntax tree (AST).
export abstract class AST {
    // t holds the token itself.
    protected t: token.Token;
    // children holds child AST.
    protected children: AST[];

    // The getter to the token in one AST class.
    public token = () => {
        return this.t;
    }

    // toString stringifies AST, only for testing purpose.
    public toString = (): string => {
        let output = "";

        if (this.t === null) {
            return output;
        }

        if (this.children.length === 0) {
            return this.t.value();
        }

        output += "(";
        output += this.t.value();

        for (let i = 0; i < this.children.length; i++) {
            if (this.children[i] != null) {
                output += " ";
                output += this.children[i].toString();
            }
        }

        output += ")";

        return output;
    }
}

// FactorAST holds no child AST, e.g. 3.
export class FactorAST extends AST {
    protected t: token.Token;
    protected children: AST[];

    public constructor(t: token.Token) {
        super();
        this.t = t;
        this.children = [];
    }
}

// UniOpAST holds one operator and one child AST, `e.g. (- 3)`.
export class UniOpAST extends AST {
    protected t: token.Token;
    protected children: AST[];

    public constructor(t: token.Token, child: AST) {
        super();
        this.t = t;
        this.children = [];
        this.children.push(child);
    }

    public getChild = () => {
        return this.children[0];
    }
}

// BiOpAST holds two child ASTs and one operator, e.g. `(+ 3 5)`.
export class BiOpAST extends AST {
    protected t: token.Token;
    protected children: AST[];

    public constructor(t: token.Token, leftChild: AST, rightChild: AST) {
        super();
        this.t = t;
        this.children = [];
        this.children.push(leftChild);
        this.children.push(rightChild);
    }

    public getLeftChild = () => {
        return this.children[0];
    }

    public getRightChild = () => {
        return this.children[1];
    }
}