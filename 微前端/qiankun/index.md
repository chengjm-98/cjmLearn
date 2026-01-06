<!--
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2026-01-07 00:50:05
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2026-01-07 00:54:27
 * @FilePath: /cjmLearn/微前端/qiankun/index.md
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->

# 什么是 qiankun

qiankun 是基于 single-spa 的微前端框架，实现了主应用（Master）与子应用（Slave）的组合，通过 JS 沙箱 + CSS 隔离 + 生命周期管理 来解决多应用共存问题。它可以让子应用独立部署，主应用按需加载，技术栈完全无关。

# qiankun 的工作原理

- JS 沙箱：利用 Proxy 拦截全局变量访问，保证子应用不会污染主应用的全局环境。
- CSS 隔离：通过在子应用的根元素加前缀类或使用 Shadow DOM，实现样式作用域隔离。
- 生命周期管理：每个子应用有三个生命周期方法：
  - bootstrap：子应用初始化，只会执行一次。
  - mount：子应用挂载，每次显示时执行。
  - unmount：子应用卸载，释放资源。
  - 路由同步：子应用可以独立路由，也可以和主应用路由同步，通过监听路由变化实现。

# 怎么实现的隔离

- JS 隔离：通过 Proxy 包装子应用全局 window，拦截读取/修改全局变量。
- CSS 隔离：给子应用根节点加独立 class 前缀，或使用 Shadow DOM，让样式只作用在子应用内部。
- DOM 隔离：DOM 共享浏览上下文，但在 JS 沙箱和 CSS 隔离下，互不干扰。

# 怎么实现通信

- props：父应用传给子应用的数据。
- globalState：qiankun 提供的全局状态管理，父子应用可监听状态变化，实现双向通信。
- EventBus：自定义事件总线（非 qiankun 内置）。 emit
