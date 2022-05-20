import * as path from 'path'
import 'webpack-dev-server'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import AwsSamPlugin from 'aws-sam-webpack-plugin'
import {Configuration} from 'webpack'
const awsSamPlugin = new AwsSamPlugin({vscodeDebug: false})
const config: Configuration = {
  entry: awsSamPlugin.entry(),
  mode: 'production',
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    libraryTarget: 'commonjs2',
    filename: (chunkData) => awsSamPlugin.filename(chunkData),
    path: path.resolve('.'),
  },
  target: 'node',
  devtool: 'source-map',
  plugins: [new ForkTsCheckerWebpackPlugin(), awsSamPlugin],
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  experiments: {
    topLevelAwait: true,
  },
}
export default config
