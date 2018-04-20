// Declare valid token type in tscalc.
export enum Type {
    EOF, // End of File.
    Integer,
    Float,
    TNaN,      // NaN in JavaScript.
    TInfinity, // Infinity in JavaScript.
    Add,  // +
    Sub,  // -
    Mul,  // *
    Div,  // /
    Mod,  // %
    Pow,  // **
    LeftParen,   // (
    RightParen,  // )
    Builtin,  // Builtin math functions
    TPI,  // PI in JavaScript.
    TE,   // E (natural number) in JavaScript.
}

// Token holds the information of the token type and string.
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
