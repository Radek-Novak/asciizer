var path = require('path');

var webpack = require('webpack');
// var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('shared.js');

module.exports = {
  context: path.resolve('js'),
  entry: ["./asciizer-browser"],
  devtool: 'source-map',
  output: {
    path: path.resolve('dist/'),
    filename: "asciizer.min.js",
    library: 'asciizer',
    libraryTarget: 'var'
  },

  plugins: [
      // new webpack.ProvidePlugin({
      //   $: "jquery",
      //   jQuery: "jquery",
      //   "window.jQuery": "jquery"
      // })
      new webpack.optimize.UglifyJsPlugin({minimize: true})
      // new webpack.BannerPlugin("###### BANNER ######")
  ],

  module: {
    // preloaders: [
    //   {
    //     test: /\.js$/,
    //     exclude: /node_modules/,
    //     loader: 'jshint-loader'
    //   }
    // ],
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        query: {
          presets: ['es2015']
        }
      }
    ]
  },

  resolve: {
    extensions: ['', '.js']
  }
}
