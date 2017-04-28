# calculator-ts

An elementary arithmetic intepreter.

## Usage

Run this calculator with RequireJS.

```
<script src="https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.3/require.min.js"></script>
<script src="/js/calc.min.js"></script>
<script>
    define("main", ["interpreter"], function (e) {
        var evaluator = new e.Evaluator("3 + 2");
        console.log(evaluator.run());
    });
    require(["main"]);
</script>
```

Currently, this calculator only supports

- Integer and floating point
- Simple algebra including addition, substration, multiplication, division, 
  modulution, modulus, power.

Some valid expressions:

- `3 * 2`
- `(5 - 2) / (3 + 1)`
- `(8 % 5)**(4 - 1)`

## Intro

This interperter doesn't use JavaScript ``eval`` function; instead, we wrote it from scratch, i.e. lexer, parser, interpreter. This toy interperter is an interpreter exercise; we may or may not add features later.

## Install

Build with Node and TypeScript.

```
$ npm install
$ gulp
```

Copy *dist/calc.min.js* to your own project.

## License

MIT
