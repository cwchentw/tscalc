const webpack = require('webpack');

module.exports = {
    entry: "./src/interpreter.ts",
    output: {
        filename: "calc.min.js",
        path: __dirname + '/dist',
        library: "calc",
        libraryTarget: "umd"

    },
    resolve: {
        // Add '.ts' and '.tsx' as a resolvable extension.
        extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    },
    module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            { test: /\.tsx?$/, loader: "awesome-typescript-loader" }
        ]
    },
    plugins: [
        //new webpack.optimize.UglifyJsPlugin([])
    ]
}