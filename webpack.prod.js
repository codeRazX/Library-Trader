import {merge} from 'webpack-merge';
import common from './webpack.common.js';
import MiniCssExtractPlugin  from 'mini-css-extract-plugin';

export default merge(common, {
  mode: 'production',
  devtool: "source-map",
  optimization: {
    minimize: true,
  },
  plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css',
      }),
    ],
  module: {
    rules: [
      {
        test: /\.scss$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader","postcss-loader", "sass-loader"],
      },
    ],
  },
});