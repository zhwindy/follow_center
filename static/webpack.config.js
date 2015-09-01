module.exports = {
  entry: ['./main.coffee'],
  output: {
    path: "./build",
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      { test: /\.coffee$/, loader: "coffee-loader" },
      { test: /\.less$/, loader: "style!css!less" },
      { test: /\.html$/, loader: "html" }
    ]
  }
}
