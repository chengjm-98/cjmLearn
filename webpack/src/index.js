/*
 * @Author: jamie jamie.cheng@yuansuan.com
 * @Date: 2024-11-21 22:37:46
 * @LastEditors: jamie jamie.cheng@yuansuan.com
 * @LastEditTime: 2024-11-22 00:28:40
 * @FilePath: \webpack\src\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
if(module.hot){
  module.hot.accept('./index.js',()=>{
    console.log('index.js has been updated');
  })
}
import $ from 'jquery';
console.log($);
console.log('hello webpack');