const TerserJSPlugin = require('terser-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin');

const config = (env, argv) => {
    let result = {
        mode: "production",
        entry: {
            "index": "./src/index.tsx",
        },
        output: {
            filename: "[name]_bundle.js",
            path: __dirname + "/dist"
        },
        resolve: {
            // Add '.ts' and '.tsx' as resolvable extensions.
            extensions: [".ts", ".tsx", ".js", ".json"]
        },

        module: {
            rules: [
                // All '.tsx' files will be processed by ts-loader
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                },

                // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
                { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },

                // CSS
                {
                    test: /\.less$/,
                    use: [{
                        loader: "style-loader" // creates style nodes from JS strings
                    }, {
                        loader: "css-loader" // translates CSS into CommonJS
                    }, {
                        loader: "less-loader" // compiles Less to CSS
                    }]
                },

                // Images
                {
                    test: /\.(svg|png)$/,
                    use: [
                        'file-loader'
                    ],
                },
            ]
        },
        plugins: [
            new TerserJSPlugin({
                parallel: true
            })
        ],
    }

    if (env.compilationMode === "dev") {
        console.log("**** Development mode activated ****");
        // Enable sourcemaps for debugging webpack's output.
        result.devtool = "source-map";
        result.mode = "development";

        // We dont want development code to be minified, so we overwrite that array.
        result.plugins = [];
    } else {
        console.log("**** Production mode activated ****");
    }

    result.plugins.push(
        new CopyPlugin({
            patterns: [
                { from: 'index.html', to: 'index.html' },
            ],
        }),
    )

    return result;
};

module.exports = config;