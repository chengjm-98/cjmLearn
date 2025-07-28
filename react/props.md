# props

## 要传递 props，请将它们添加到 JSX，就像使用 HTML 属性一样。

## 要读取 props，请使用 function Avatar({ person, size }) 解构语法。

## 你可以指定一个默认值，如 size = 100，用于缺少值或值为 undefined 的 props 。

## 你可以使用 <Avatar {...props} /> JSX 展开语法转发所有 props，但不要过度使用它！

## 像 <Card><Avatar /></Card> 这样的嵌套 JSX，将被视为 Card 组件的 children prop。

    ```jsx

function Card(props) {
return <div className="card">{props.children}</div>;
}

    <Card> <Avatar /></Card>

//等价于
<Card children={<Avatar />} />

    如果是多个子元素，需要使用数组包裹
    <Card>
     <Avatar />
     <Button />
    </Card>

//等价于
<Card children={[<Avatar />, <Button />]} />

```

## Props 是只读的时间快照：每次渲染都会收到新版本的 props。

### 为什么 props 是只读的？

1.保证组件的纯函数特性 2.保持父子组件的单向数据流动 3.避免副作用和不可控行为


### 组件只要收到新的 props（无论这个值是否真的发生了变化），react 都有可能会重新渲染他。

    ** 但是如果props的值发生了变化，那么这个组件一定被重新渲染了一次 **

    props的值变化标准（什么叫做props的值发生了变化）---引用比较,
    1.如果props是基本类型，react会比较值是否不同
    2.如果props是引用类型，react会比较引用是否不同


## 你不能改变 props。当你需要交互性时，你可以设置 state。
```
