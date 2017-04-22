import * as lex from "./lexer";
import * as token from "./token";

export abstract class AST {
    protected t: token.Token;
    protected children: AST[];

    public token = () => {
        return this.t;
    }

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

export class FactorAST extends AST {
    protected t: token.Token;
    protected children: AST[];

    public constructor(t: token.Token) {
        super();
        this.t = t;
        this.children = [];
    }
}

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
