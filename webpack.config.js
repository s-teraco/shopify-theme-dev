// --------------------------------------------
// Module
// --------------------------------------------
const Webpack = require("webpack");
const Path = require("path");
const globule = require("globule");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ESLintPlugin = require("stylelint-webpack-plugin");
// const CopyPlugin = require("copy-webpack-plugin");

// --------------------------------------------
// Settings
// --------------------------------------------
const MODE = process.env.NODE_MODE || "development"; //development:開発, production:本番
const TYPE = process.env.NODE_TYPE || "normal";

const DIR = {
  src: Path.join(__dirname, "src"),
  dist: Path.join(__dirname, "public"),
  shopify: Path.join(__dirname, "shopify"),
  assets: "assets",
}

const SETTINGS = {
  pug: true,
  sass: true,
  ts: false,
  php: false,
};

const EXTENSION_LIST = {
  html: "html",
  pug: "html",
  scss: "css",
  js: "js",
  // ts: "js",
};

const ENTRY = {
  scss: [],
  ts: {},
  pug: {}
};

// const OUTPUT_DIR = DIR["shopify"];
const OUTPUT_DIR = TYPE === "shopify" ? DIR["shopify"] : DIR["dist"];


console.log("MODE", MODE);
console.log("TYPE", TYPE);
console.log("OUTPUT_DIR", OUTPUT_DIR);



// --------------------------------------------
// SCSS
// --------------------------------------------
const scssLoader = [
  MiniCssExtractPlugin.loader,
  {
    loader: "css-loader",
    options: {
      url: false,
      sourceMap : MODE == "production" ? false: true,
    }
  },
  {
    loader: "postcss-loader",
    options: {
      sourceMap: MODE === "production" ? false : true,
    },
  },
  {
    loader: "sass-loader",
    options: {
      implementation: require("sass"),
      sassOptions: {
        indentWidth: 2,
        fiber: false,
        // outputStyle: 'compressed',
      },
      sourceMap: MODE === "production" ? false : true,
    },
  },
];

const scssConfig = ()=>{
  ENTRY["scss"].map((data)=>{
    const config = {
      mode: MODE,
      entry: data.scss,
      output: {
        path: `${OUTPUT_DIR}/${DIR.assets}` ,
      },
      module: {
        rules: [
          {
            test: /\.scss$/,
            exclude: /node_modules/,
            use: scssLoader,
          },
        ],
      },
      plugins: [
        // new FixStyleOnlyEntriesPlugin(),
        new MiniCssExtractPlugin({
          filename: data.css,
        }),
      ],
    };
    module.exports.push(config);
  });
};


// --------------------------------------------
// pug
// --------------------------------------------

// pug loader
const pugLoader = [
  {
    loader: "pug-html-loader",
    options: {
      pretty: true,
    },
  },
];
// pug config
const pugConfig = {
  mode: "development",
  entry: ENTRY["pug"],
  output: {
    filename: "[name]",
    publicPath: "/",
    path: OUTPUT_DIR,
  },
  module: {
    rules: [
      {
        test: /\.(pug|html)$/,
        enforce: "pre",
        use: [
          {
            loader: "html-loader",
            options: {
              sources: false,
            },
          },
        ],
      },
      {
        test: /\.pug$/,
        enforce: "pre",
        exclude: /node_modules/,
        use: pugLoader,
      },
    ],
  },
  plugins: [],
  cache: true,
};

// --------------------------------------------
// TS / JS
// --------------------------------------------
const tsRules  = [
  {
    test: /\.(ts|tsx)$/,
    exclude: /node_modules/,
    loader: "ts-loader",
  },
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
      // failOnError: true, //エラー検出時にビルド中断
    },
  },
];

const tsConfig = {
  mode: MODE,
  target: ["web", "es5"],
  entry: ENTRY["ts"],
  output: {
    filename: "[name]",
    // publicPath: "/",
    // path: OUTPUT_DIR,
    path: `${OUTPUT_DIR}/${DIR.assets}` ,
  },
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx"],
  },
  module: {
    rules: tsRules,
  },
  plugins: [
    // new Webpack.optimize.AggressiveMergingPlugin(),
    new ESLintPlugin({
      extensions: [".ts"],
      fix: true,
    }),
  ],
};
// if (MODE === "development") tsConfig.devtool = "eval-source-map";


// --------------------------------------------
// File List
// --------------------------------------------
Object.keys(EXTENSION_LIST).forEach((from)=>{
  const to = EXTENSION_LIST[from];
  const filelist = globule.find(
    [`**/*.${from}`, `!**/_*.${from}`, `!**/_**/**/*.${from}`],
    { cwd: DIR["src"] }
  );

  filelist.forEach((filename)=>{
    let output = filename.replace(new RegExp(`.${from}$`, "i"), `.${to}`);
    const source = Path.join(DIR["src"], filename);

    // pug - html
    if (output.indexOf(".html") !== -1) {
      output =  output.replace("pug/", "");
      ENTRY["pug"][output] = source;
      pugConfig.plugins.push(
        new HtmlWebpackPlugin({
          filename: output,
          template: source,
          minify: false,
        })
      );
    }

    // scss - css
    if (output.indexOf(".css") !== -1) {
      if(TYPE === "shopify"){
        output = output.replace("scss/", "");
      }else{
        output = output.replace("scss/", "css/");
      }
      ENTRY["scss"].push({
        scss: source,
        css: output,
      });
    }

    // ts - js
    if (output.indexOf(".js") !== -1) {
      if(TYPE === "shopify"){
        output = output.replace("ts/", "");
        output = output.replace("js/", "");
      }else{
        output = output.replace("ts/", "js/");
        output = output.replace("js/", "js/");
      }
      ENTRY["ts"][output] = source;
    }
  });

});


// --------------------------------------------
// Module Exports
// --------------------------------------------

module.exports = [];
if(TYPE !== "shopify") module.exports.push(pugConfig);
scssConfig();
module.exports.push(tsConfig);
