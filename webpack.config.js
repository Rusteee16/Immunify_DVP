const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

function initCanisterEnv() {
  let localCanisters, prodCanisters;
  try {
    localCanisters = require(path.resolve(
      ".dfx",
      "local",
      "canister_ids.json"
    ));
  } catch (error) {
    console.log("No local canister_ids.json found. Continuing production");
  }
  try {
    prodCanisters = require(path.resolve("canister_ids.json"));
  } catch (error) {
    console.log("No production canister_ids.json found. Continuing with local");
  }

  const network =
    process.env.DFX_NETWORK ||
    (process.env.NODE_ENV === "production" ? "ic" : "local");

  const canisterConfig = network === "local" ? localCanisters : prodCanisters;

  return Object.entries(canisterConfig).reduce((prev, current) => {
    const [canisterName, canisterDetails] = current;
    prev[canisterName.toUpperCase() + "_CANISTER_ID"] =
      canisterDetails[network];
    return prev;
  }, {});
}
const canisterEnvVariables = initCanisterEnv();

const isDevelopment = process.env.NODE_ENV !== "production";

// To create separate dependency graphs for three types of users

const adminDirectory = "admin";
const enterprisesDirectory = "enterprises";
const usersDirectory = "users";

const admin_entry = path.join("src", adminDirectory, "src", "index.html");
const enterprises_entry = path.join("src", enterprisesDirectory, "src", "index.html");
const users_entry = path.join("src", usersDirectory, "src", "index.html");

module.exports = {
  target: "web",
  mode: isDevelopment ? "development" : "production",
  entry: {
    // The admin.entrypoint points to the HTML file for this build, so we need
    // to replace the extension to `.js`.
    admin: path.join(__dirname, admin_entry).replace(/\.html$/, ".jsx"),
    enterprises: path.join(__dirname, enterprises_entry).replace(/\.html$/, ".jsx"),
    users: path.join(__dirname, users_entry).replace(/\.html$/, ".jsx"),
  },
  devtool: isDevelopment ? "source-map" : false,
  optimization: {
    minimize: !isDevelopment,
    minimizer: [new TerserPlugin()],
  },
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx"],
    fallback: {
      assert: require.resolve("assert/"),
      buffer: require.resolve("buffer/"),
      events: require.resolve("events/"),
      stream: require.resolve("stream-browserify/"),
      util: require.resolve("util/"),
    },
  },
  output: {
    filename: "[name].js",
    // filename: (pathData) => {
    //   return pathData.chunk.name === 'main' ? '[name].js' : '[name]/[name].js';
    path: path.join(__dirname, "dist"),
  },

  // Depending in the language or framework you are using for
  // front-end development, add module loaders to the default
  // webpack configuration. For example, if you are using React
  // modules and CSS as described in the "Adding a stylesheet"
  // tutorial, uncomment the following lines:
  module: {
    rules: [
      { test: /\.(ts|tsx|jsx)$/, loader: "ts-loader" },
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      { test: /\.svg$/, use: ["svg-url-loader"] },
      { test: /\.(jpg|png|webp)$/, use: ["url-loader"] },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          'file-loader',
          {
            loader: 'image-webpack-loader',
            options: {
              bypassOnDebug: true, // webpack@1.x
              disable: true, // webpack@2.x and newer
            },
          },
        ],
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      chunks: ['admin'],
      filename: 'admin.html',
      template: path.join(__dirname, admin_entry),
      cache: false,
    }),
    new HtmlWebpackPlugin({
      inject: true,
      chunks: ['enterprises'],
      filename: 'enterprises.html',
      template: path.join(__dirname, enterprises_entry),
      cache: false,
    }),
    new HtmlWebpackPlugin({
      inject: true,
      chunks: ['users'],
      filename: 'users.html',
      template: path.join(__dirname, users_entry),
      cache: false,
    }),
    new webpack.EnvironmentPlugin({
      NODE_ENV: "development",
      ...canisterEnvVariables,
    }),
    new webpack.ProvidePlugin({
      Buffer: [require.resolve("buffer/"), "Buffer"],
      process: require.resolve("process/browser"),
    }),
    new CopyPlugin({
      patterns: [
        {
          from: `src/${adminDirectory}/src/.ic-assets.json*`,
          to: ".ic-assets.json5",
          noErrorOnMissing: true
        },
      ],
    }),
  ],
  // proxy /api to port 4943 during development.
  // if you edit dfx.json to define a project-specific local network, change the port to match.
  devServer: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:4943",
        changeOrigin: true,
        pathRewrite: {
          "^/api": "/api",
        },
      },
    },
    static: [
      {
        directory: path.resolve(__dirname, "src", adminDirectory, "assets"),
      },
      {
        directory: path.resolve(__dirname, "src", enterprisesDirectory, "assets"),
      },
      {
        directory: path.resolve(__dirname, "src", usersDirectory, "assets"),
      },
    ],
    hot: true,
    watchFiles: [path.resolve(__dirname, "src", adminDirectory), path.resolve(__dirname, "src", enterprisesDirectory), path.resolve(__dirname, "src", usersDirectory)],
    liveReload: true,
  },
};
