<!--
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2026-01-15 14:12:34
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2026-01-15 14:20:28
 * @FilePath: /cjmLearn/react/样式/react的样式写法.md
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->

# 内联 css

# 普通 css

# css module

- 自动生成独一无二的 class 名，避免冲突。
- 支持常规 CSS 功能。
- 复用性好。

# css in js

- styled-components
  - 支持动态样式和 JS 逻辑。
  - 自动生成唯一的类名，避免冲突。
  - 封装样式，二次开发比较友好

# tailwindcss

- 无样式文件
- 直接在组件中使用类名
- 动态生成样式

| 方式                        | 优点                       | 缺点               | 适用场景                |
| --------------------------- | -------------------------- | ------------------ | ----------------------- |
| Inline Style                | 简单、独立                 | 不支持伪类、复用差 | 小型组件、动态样式      |
| CSS                         | 简单、熟悉                 | 全局污染           | 传统项目                |
| CSS Module                  | 避免冲突、复用好           | 拼接 class 略复杂  | 中大型项目              |
| Styled Components / Emotion | 动态、支持伪类、唯一 class | 依赖库、性能略低   | 需要动态样式 + SSR      |
| Tailwind CSS                | 快速、响应式好             | 类名多             | 快速开发、团队统一风格  |
| Sass / Less                 | 功能强大                   | 构建复杂           | 大型项目、需要嵌套/变量 |

# 为什么 styled-components 的性能要略差一点

- 运行时生成 CSS
  - Styled Components 会在 运行时（JS 执行时）把你写的 CSS 转换成实际的 <style> 标签并插入到 DOM。
  - 每个组件渲染时，库会检查样式是否已存在，如果没有就生成新的 class。
  - 这个过程涉及 字符串处理、哈希计算、DOM 操作，比直接使用静态 CSS 文件多了一层开销。
  - 对比传统 CSS：浏览器直接解析静态 CSS 文件，不需要 JS 运行时干预。
- 动态样式的开销
  - 每次渲染组件时，它可能需要 重新计算样式。
  - 对于大量组件或者频繁更新的界面，这会增加 JavaScript 执行和重新渲染的成本。
- dom 插入开销
  - 每个组件可能生成一个新的 <style> 标签（或者一个大标签包含多个 class）。
  - 浏览器处理大量动态 <style> 标签比静态 CSS 文件略慢。
  - 对小型项目不明显，但在大项目或列表渲染场景下会有差异。
- 如果使用 SSR
  - SSR 时，Styled Components 需要 收集渲染树中的所有样式，生成 CSS 注入到 HTML。
  - 这个过程比普通 React SSR 多了一步，所以首屏渲染可能略慢。
  - 虽然可以缓存样式，但依然比静态 CSS 文件的直接加载慢一点。
