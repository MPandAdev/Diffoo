/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable no-undef */
const path = require('path');

module.exports = {
  entry: './src/index.ts',
  devtool: 'source-map',
  mode: 'production',
  module: {
    rules: [ 
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      // {
      //   test: /\.js$/,
      //   use: ['source-map-loader'],
      //   enforce: 'pre',
      // },
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias:{
      '@': path.resolve(__dirname,'src')
    }
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'), 
    libraryTarget: 'umd', // 或者 'esm'
    globalObject: 'this',
    umdNamedDefine: true, // 如果使用 umd
  }
};
