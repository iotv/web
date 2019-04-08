import path from 'path'
import webpack from 'webpack'
import {CheckerPlugin} from 'awesome-typescript-loader'
import CleanWebpackPlugin from 'clean-webpack-plugin'
import CopyPlugin from 'copy-webpack-plugin'

const config: webpack.Configuration = {
  mode: 'production',
  entry: './src/handler.ts',
  externals: './build/Release/argon2',
  resolve: {
    extensions: ['.mjs', '.ts', '.tsx', '.js', '.jsx'],
  },

  optimization: {
    // We no not want to minimize our code.
    minimize: false,
  },
  performance: {hints: false},

  // Source maps support ('inline-source-map' also works)
  devtool: 'source-map',

  // Add the loader for .ts files.
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader',
      },
    ],
  },
  plugins: [
    new CheckerPlugin(),
    new CleanWebpackPlugin(),
    new CopyPlugin([
      {
        from: '../../node_modules/argon2/build/Release/argon2.node',
        to: 'build/Release',
      },
    ]),
  ],
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
    libraryTarget: 'commonjs2',
  },
}

export default config
