import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';

export default{
  entry: "./client/src/js/index.js",
  output: {
    filename: "main.js",
    path: path.resolve(process.cwd(), 'dist'),
    clean: true,
  },
  
  plugins: [
    new HtmlWebpackPlugin({
      template: "./client/index.html",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(woff|woff2)$/i,
        type: 'asset/resource',  
        generator: {
          filename: 'fonts/[name][hash][ext][query]' 
        }
      },
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
      {
        test: /\.(png|svg|jpg|jpeg)$/i,
        type: "asset/resource",
        generator: {
          filename: 'img/[name][hash][ext][query]' 
        }
      },
    ],
  },

  
};