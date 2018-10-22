const path = require('path')
const merge = require('webpack-merge')
const base = require('./webpack.base.config')

const config = merge(base, {
  entry: {
    app: ''
  },

})

module.exports = config