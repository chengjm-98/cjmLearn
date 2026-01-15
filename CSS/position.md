# static

- 元素不会被定位，会按照正常的文档流进行布局。
- 不会受到 top/right/bottom/left 等属性的影响。

# relative

- 使用 top/right/bottom/left 会 相对于原位置偏移。
- 相对于自己原本的位置进行偏移。

# absolute

- 定位规则
  - 相对于最近的定位父级元素（position 不为 static 的元素）
  - 没有定位父级元素，相对于 body 元素

# fixed

- 定位规则
  - 元素相对于 浏览器可视窗口（viewport） 定位。
  - 使用 top/right/bottom/left 定位。

# sticky

- 在元素未达到阈值之前，它表现为 相对定位（relative）。
- 一旦滚动到阈值，它表现为 固定定位（fixed），并“粘”在指定位置。
- 当父容器滚动完时，它又会随父容器一起移动。

## 注意

- sticky 元素 必须在滚动容器内。
- 父容器不能有 overflow: hidden | auto | scroll 限制滚动方向，否则 sticky 失效。
- top、left、right、bottom 指定距离父容器的偏移。
- 不设置阈值可能不起作用。

```jsx
- 3.1 相对定位阶段
当滚动条未达到阈值时，元素按照 文档流 正常布局。
占据原有空间。

[Parent Container]
|--------------------|
| Element (sticky)   | ← 相对定位
|--------------------|
| Other content      |

- 3.2 粘性固定阶段

当滚动到 top 指定阈值时，元素会 固定在阈值位置。
仍在父容器范围内，不会脱离父容器。

[Parent Container]
|--------------------|
|                   | ← 元素固定在顶部
|--------------------|
| Other content      |

- 3.3 父容器边界结束

当父容器滚动结束时，sticky 元素 随父容器一起停止。
这是和 position: fixed 最大的区别，fixed 是相对于 viewport 固定，不受父元素影响。
```
