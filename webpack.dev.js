import {merge} from 'webpack-merge';
import common from './webpack.common.js';

export default merge(common, {
    mode: 'development',
    devtool: 'eval-source-map',
    devServer: {
      watchFiles: ["./client/index.html"],
      open: true, 
    },
    module: {
      rules: [
        {
          test: /\.scss$/i,
          use: [
            'style-loader', 
            'css-loader',
            'postcss-loader',
            'sass-loader'
          ],
        },
      ],
    },
  });