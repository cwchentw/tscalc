import * as lex from '../src/lexer';
import * as parse from '../src/parser';
import * as e from '../src/interpreter';
import { assert } from "chai";

describe("Interpreter", () => {
    describe("Eval single elements", () => {
        it("Empty string", () => {
            var evaluator = new e.Evaluator("");
            var result = evaluator.run();
            assert.equal(result, null);
        });
        
        it("Space", () => {
            var evaluator = new e.Evaluator(" ");
            var result = evaluator.run();
            assert.equal(result, null);
        });
        
        it("Integer", () => {
            var evaluator = new e.Evaluator("12345");
            var result = evaluator.run();
            assert.equal(result, 12345);
        });
        
        it("Float", () => {
            var evaluator = new e.Evaluator("12.345");
            var result = evaluator.run();
            assert(Math.abs(result - 12.345) < 0.000001);
        });
        
        it("NaN", () => {
            var evaluator = new e.Evaluator("NaN");
            var result = evaluator.run();
            assert.equal(isNaN(result), true);
        });

        it("Infinity", () => {
            var evaluator = new e.Evaluator("Infinity");
            var result = evaluator.run();
            assert.equal(isFinite(result), false);
        });
    });
    
    describe("Eval expressions", () => {
        it("1 + 2", () => {
            var evaluator = new e.Evaluator("1 + 2");
            var result = evaluator.run();
            assert.equal(result, 3);
        });
        
        it("3 + Infinity", () => {
            var evaluator = new e.Evaluator("3 + Infinity");
            var result = evaluator.run();
            assert.equal(isFinite(result), false);
        });
        
        it("3 + NaN", () => {
            var evaluator = new e.Evaluator("3 + NaN");
            var result = evaluator.run();
            assert.equal(isNaN(result), true);
        });
        
        it("5 % 3", () => {
            var evaluator = new e.Evaluator("5 % 3");
            var result = evaluator.run();
            assert.equal(result, 2);
        });
        
        it("(4 - 2)**(1 * 2)", () => {
            var evaluator = new e.Evaluator("(4 - 2)**(1 * 2)");
            var result = evaluator.run();
            assert.equal(result, 4);
        });
    });
});