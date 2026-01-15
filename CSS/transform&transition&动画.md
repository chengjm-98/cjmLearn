| 属性         | 作用                       | 是否需要状态变化 | 控制复杂性 |
| ------------ | -------------------------- | ---------------- | ---------- |
| `transform`  | 变形/平移/旋转/缩放        | ❌               | 低         |
| `translate`  | 平移（transform 的子功能） | ❌               | 低         |
| `transition` | 属性变化的过渡效果         | ✅               | 中         |
| `animation`  | 关键帧动画                 | ❌               | 高         |

# transform

- 元素变形/平移/旋转/缩放
- 它不会影响文档流，只是视觉上的变化。不影响其他元素的布局
  | 函数 | 功能 | 示例 |
  | ------------------------ | ---- | ------------------------------------ |
  | `translate(x, y)` | 移动元素 | `transform: translate(50px, 100px);` |
  | `rotate(angle)` | 旋转元素 | `transform: rotate(45deg);` |
  | `scale(x, y)` | 缩放元素 | `transform: scale(1.5, 2);` |
  | `skew(x-angle, y-angle)` | 倾斜元素 | `transform: skew(20deg, 10deg);` |

# transition：过渡动画

- transition: 属性 持续时间 [缓动函数] [延迟时间];

```jsx
.box {
  width: 100px;
  height: 100px;
  background: blue;
  transition: transform 0.5s ease-in-out;
}

.box:hover {
  transform: translateX(100px) rotate(45deg);
}
```

# animation：动画

- 关键帧动画

```jsx
@keyframes slideIn {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(0);
  }
}
.box {
  animation: slideIn 1s ease-in-out;
}

```

# transform 和 marign top bototm 的区别

## transform

- 不影响其他元素的布局。
- 不触发布局重排（reflow）。
- 可以做旋转、缩放、倾斜等复杂变换。
- 本身的占位不会改变。

## margin-top/bottom

- 会影响其他元素的布局。
- 会触发布局重排（reflow）。
- 只能做简单的上下移动。
