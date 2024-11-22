/*
 * @Author: jamie jamie.cheng@yuansuan.com
 * @Date: 2024-11-21 22:38:17
 * @LastEditors: jamie jamie.cheng@yuansuan.com
 * @LastEditTime: 2024-11-22 00:34:54
 * @FilePath: \webpack\webpack.config.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// import path from 'path';
const { noop } = require('jquery');
const path = require('path');  //因为是在node环境下运行，commonjs规范，所以需要引入path模块
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  entry: './src/index.js',
  devServer:{
    // 起了一个服务，服务和浏览器之间建立了长连接。
    open:true,
    hot:true,
    host:'localhost',
  },
  plugins:[
    new HtmlWebpackPlugin({
        template:'./public/index.html',
        filename:'index.html',
        hash:true,
    })],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  mode: 'development',  
  //指令的优先级更高，npx webpack --mode development 所以这里的mode会覆盖webpack.config.js中的mode   //npx
//   module: {
//     noParse: "/\/jquery\/",  //只在生产环境生效 不打包jquery
//     rules:[
//         {
//             test:/\.js$/,
//             use:[{
//             loader:'cache-loader',
//             options:{
//                 // 如果没有指定路径，会存在本地电脑的临时缓存目录
//                 cacheDirectory:"./cache"
//         }
//             },  
//         ]
//         },
//     ]
//     // rules: [
//     //   {
//     //     test: /\.js$/,
//     //     exclude: /node_modules/,
//     //     use: {
//     //       loader: 'babel-loader',
//     //       options: {
//     //         presets: ['@babel/preset-env'],
//     //       },
//     //     },
//     //   },
//     // ],
//   },

};