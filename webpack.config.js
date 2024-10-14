const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
	entry: "./src/browser/index.tsx",
	plugins: [new MiniCssExtractPlugin()],
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
			},
			{
				test: /\.scss$/i,
				use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
			},
			{
				test: /\.(png|jp(e*)g|svg|gif)$/,
				type: "asset/resource",
			},
			{
				test: /\.(woff(2)?|ttf|eot)$/,
				type: "asset/resource",
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