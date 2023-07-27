const timeStamp = new Date().getTime()
const path = require('path')
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')

// console.log(process.env.OUTPUT_DIR === 'modops')
module.exports = {
  runtimeCompiler: true,
  publicPath: './',
  devServer: ['modops', 'edge'].includes(process.env.NODE_ENV) ? {
    proxy: {
      '/modrequest': {
        target: process.env.NODE_ENV === 'edge' ? 'http://192.168.40.20/modrequest' : 'http://192.168.40.21/modrequest',
        changeOrigin: true,
        pathRewrite: {
          '^/modrequest': ''
        }
      }
    },
    host: 'localhost'
  } : {},
  pluginOptions: {},
  transpileDependencies: [
    'vue-echarts',
    'resize-detector',
    '@kangc'
  ],

  // 项目打包文件夹
  outputDir: process.env.OUTPUT_DIR === 'modops' ? 'modops' : 'cloud-net-ops',
  // 项目打包文件夹，如果指令是npm run build:monitor环境，打包到modops文件夹，否则打包到cloud-net-ops文件夹
  // 静态资源文件夹 *注：当生成的资源覆写 filename 或 chunkFilename 时，assetsDir 会被忽略。
  // assetsDir: 'static',

  // 关闭 sourcemap
  productionSourceMap: false,

  // 打包的时候不使用 hash 值
  filenameHashing: false,

  // Webpack 函数式配置
  configureWebpack: config => {
    // 缓存
    config.plugins.push(
      new HardSourceWebpackPlugin({
        root: process.cwd(),
        directories: [],
        environmentHash: {
          root: process.cwd(),
          directories: [],
          // 配置了files 的主要原因是解决配置更新，cache 不生效了的问题
          // 配置后有包的变化，plugin 会重新构建一部分 cache
          files: ['package.json', 'yarn.lock']
        }
      })
    )
    // 体积分析
    if (process.env.use_analyzer) {
      const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
      config.plugins.push(new BundleAnalyzerPlugin())
    }

    // 生产环境配置
    if (process.env.NODE_ENV === 'production') {
      // TODO 有些问题需要到生产环境才能排查，比如SSO登陆问题，开发环境排查不了，所以不能配置该选项
      // 消除 console 输出信息
      // config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true

      // Gzip 压缩
      const CompressionPlugin = require('compression-webpack-plugin')
      config.plugins.push(
        new CompressionPlugin({
          algorithm: 'gzip',
          test: /\.(js|css|woff|woff2|svg)$/, // 匹配文件名
          threshold: 10240, // 对超过10k的数据压缩
          deleteOriginalAssets: false, // 不删除源文件
          minRatio: 0.8 // 压缩比
        })
      )

      // 将 js 文件夹添加时间戳，这样浏览器不会加载上个版本缓存的代码
      config.output.filename = `js/[name].${timeStamp}.js`
      config.output.chunkFilename = `js/[name].${timeStamp}.js`
    } else {
      // 开发环境配置
    }
  },
  chainWebpack: config => {
    // svg图标加载
    config.module
      .rule('svg')
      .exclude.add(path.join(__dirname, 'src/assets/icons/svg'))
      .end()

    config.module
      .rule('icons')// 定义一个名叫 icons 的规则
      .test(/\.svg$/)// 设置 icons 的匹配正则
      .include.add(path.join(__dirname, 'src/assets/icons/svg'))// 设置当前规则的作用目录，只在当前目录下才执行当前规则
      .end()
      .use('svg-sprite')// 指定一个名叫 svg-sprite 的 loader 配置
      .loader('svg-sprite-loader')// 该配置使用 svg-sprite-loader 作为处理 loader
      .options({ // 该 svg-sprite-loader 的配置
        symbolId: 'icon-[name]'
      })
      .end()
    // 移除 prefetch 插件
    // config.plugins.delete('prefetch')
  },
  css: {
    // 打包后css文件名称添加时间戳，浏览器不会加载上版本资源
    extract: {
      filename: `css/[name].${timeStamp}.css`,
      chunkFilename: `css/[name].${timeStamp}.css`
    }
  }
}
