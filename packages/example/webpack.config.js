const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = (env) => {
  const isProduction = env.production;
  const outputPath = path.resolve(
    __dirname,
    isProduction ? '../server/public' : 'dist',
  );

  console.log(
    `Running in ${
      isProduction ? 'production' : 'development'
    } mode, output directed to ${outputPath}.`,
  );

  return {
    mode: isProduction ? 'production' : 'development',
    entry: './src/app.ts',
    devtool: isProduction ? 'source-map' : 'inline-source-map',
    devServer: {
      port: 3344,
      contentBase: './dist',
    },
    plugins: [
      new Dotenv(),
      new HtmlWebpackPlugin({
        title: 'SVG Spider Chart',
        favicon: './src/favicon.ico',
        meta: { viewport: 'width=device-width, initial-scale=1' },
      }),
      new HtmlWebpackTagsPlugin({
        metas: [
          {
            attributes: { property: 'og:title', content: 'SVG Spider Chart' },
          },
          {
            attributes: {
              property: 'og:description',
              content:
                "SVG-based spider chart, a.k.a. radar chart, heavily inspired by [Derhuerst's version](https://github.com/derhuerst/svg-radar-chart).",
            },
          },
          {
            attributes: {
              property: 'og:url',
              content: 'https://erikvullings.github.io/svg-spider-chart',
            },
          },
          {
            path: './src/assets/logo.svg',
            attributes: {
              property: 'og:image',
            },
          },
          {
            attributes: { property: 'og:locale', content: 'en_UK' },
          },
          {
            attributes: {
              property: 'og:site_name',
              content: 'SVG Spider Chart',
            },
          },
          {
            attributes: {
              property: 'og:image:alt',
              content: 'SVG Spider Chart',
            },
          },
          {
            attributes: {
              property: 'og:image:type',
              content: 'image/svg',
            },
          },
          {
            attributes: {
              property: 'og:image:width',
              content: '200',
            },
          },
          {
            attributes: {
              property: 'og:image:height',
              content: '200',
            },
          },
        ],
      }),
      new MiniCssExtractPlugin({
        filename: isProduction ? '[name].[contenthash].css' : '[name].css',
        chunkFilename: isProduction ? '[id].[contenthash].css' : '[id].css',
      }),
    ],
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
        // {
        //   test: /\.(csv|tsv)$/i,
        //   use: ['csv-loader'],
        // },
        // {
        //   test: /\.xml$/i,
        //   use: ['xml-loader'],
        // },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
    optimization: {
      minimizer: [
        // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
        // `...`,
        new CssMinimizerPlugin(),
      ],
    },
    output: {
      filename: 'bundle.js',
      path: outputPath,
    },
  };
};