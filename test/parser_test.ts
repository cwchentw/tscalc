import * as lex from '../src/lexer';
import * as parse from '../src/parser';
import { assert } from "chai";

describe("Parser", () => {
    describe("Parse single elements", () => {
        it("Empty string", () => {
            var parser = new parse.Parser(new lex.Lexer(""));
            
            var ast = parser.next();
            assert.equal(ast, null);
        });
        
        it("Space", () => {
            var parser = new parse.Parser(new lex.Lexer(" "));
            
            var ast = parser.next();
            assert.equal(ast, null);
        });
        
        it("Integer", () => {
            var parser = new parse.Parser(new lex.Lexer("12345"));
            
            var ast = parser.next();
            assert.equal(ast.toString(), "12345");
        });
        
        it("Float", () => {
            var parser = new parse.Parser(new lex.Lexer("12.345"));
            
            var ast = parser.next();
            assert.equal(ast.toString(), "12.345");
        });
    });
    
    describe("Parse expressions", () => {
        it("+3", () => {
            var parser = new parse.Parser(new lex.Lexer("+3"));
            
            var ast = parser.next();
            assert.equal(ast.toString(), "(+ 3)");
        });
        
        it("-59", () => {
            var parser = new parse.Parser(new lex.Lexer("-59"));
            
            var ast = parser.next();
            assert.equal(ast.toString(), "(- 59)");
        });
        
        it("3 + 4", () => {
            var parser = new parse.Parser(new lex.Lexer("3 + 4"));
            
            var ast = parser.next();
            assert.equal(ast.toString(), "(+ 3 4)");
        });
        
        it("(5 % 3) / (4 - 1)", () => {
            var parser = new parse.Parser(new lex.Lexer("(5 % 3) / (4 - 1)"));
            
            var ast = parser.next();
            assert.equal(ast.toString(), "(/ (% 5 3) (- 4 1))");
        });
    });
});