var path = require("path");
module.exports = {
  entry: {
        main: "./main.coffee",
        users: "./users.coffee"
  	},
  output: {
  		path: path.join(__dirname, "build"),
  		filename: "[name].bundle.js",
  		chunkFilename: "[id].chunk.js"
  	},
  module: {
    loaders: [
      { test: /\.coffee$/, loader: "coffee-loader" },
      { test: /\.less$/, loader: "style!css!less" },
      { test: /\.(html|tpl)$/, loader: "html" },
      { test: /\.css$/, loader: "style!css" },
      {
          test: /\.(jpe?g|png|gif|svg)$/i,
          loaders: [
              'file?hash=sha512&digest=hex&name=[hash].[ext]',
              'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
          ]
      },
    ]
  },
  resolve: {
    extensions: ["", ".web.coffee", ".web.js", ".coffee", ".js"]
  }
}
