/*
 * https://webpack.js.org/configuration/
 *
 * If you want to learn more about webpack, their documentation
 * is actually very good and provides a really nice search at
 * the top of their page. Check it out.
 */
const webpack = require('webpack');
const path = require('path');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HappyPack = require('happypack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CssExtractPlugin = require('extract-css-chunks-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const theme = require('./theme');

const { DEBUG, DEVTOOL, NODE_ENV, PORT } = process.env;

const PROD = NODE_ENV === 'production';

const devtool = DEVTOOL || 'source-map';

const serverUrl = `http://localhost:${parseInt(PORT) + 1}`;

const outDir = path.resolve(__dirname, 'dist');

const plugins = [
	/*
	 * Removes the ./dist directory before starting any work
	 */
	new CleanWebpackPlugin({
		cleanOnceBeforeBuildPatterns: [outDir],
	}),

	/*
	 * https://webpack.js.org/plugins/define-plugin/
	 * This adds env variables directly into the build by
	 * replaces references in our code with the variable value.
	 * This enables a zero-cost abstraction where conditions like
	 * if (process.env.NODE_ENV !== 'production') becomes
	 * if ('production' !== 'production') which the minifier can determine
	 * is dead code and actually just remove it entirely.
	 */
	new webpack.DefinePlugin({
		'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
	}),

	/*
	 * Makes the hashes used in the chunk file names more
	 * consistently based on their content so that browser
	 * caching is more effective.
	 */
	PROD &&
		new webpack.HashedModuleIdsPlugin({
			hashFunction: 'sha256',
			hashDigest: 'hex',
			hashDigestLength: 20,
		}),

	/*
	 * Enables hot module replacement, which we only use
	 * for styles right now as I've found react hot loading
	 * to be a little flaky
	 */
	new webpack.HotModuleReplacementPlugin(),

	/*
	 * https://webpack.js.org/plugins/context-replacement-plugin/
	 * By default moment includes all locale files
	 * which bloats the total size. To prevent this
	 * we use this plugin to only load the locales
	 * that we care about. Ideally we could use
	 * webpacks ignore plugin to ignore these imports
	 * from moment and then import them async when
	 * needed, but that seems to be broken on moment's
	 * side.
	 */
	new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en|fr/),

	/*
	 * Makes babel loader cache results and use multiple
	 * cores for a performance increase.
	 */
	new HappyPack({
		loaders: [
			{
				loader: 'babel-loader',
				options: {
					cacheDirectory: !PROD,
					babelrc: true,
				},
			},
		],
	}),

	/*
	 * Enables hot module replacement on css/scss/less files
	 * and pulls them out into their own chunks for better browser
	 * caching
	 */
	new CssExtractPlugin({
		// Options similar to the same options in webpackOptions.output
		// both options are optional
		filename: PROD ? 'mi.[name].[hash].css' : '[name].css',
		chunkFilename: PROD
			? 'mi.[id].[name].[chunkhash].css'
			: '[name].chunk.css',
	}),

	/*
	 * Injects our entry bundle into the body of our index.html
	 */
	new HtmlWebpackPlugin({
		filename: 'index.html',
		template: 'src/index.html',
		favicon: './favicon.ico',
		inject: 'body',
	}),

	/*
	 * Fail builds when there are circular dependencies.
	 * You can make this enabled in production mode only if
	 * it starts to slow down incremental dev builds too much.
	 */
	new CircularDependencyPlugin({
		exclude: /node_modules/,
		failOnError: true,
	}),

	/*
	 * Creates a report of all the bundles made by webpack
	 * to help with bundle strategy.
	 */
	!!DEBUG &&
		new require('webpack-bundle-analyzer').BundleAnalyzerPlugin({
			analyzerMode: 'static',
			reportFilename: 'report-src.html',
		}),

	new CopyPlugin([
		{ from: 'src/static/geojson', to: 'geojson' },
		{ from: 'src/static/mapbox-style', to: 'mapbox-style' },
		{ from: 'src/static/contact-points', to: 'contact-points' },
	]),
];

