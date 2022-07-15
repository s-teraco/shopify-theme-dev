// --------------------------------------------
// Module
// --------------------------------------------
const Webpack = require("webpack");
const Path = require("path");
const globule = require("globule");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const StyleLintPlugin = require("stylelint-webpack-plugin");

// --------------------------------------------
// Settings
// --------------------------------------------
const MODE = process.env.NODE_MODE || "development"; //development:開発, production:本番
const TYPE = process.env.NODE_TYPE || "normal";

const DIR = {
  src: "src",
  dist: "public",
  assets: "assets",
  shopify: "shopify"
}

const EXTENSION_LIST = {
  scss: "css",
  js: "js",
};

const ENTRY = {
  scss: [],
  js: {},
};

// const OUTPUT_DIR = DIR["shopify"];
const OUTPUT_DIR = TYPE === "shopify" ? DIR["shopify"] : DIR["dist"];


console.log("MODE", MODE);
console.log("TYPE", TYPE);
console.log("OUTPUT_DIR", OUTPUT_DIR);


// --------------------------------------------
// SCSS
// --------------------------------------------

// --------------------------------------------
// JS
// --------------------------------------------

// --------------------------------------------
// Module Exports
// --------------------------------------------
const entryPoints = {
  main: [`./${DIR.src}/js/main.js`, `./${DIR.src}/css/common.css`],
};
entryPoints.main[1] = `./${DIR.src}/scss/common.scss`;



module.exports = {
  mode: MODE,
  entry: {
    ...entryPoints,
  },
  output: {
    path: Path.resolve(__dirname, OUTPUT_DIR),
    filename: `./${DIR.assets}/[name].bundle.js`,
    // assetModuleFilename: `${DIR.assets}/img/[name][ext]`,
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
      {
        test: /\.(js|ts|tsx)$/,
        enforce: "pre",
        exclude: /node_modules/,
        loader: "eslint-loader",
        options: {
          fix: true, //autofixモードの有効化
          failOnError: true, //エラー検出時にビルド中断
        },
      },
      {
        test: /\.(css|s[ac]ss)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: "css-loader",
            options: {
              url: false,
              sourceMap: true,
            },
          },
          "postcss-loader",
        ],
      },
      {
        test: /\.s[ac]ss$/,
        enforce: "pre",
        use: ["sass-loader"],
      },
      {
        test: /\.(pug|html)$/,
        use: [
          {
            loader: "html-loader",
            options: {
              sources: false,
            },
          },
        ],
      },
    ],
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: `./${DIR.assets}/common.css`,
    }),
    new CopyPlugin({
      patterns: [
        {
          from: `${DIR.src}/${DIR.assets}/img`,
          to: `${DIR.assets}`,
          noErrorOnMissing: true,
        },
        {
          from: `${DIR.src}/${DIR.assets}/font`,
          to: `${DIR.assets}`,
          noErrorOnMissing: true,
        },
        {
          from: `${DIR.src}/${DIR.assets}/pdf`,
          to: `${DIR.assets}`,
          noErrorOnMissing: true,
        },
        {
          from: `${DIR.src}/${DIR.assets}/media`,
          to: `${DIR.assets}`,
          noErrorOnMissing: true,
        },
        {
          from: "*.txt",
          context: `${DIR.src}/`,
          noErrorOnMissing: true,
        },
        {
          from: "*.json",
          context: `${DIR.src}/`,
          noErrorOnMissing: true,
        },
        {
          from: "*.xml",
          context: `${DIR.src}/`,
          noErrorOnMissing: true,
        },
        {
          from: "*.png",
          context: `${DIR.src}/`,
          noErrorOnMissing: true,
        },
        {
          from: "*.icon",
          context: `${DIR.src}/`,
          noErrorOnMissing: true,
        }
      ],
    }),

    // new StyleLintPlugin({
    //   fix: true, // 自動修正可能なものは修正
    //   // failOnError: true, //エラー検出時にビルド中断
    // }),
  ],
  resolve: {
    extensions: [".ts", ".js", ".json"],
  },
  // ES5(IE11等)向けの指定
  target: ["web", "es5"],
};


// module.exports = [];
