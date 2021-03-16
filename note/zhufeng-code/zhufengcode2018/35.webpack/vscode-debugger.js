var path = require('path');
// path.resolve('node_modules'), path.resolve(__dirname, 'src', 'loaders')
var webpackPath = path.resolve('../node_modules', 'webpack-cli', 'bin', 'cli.js');
console.log(webpackPath);
require(webpackPath);

