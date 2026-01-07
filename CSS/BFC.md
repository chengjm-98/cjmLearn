# 什么是 BFC？

BFC（Block Formatting Context，块级格式化上下文）的本质其实是 一种独立的渲染区域，在这个区域内，元素的布局规则和其他区域是相互独立的。简单来说，BFC 就是通过一些特定的规则，**使得一组元素的布局行为不会影响到外部其他元素，同时也能阻止外部元素的布局行为影响到它们**。

# BFC 可以解决的问题

- ## margin 重叠
  - 在没有 BFC 时，块级元素之间的垂直外边距会发生合并。
  - 而当我们让一个元素成为 BFC 时，它会避免外边距的合并。每个 BFC 都有自己的 垂直外边距规则，不会与其他 BFC 进行合并。
- ## 解决高度塌陷
  - 没有 BFC 时，浮动元素会脱离文档流，可能导致父容器的高度“塌陷”
  - 而在 BFC 中，浮动元素会被“包含”在 BFC 内，父容器会根据浮动元素的高度来自动调整高度，防止容器高度塌陷。
- ## 防止元素重叠
  - 没有 BFC 时，某个元素具有浮动、绝对定位或负的外边距等样式可能会导致重叠。
  - 而在 BFC 中，BFC 可以有效防止这些元素与其他元素发生重叠或穿透。它使元素之间保持独立的布局。

# 如何创建一个 BFC

```jsx
文档的根元素（<html>）。
浮动元素（即 float 值不为 none 的元素）。
绝对定位元素（position 值为 absolute 或 fixed 的元素）。
行内块元素（display 值为 inline-block 的元素）。
表格单元格（display 值为 table-cell，HTML 表格单元格默认值）。
表格标题（display 值为 table-caption，HTML 表格标题默认值）。
匿名表格单元格元素（display 值为 table（HTML 表格默认值）、table-row（表格行默认值）、table-row-group（表格体默认值）、table-header-group（表格头部默认值）、table-footer-group（表格尾部默认值）或 inline-table）。
overflow 值不为 visible 或 clip 的块级元素。 overflow 除了 visible 以外的值还有 hidden、scroll、auto 或 overlay。
display 值为 flow-root 的元素。
contain 值为 layout、content 或 paint 的元素。
弹性元素（display 值为 flex 或 inline-flex 元素的直接子元素），如果它们本身既不是弹性、网格也不是表格容器。
网格元素（display 值为 grid 或 inline-grid 元素的直接子元素），如果它们本身既不是弹性、网格也不是表格容器。
多列容器（column-count 或 column-width 值不为 auto，且含有 column-count: 1 的元素）。
column-span 值为 all 的元素始终会创建一个新的格式化上下文，即使该元素没有包裹在一个多列容器中（规范变更、Chrome bug）
```
