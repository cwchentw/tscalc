# calculator-ts

An elementary arithmetic intepreter.

## Usage

Run this calculator in a browser:

```
<!DOCTYPE html>
<head>

</head>
<body>
  <script src="/dist/calc.min.js"></script>
  <script>
    var evaluator = new calc.Evaluator("3 + 2");
    console.log(evaluator.run());
  </script>
</body>
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

We implemented a simple web calculator based on this project.  You may follow the app [here](https://github.com/cwchentw/calculator-ts-web).

## Install

Build with Node and TypeScript.

```
$ git clone https://github.com/cwchentw/calculator-ts
$ cd calculator-ts
$ npm install
$ gulp
```

Copy *dist/calc.min.js* to your own project.

## License

MIT