const cssBaseLoader = [
	CssExtractPlugin.loader,
	'css-loader',
	{
		loader: 'postcss-loader',
		options: {
			config: {
				path: path.resolve(__dirname, 'postcss.config.js'),
			},
		},
	},
];

const webpackConfig = {
	mode: PROD ? 'production' : 'development',
	target: 'web',
	entry: {
		index: './src/index.js',
	},
	output: {
		path: outDir,
		filename: PROD ? 'mi.[name].[hash].js' : '[name].js',
		chunkFilename: PROD
			? 'mi.[id].[name].[chunkhash].chunk.js'
			: '[name].chunk.js',
		publicPath: '/__dist__/',
	},
	stats: {
		children: false,
	},
	devServer: {
		port: PORT,
		stats: 'minimal',
		overlay: true,
		hot: true,
		proxy: [
			{
				context: ['/api', '/health', '/environment'],
				target: serverUrl,
			},
		],
		historyApiFallback: {
			rewrites: [
				{
					from: /./,
					to: '/__dist__/index.html',
				},
			],
		},
	},
	optimization: {
		minimizer: [
			new TerserPlugin({
				terserOptions: {
					parse: {
						// we want terser to parse ecma 8 code. However, we don't want it
						// to apply any minfication steps that turns valid ecma 5 code
						// into invalid ecma 5 code. This is why the 'compress' and 'output'
						// sections only apply transformations that are ecma 5 safe
						// https://github.com/facebook/create-react-app/pull/4234
						ecma: 8,
					},
					compress: {
						ecma: 5,
						warnings: false,
						// Disabled because of an issue with Uglify breaking seemingly valid code:
						// https://github.com/facebook/create-react-app/issues/2376
						// Pending further investigation:
						// https://github.com/mishoo/UglifyJS2/issues/2011
						comparisons: false,
						// Disabled because of an issue with Terser breaking valid code:
						// https://github.com/facebook/create-react-app/issues/5250
						// Pending futher investigation:
						// https://github.com/terser-js/terser/issues/120
						inline: 2,
					},
					mangle: {
						safari10: true,
					},
					output: {
						ecma: 5,
						comments: false,
						// Turned on because emoji and regex is not minified properly using default
						// https://github.com/facebook/create-react-app/issues/2488
						ascii_only: true,
					},
				},
				cache: true,
				parallel: true,
				sourceMap: false, // set to true if you want JS source maps
			}),
			new OptimizeCSSAssetsPlugin({}),
		],
		splitChunks: {
			chunks: 'async',
			minSize: 30000,
			maxSize: 1000000,
			minChunks: 1,
			maxAsyncRequests: 8,
			maxInitialRequests: 3,
			automaticNameDelimiter: '-',
			name: false,
			cacheGroups: {
				vendors: {
					chunks: 'async',
					test: /[\\/]node_modules[\\/]/,
					priority: -10,
				},
				default: {
					minChunks: 2,
					priority: -20,
					reuseExistingChunk: true,
				},
			},
		},
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				include: path.join(__dirname, 'src'),
				exclude: [path.resolve(__dirname, 'node_modules')],
				use: 'happypack/loader',
			},
			{
				test: /\.(sa|sc|c)ss$/,
				use: cssBaseLoader.concat([
					{
						loader: 'sass-loader',
						options: {
							includePaths: [path.resolve(__dirname, 'src')],
						},
					},
				]),
			},
			{
				test: /\.less$/,
				use: cssBaseLoader.concat([
					{
						loader: 'less-loader',
						options: {
							modifyVars: theme,
							javascriptEnabled: true,
						},
					},
				]),
			},
			{
				test: /\.(eot|gif|jpg|png|svg|ttf|typeface|woff|woff2|xcf|geojson)$/,
				use: 'file-loader',
			},
		],
	},
	resolve: {
		modules: ['src', 'node_modules'],
	},
	devtool: !PROD ? devtool : undefined,
	plugins: plugins.filter(Boolean),
};

module.exports = webpackConfig;
