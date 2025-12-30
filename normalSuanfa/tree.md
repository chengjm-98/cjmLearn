<!--
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2025-11-25 18:04:31
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2025-12-30 16:37:29
 * @FilePath: /cjmLearn/normalSuanfa/tree.md
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->

# 关于树的一些事情

## 树的遍历

- 深度优先
- 前序遍历：根节点->左子树->右子树

- 中序遍历：左子树->根节点->右子树
- 后序遍历：左子树->右子树->根节点
- 广度优先
- 层序遍历：从上到下，从左到右

## 递归查树

### 递归前序

```jsx
function preOrder(root) {
  if (root === null) return;
  console.log(root.value); // 访问根节点
  preOrder(root.left); // 遍历左子树
  preOrder(root.right); // 遍历右子树
}
```

### 递归查询

```jsx
// 递归查询某个值
function searchValue(root, target) {
  if (root === null) {
    return false; // 如果节点为空，返回false
  }
  if (root.value === target) {
    return true; // 找到目标值，返回true
  }
  // 否则递归查询左子树和右子树
  return searchValue(root.left, target) || searchValue(root.right, target);
}
```

## 非递归

### 前序

```jsx
function preOrderNonRecursive(root) {
  if (root === null) return;
  const stack = [root];

  while (stack.length > 0) {
    const node = stack.pop();
    console.log(node.value);

    // 先右子树入栈，再左子树入栈
    if (node.right) stack.push(node.right);
    if (node.left) stack.push(node.left);
  }
}
```
