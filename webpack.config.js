var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var fs = require('fs');

var clientConfig = {
  entry: {
    'client':    './client/client.ts',
    'vendor':    './client/vendor.ts',
    'polyfills': './client/polyfills.ts'
  },
  target: 'web',
  output: {
    path: './public',
    filename: '[name].js',
    chunkFilename: '[id].chunk.js'
  },
  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.js']
  },
  module: {
    loaders: [
      { test: /\.ts$/,   loader: 'ts-loader' },
      { test: /\.png$/,  loader: 'file?name=assets/[name].[hash].[ext]' },
      { test: /\.html$/, loader: 'html' }
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: ['client', 'vendor', 'polyfills']
    }),

    new HtmlWebpackPlugin({
      template: 'client/index.html'
    })
  ]
};

// forces all node modules to be treated as externals
// borrowed from http://jlongster.com/Backend-Apps-with-Webpack--Part-I
var nodeModules = {};
fs.readdirSync('node_modules').filter(function(x) {
  return ['.bin'].indexOf(x) === -1;
})
.forEach(function(mod) {
  nodeModules[mod] = 'commonjs ' + mod;
});

var serverConfig = {
  entry: {
    'server': './server.ts'
  },
  target: 'node',
  output: {
    path: '.',
    filename: '[name].js',
    chunkFilename: '[id].chunk.js'
  },
  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.js']
  },
  module: {
    loaders: [ { test: /\.ts$/,   loader: 'ts-loader' } ]
  },
  externals: nodeModules
}

module.exports = [ clientConfig, serverConfig ];
