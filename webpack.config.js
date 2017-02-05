module.exports = {
  entry: './src/app.js',
  output: {
    filename: 'bundle.js'
  },
  module: {
    rules: [{
      test: /\.(jpg|png|gif|wav|mp3)$/,
      loader: 'file-loader',
      options: {
        name: '[path][name].[hash].[ext]'
      }
    }]
  }
}
