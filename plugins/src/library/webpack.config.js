let path = require('path');

const VueLoaderPlugin = require('vue-loader/lib/plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const progressBar = require('progress-bar-webpack-plugin');

module.exports = {
	mode: 'production',
	entry: {
		'suyuanui': './src/index.js',
		'suyuanui.min': './src/index.js'
	},
	externals: {
		'vue': 'Vue',
		'vue-router': 'VueRouter',
		'axios': 'axios',
		'element-ui': 'ELEMENT',
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].js',
		library: 'suyuan',
		libraryTarget: 'umd'
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader']
			},
			{
				test: /\.vue$/,
				use: ['vue-loader']
			},
			{
				test: /\.(png|jpg|jpeg|gif)$/,
				use: [{
					loader: 'url-loader',
					options: {
						limit: 10000,
						name: '[name].[ext]',
						outputPath: 'assets/img',
						publicPath: ''
					}
				}]
			},
			{
				test: /\.js$/,
				use: [{
					loader: 'babel-loader'
				}],
				include: [
					path.resolve(__dirname, 'src')
				],
				exclude: /node_modules/,
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/,
				use: ['url-loader']
			}],
	},
	plugins: [
		new progressBar(),
		new CleanWebpackPlugin(),
		new VueLoaderPlugin()
	]

}
