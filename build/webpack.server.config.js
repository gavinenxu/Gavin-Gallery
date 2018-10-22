const merge = require('webpack-merge')
const base = require('./webpack.base.config')
const nodeExternals = require('webpack-node-externals')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')
const webpack = require('webpack')

module.exports = merge(base, {
  target: 'node',
  devtool: '#source-map',
  entry: './src/entry-server.js',
  // This tells the server bundle to use Node-style exports
  output: {
    filename: 'server-bundle.js',
    libraryTarget: 'commonjs2'
  },
  // resolve: {
  //   alias: {
  //     'create-api': './create-api-server.js'
  //   }
  // },
  externals: nodeExternals({
    // do not externalize CSS files in case we need to import it from a dep
    whitelist: /\.css$/
  }),
  plugins: [
    // new webpack.DefinePlugin({
    //   'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    //   'process.env.VUE_ENV': '"server"'
    // }),
    new VueSSRServerPlugin()
  ]

})