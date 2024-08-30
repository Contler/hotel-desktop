const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');

module.exports = (env, argv) => {
  const isDevelopment = argv.mode === 'development';

  return [{
    mode: isDevelopment ? 'development' : 'production',
    entry: './electron/main.ts',
    target: 'electron-main',
    devtool: isDevelopment ? 'source-map' : false,
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'dist-electron'),
    },
    resolve: {
      extensions: ['.ts', '.js']
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: {
            loader: 'ts-loader',
            options: {
              configFile: 'tsconfig.serve.json'
            }
          },
          exclude: /node_modules/,
        }
      ]
    },
    optimization: {
      minimize: !isDevelopment,
      runtimeChunk: 'single',
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            chunks: 'all',
          },
        },
      },
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(argv.mode),
      }),
    ],
  },
  {
    mode: isDevelopment ? 'development' : 'production',
    entry: './electron/preload.ts',
    target: 'electron-preload',
    devtool: isDevelopment ? 'source-map' : false,
    output: {
      filename: 'preload.js',
      path: path.resolve(__dirname, 'dist-electron'),
    },
    resolve: {
      extensions: ['.ts', '.js']
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: {
            loader: 'ts-loader',
            options: {
              configFile: 'tsconfig.serve.json'
            }
          },
          exclude: /node_modules/,
        }
      ]
    },
    plugins: [
      new CleanWebpackPlugin(),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(argv.mode),
      }),
    ],
  }
  ]
};
