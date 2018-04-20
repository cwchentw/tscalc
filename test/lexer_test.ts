import * as token from '../src/token';
import * as lex from '../src/lexer';
import { assert } from "chai";

describe("Lexer", () => {
    describe("Lex single elements", () => {
        it("Empty string", () => {
            var lexer = new lex.Lexer("");
            
            var t = lexer.next();
            assert.equal(t.token(), token.Type.EOF);
            assert.equal(t.value(), "EOF");
        });
        
        it("Integer", () => {
            var lexer = new lex.Lexer("12345");
            
            var t = lexer.next();
            assert.equal(t.token(), token.Type.Integer);
            assert.equal(t.value(), "12345");
        });
        
        it("Float", () => {
            var lexer = new lex.Lexer("12.345");
            
            var t = lexer.next();
            assert.equal(t.token(), token.Type.Float);
            assert.equal(t.value(), "12.345");
        });
        
        it("NaN", () => {
            var lexer = new lex.Lexer("NaN");
            
            var t = lexer.next();
            assert.equal(t.token(), token.Type.TNaN);
            assert.equal(t.value(), "NaN");
        });
        
        it("Infinity", () => {
            var lexer = new lex.Lexer("Infinity");
            
            var t = lexer.next();
            assert.equal(t.token(), token.Type.TInfinity);
            assert.equal(t.value(), "Infinity");
        });
        
        it("PI", () => {
            var lexer = new lex.Lexer("PI");
            
            var t = lexer.next();
            assert.equal(t.token(), token.Type.TPI);
            assert.equal(t.value(), "PI");
        });
        
        it("E", () => {
            var lexer = new lex.Lexer("E");
            
            var t = lexer.next();
            assert.equal(t.token(), token.Type.TE);
            assert.equal(t.value(), "E");
        });
        
        it("Add", () => {
            var lexer = new lex.Lexer("+");
            
            var t = lexer.next();
            assert.equal(t.token(), token.Type.Add);
            assert.equal(t.value(), "+");            
        });
        
        it("Sub", () => {
            var lexer = new lex.Lexer("-");
            
            var t = lexer.next();
            assert.equal(t.token(), token.Type.Sub);
            assert.equal(t.value(), "-");            
        });

        it("Mul", () => {
            var lexer = new lex.Lexer("*");
            var t = lexer.next();
            
            assert.equal(t.token(), token.Type.Mul);
            assert.equal(t.value(), "*");            
        });
        
        it("Div", () => {
            var lexer = new lex.Lexer("/");
            var t = lexer.next();
            
            assert.equal(t.token(), token.Type.Div);
            assert.equal(t.value(), "/");            
        });
        
        it("Mod", () => {
            var lexer = new lex.Lexer("%");
            var t = lexer.next();
            
            assert.equal(t.token(), token.Type.Mod);
            assert.equal(t.value(), "%");            
        });
        
        it("Pow", () => {
            var lexer = new lex.Lexer("**");
            var t = lexer.next();
            
            assert.equal(t.token(), token.Type.Pow);
            assert.equal(t.value(), "**");            
        });
        
        it("Left Paran", () => {
            var lexer = new lex.Lexer("(");
            var t = lexer.next();
            
            assert.equal(t.token(), token.Type.LeftParen);
            assert.equal(t.value(), "(");            
        });
        
        it("Right Paran", () => {
            var lexer = new lex.Lexer(")");
            var t = lexer.next();
            
            assert.equal(t.token(), token.Type.RightParen);
            assert.equal(t.value(), ")");            
        });
    });
    
    describe("Lex expressions", () => {
        it("12 + 34", () => {
            var lexer = new lex.Lexer("12 + 34");
            
            var t = lexer.next();
            assert.equal(t.value(), "12");
            
            t = lexer.next();
            assert.equal(t.value(), "+");
            
            t = lexer.next();
            assert.equal(t.value(), "34");
        });
        
        it("NaN + Infinity", () => {
            var lexer = new lex.Lexer("NaN + Infinity");
            
            var t = lexer.next();
            assert.equal(t.value(), "NaN");

            t = lexer.next();
            assert.equal(t.value(), "+");
            
            t = lexer.next();
            assert.equal(t.value(), "Infinity");
        });
        
        it("2 * PI * 5", () => {
            var lexer = new lex.Lexer("2 * PI * 10.2");
            
            var t = lexer.next();
            assert.equal(t.value(), "2");
            
            t = lexer.next();
            assert.equal(t.value(), "*");
            
            t = lexer.next();
            assert.equal(t.value(), "PI");
            
            t = lexer.next();
            assert.equal(t.value(), "*");
            
            t = lexer.next();
            assert.equal(t.value(), "10.2");
        });
        
        it("(5 % 3)**(4 - 2)", () => {
            var lexer = new lex.Lexer("(5 % 3)**(4 - 2)");
            
            var t = lexer.next();
            assert.equal(t.value(), "(");
            
            t = lexer.next();
            assert.equal(t.value(), "5");
            
            t = lexer.next();
            assert.equal(t.value(), "%");
            
            t = lexer.next();
            assert.equal(t.value(), "3");
            
            t = lexer.next();
            assert.equal(t.value(), ")");
            
            t = lexer.next();
            assert.equal(t.value(), "**");
            
            t = lexer.next();
            assert.equal(t.value(), "(");
            
            t = lexer.next();
            assert.equal(t.value(), "4");
            
            t = lexer.next();
            assert.equal(t.value(), "-");
            
            t = lexer.next();
            assert.equal(t.value(), "2");
            
            t = lexer.next();
            assert.equal(t.value(), ")");
        });
    });
});
