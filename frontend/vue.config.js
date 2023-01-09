
const MomentLocalesPlugin = require('moment-locales-webpack-plugin')
const path = require('path')
const webpack = require('webpack')

const isServe = process.argv[2] === 'serve';
const isBuild = !isServe;

const isProd = process.env.NODE_ENV === 'production'

// base64 변환 기준 바이트
const base64_limit = isNaN(process.env.BASE64_SIZE_LIMIT) ? 4096 : Number(process.env.BASE64_SIZE_LIMIT)
const useSourceMap = process.env.GENERATE_SOURCEMAP === 'true'
const publicPath = process.env.PUBLIC_URL || '/'
const fileName = isBuild ? 'js/[name].[contenthash:8].js' : 'js/[name].[hash:8].js';

const setAssetsFileName = (name) => {
    return isBuild ? name.replace('hash','contenthash') : name;
}

const config = {
    publicPath: publicPath,
    outputDir: process.env.BUILD_PATH || 'dist',
    productionSourceMap: useSourceMap,

    css: {
        // extract 사용시, HMR 지원하지 않음. 운영에서만 사용
        extract: isProd,
        sourceMap: useSourceMap, // sourcemap
    },
    configureWebpack: {

      entry: {
        app: ['./src/main.js'] // TODO: main.ts로 변경시 삭제 필요.
      },
      output: {
        filename: fileName,
        chunkFilename: fileName,
      },
        resolve: {
            //extensions: ['.js', '.ts'],
            alias: {
                '@': path.join(__dirname, 'src/'),
            },
        },
        devServer: {
            https: process.env.HTTPS === 'true',
            publicPath: '/',
            proxy: process.env.PROXY_URL && {
                '/api': {
                    target: process.env.PROXY_URL,
                    pathRewrite: {'^/api': '/'}
                }
            }
        },
        plugins: [
            new webpack.ProvidePlugin({
                // 전역으로 사용할 라이브러리 세팅
                isMorpheus: [path.resolve(path.join(__dirname, 'src/common/morpheus.native')), 'isMorpheus'],
                //jquery를 화면에서 사용해야 할 경우 아래 주석을 해제
                // $: 'jquery',
                // jquery: 'jquery',
                // 'window.jQuery': 'jquery',
                // jQuery: 'jquery',
                // d3를 화면에서 사용해야 할 경우 아래 주석을 해제
                // d3: 'd3'
            }),
            new MomentLocalesPlugin({
                localesToKeep: ['ko'],
            })
        ],

    },
    chainWebpack: config => {
        // WepbakcHTMLPlugins 코드분할을 위한 chunks 설정
        config.plugin('html').tap(args => {
            args.chunks = ['chunk-vendors', 'chunk-common', 'app']
            return args
        })

        // base64 컨버팅 옵션
        config.module
            .rule('images')
            .use('url-loader')
            .tap(args => {
                if (base64_limit < 1) delete args.limit;
                else args.limit = base64_limit;
                const { options } = args.fallback;
                options.name = setAssetsFileName(options.name);
                return args
            })

        config.module
            .rule('fonts')
            .use('url-loader')
            .tap(args => {
                if (base64_limit < 1) delete args.limit
                else args.limit = base64_limit
                const { options } = args.fallback;
                options.name = setAssetsFileName(options.name);
                return args
            })

        config.module
            .rule('media')
            .use('url-loader')
            .tap(args => {
                if (base64_limit < 1) delete args.limit
                else args.limit = base64_limit
                const { options } = args.fallback;
                options.name = setAssetsFileName(options.name);
                return args
            })

        config.module
            .rule('svg')
            .use('file-loader')
            .tap(args => {
                args.name = setAssetsFileName(args.name);
                return args
            })

        config.optimization.minimizer('terser').tap(args => {
            args[0].terserOptions.compress.drop_console = isProd;
            return args;
        })
    },
}
// sourcemap 설정
if (useSourceMap) {
    config.configureWebpack.devtool = process.env.DEVTOOL || 'eval-source-map'
}

module.exports = config