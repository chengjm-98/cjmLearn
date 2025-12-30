<!--
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2025-12-30 15:27:25
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2025-12-30 15:37:02
 * @FilePath: /cjmLearn/遇到的问题/react 提升首屏加载的时间.md
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->

## webpack 代码分割

## 开启浏览器缓存

## 使用 React.memo 减少不必要的渲染

## 使用 React.lazy 实现懒加载

# react 假如首屏，有两个模块的接口非常慢，怎么提高首屏加载时间

## 代码分割配置使用 React.lazy 实现懒加载配合 Suspense 组件

```jsx
const SlowModule1 = React.lazy(() => import("./SlowModule1"));
const SlowModule2 = React.lazy(() => import("./SlowModule2"));

function App() {
  return (
    <div>
      <div>
        {/* 首屏先加载其他内容 */}
        <OtherModule />
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <SlowModule1 />
      </Suspense>

      <Suspense fallback={<div>Loading...</div>}>
        <SlowModule2 />
      </Suspense>
    </div>
  );
}
```

-

## 骨架屏/占位符

## 缓存接口返回

## 使用 Web Workers，避免阻塞主线程

## webpack 配合，压缩&摇树

## next.js
