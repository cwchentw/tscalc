export enum TokenType {
    EOF,
    Integer,
    Float,
    Add, // +
    Sub, // -
    Mul, // *
    Div, // /
    Mod, // %
    Pow, // **
    LeftParen,  // (
    RightParen, // )
}

export class Token {
    private t: TokenType;
    private str: string;
    constructor(t: TokenType, s: string) {
        this.t = t;
        this.str = s;
    }

    public token = () => {
        return this.t;
    }

    public value = () => {
        return this.str;
    }
}
