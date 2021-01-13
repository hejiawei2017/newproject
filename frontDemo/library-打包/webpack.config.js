let path = require('path');

const VueLoaderPlugin = require('vue-loader/lib/plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const progressBar = require('progress-bar-webpack-plugin');
const htmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
	mode: 'production',
	entry: {
		'suyuanui': process.env.NODE_ENV === 'production' ? './src/index.js' : './src/main.js',
	},
	externals: {
		'vue': 'Vue',
		'vue-router': 'VueRouter',
		'axios': 'axios',
		'element-ui': 'ELEMENT',
	},
	resolve: {
		//自动补全后缀，注意第一个必须是空字符串,后缀一定以点开头
		extensions: ["", ".js", "vue", ".css", ".json"],
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].js',
		library: 'suyuan',
		libraryTarget: 'umd'
	},
	devServer: {
		contentBase: path.resolve(__dirname, 'dist'),
		host: 'localhost',
		compress: true,
		port: 8080
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader'],
				exclude: /node_modules/
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
			},
			{
				test: /\.(html|html)$/,
				use: 'html-withimg-loader',
				include: path.join(__dirname, './src'),
				exclude: /node_modules/
			}],
	},
	plugins: [
		new htmlWebpackPlugin(
			{
				minify: {
					removeAttributeQuotes: true
				},
				hash: true,
				template: './index.html',
				filename: 'index.html'
			}
		),
		new progressBar(),
		new CleanWebpackPlugin(),
		new VueLoaderPlugin()
	]

}
