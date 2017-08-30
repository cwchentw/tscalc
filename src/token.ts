export enum Type {
    EOF,
    Integer,
    Float,
    TNaN,
    TInfinity,
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
    private t: Type;
    private str: string;
    constructor(t: Type, s: string) {
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
