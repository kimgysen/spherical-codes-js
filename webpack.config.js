const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
	entry: "./src/browser/index.tsx",
	module: {
		rules: [
			// `js` and `jsx` files are parsed using `babel`
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: ["babel-loader"],
			},
			// `ts` and `tsx` files are parsed using `ts-loader`
			{
				test: /\.(ts|tsx)$/,
				loader: "ts-loader"
			},
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader']
			}
		],
	},
	resolve: {
		extensions: ["*", ".js", ".jsx", ".ts", ".tsx"],
	},
	output: {
		path: path.resolve(__dirname, 'output'),
		publicPath: '/',
		filename: 'bundle.js'
	},
	devServer: {
		// hot: false,
		// liveReload: false,
		static: {
			directory: path.join(__dirname, '/'),
			serveIndex: true,
		},
		port: 8080,
		historyApiFallback: true,
	},
}