module.exports = {
  entry: "./preview/index.js",
  output: {
    filename: "bundle.js",
    path: __dirname + '/preview',
    publicPath: '/preview/'
  }
};
