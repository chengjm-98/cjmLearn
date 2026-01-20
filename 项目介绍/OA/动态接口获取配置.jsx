/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2026-01-20 14:55:12
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2026-01-20 15:05:30
 * @FilePath: /cjmLearn/项目介绍/OA/动态接口获取配置.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
{
  name: 'country',
  label: '国家',
  type: 'select',
  options: ['中国', '美国'],  // 默认可选
  optionsSource: {
    type: 'api',
    url: 'https://restcountries.com/v3.1/all',
    mapFn: 'data => data.map(item => item.name.common)' // 用户输入的 JS 代码
  }
}
