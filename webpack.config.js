const path = require('path');
const No1WebpackPlugin = require('./plugins/no1-webpack-plugins');
const No2WebpackPlugin = require('./plugins/no2-webpack-plugins')

module.exports = {
  entry: './src/index.js',
  mode: 'development',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['loader1.js']
      }
    ]
  },
  plugins: [
    // new No1WebpackPlugin({ msg: 'it is ok~' }),
    new No2WebpackPlugin({ msg: 'ooooooook' })
  ]
}