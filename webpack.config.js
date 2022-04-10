import path from "path";
import { fileURLToPath } from "url";

import DashboardPlugin from "webpack-dashboard/plugin/index.js";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin/lib/index.js";

import VersionUpdater from "./plugins/version-updater.js";

import webpack from "webpack";

export default (env) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const plugins = [];

  const applyDashboard = (isDashboard) => {
    if (isDashboard) return plugins.push(new DashboardPlugin({ port: 3001 }));
    plugins.push(new webpack.ProgressPlugin({ activeModules: true }));
  }

  applyDashboard(env.dashboard);

  return {
    entry: "./src/index.tsx",
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /(node_modules|bower_components)/,
          use: "babel-loader",
        },
        {
          test: /\.(ts|tsx)$/,
          exclude: /(node_modules|bower_components)/,
          use: "babel-loader",
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"]
        },
        {
          test: /\.s[ac]ss$/i,
          use: ["style-loader", "css-loader", "sass-loader"]
        },
        {
          test: /\.svg$/,
          use: ['@svgr/webpack', 'url-loader'],
        }
      ]
    },
    resolve: { extensions: [".tsx", ".ts", ".js", "..."] },
    output: {
      path: path.resolve(__dirname, "dist/"),
      publicPath: "/dist/",
      filename: "bundle.js"
    },
    devServer: {
      port: 3000,
    },
    plugins: [ new ForkTsCheckerWebpackPlugin(
      {
        typescript: {
          diagnosticOptions: {
            semantic: true,
            syntactic: true,
          },
          mode: "write-references",
        },
        async: false
      }
    ), new VersionUpdater(env.versionUpdate), ...plugins]
  }
}
