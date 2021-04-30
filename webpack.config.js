const webpack = require('webpack');
const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const buildHTML = process.env.USE_HTML && process.env.USE_HTML.toLowerCase() === "true" ? true : false;
const mode = process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase() === "production" ? "production" : "development";
const useAnalyzer = (process.env.USE_ANALYZER && process.env.USE_ANALYZER.toLowerCase() == "true") === true;
const appTitle = require("./package.json").description;
const appName = require("./package.json").name;
const version = require("./package.json").version;
const output_filename = `${appName}.js`;
const isProduction = mode === "production";
const plugins = [];
let devtool = "source-map";
const entries = [];

plugins.push(new ESLintPlugin({
  fix: true,
  exclude: "node_modules",
  context: "src",
  extensions: ["js", "jsx"]
}));

if (useAnalyzer === true) {
  plugins.push(new BundleAnalyzerPlugin());
}

if (isProduction) {
  // Include Bundle Analyzer On Prod Build
  plugins.push(new MiniCssExtractPlugin({
    filename: `${appName}.main.min.css`,
    ignoreOrder: false
  }));
} else if (mode === "development") {
  devtool = "inline-source-map";

  plugins.push(new MiniCssExtractPlugin({
    filename: `${appName}.main.min.css`,
    ignoreOrder: false
  }));
}

if (buildHTML) {
  plugins.push(new HtmlWebpackPlugin({
    title: appTitle,
    template: "index.html"
  }));
}


module.exports = {
  mode: mode,
  entry: entries.concat(['./src/index.js']),
  output: {
    path: path.resolve(__dirname, 'dist/v'+version +'/'),
    filename: output_filename
  },
  devtool: devtool,
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        // exclude: /node_modules/,
        exclude: /node_modules\/(?!(slide-ui.*)\/).*/,
        use: ['babel-loader']
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      { 
        test: /\.less$/, // .less and .css
        use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                plugins: () => [
                  require('autoprefixer')({
                    'overrideBrowserslist': ['last 2 versions']
                  }),
                  require('cssnano')({
                    preset: 'default',
                  })
                ],
              }
            },
            'less-loader'
        ],
      },
      {
        test: /\.(ttf|eot|woff|woff2|jpg|jpeg|png|gif|mp3|svg)$/,
        use: ['file-loader']
      }
    ]
  },
  plugins: plugins
};
