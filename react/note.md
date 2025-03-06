什么是前端框架
前端框架是指一组用于构建用户界面的工具和库。它们提供了一种结构化的方式来组织和管理前端代码，使开发人员能够更高效地构建交互式和动态的网页。

UI=F(State) 状态+function
声明式渲染

JSX:也是 js 的语法糖

虚拟 dom：React.createElement()创建出来的对真实 ui 的描述的一种对象，jsx 对象。存在内存【电脑内存】中。
渲染流程：render+commit

一：render:schedule(调度)+reconcile(调和) 可中断，在内存中进行
调度：单独的包 复刻一个 requestIdleCallback(浏览器空闲时执行渲染，优先级比较低)
为什么不用 requestIdleCallback 而要重新复刻一个：1.新出的 API,兼容性有问题 2.触发的时间不可预测。3.react fiber 的细粒度比较细，requestIdleCallback 的粒度比较粗。不能满足。
任务队列：taskQueue 微任务/宏任务
普通任务/延时任务 通过二叉树最小堆找到优先级最高的,sortIndex 越大，优先级越高

      调度的目的：防止当前的线程堵塞 。
      之前没有fiber的时候：递归，但是浏览器大概是60帧，16ms，之前的任务没有完成的话，就会丢帧。
      24帧/秒 人眼识别，如果低于这个帧数，就会觉得卡顿。
      为了解决这个问题，引入fiber。

      requestIdleCallback
      requestAnimationFrame

messageChannel() 产生一个宏任务。用来中断当前的任务。 1.把主线程的控制权交出去。交给渲染线程。
为什么不用 setTimeOut。 1.会生成一个套娃 1.时间不准，超过 5 五个，就会不准。

优先级:通过二叉树最小堆找到优先级最高的。

普通任务，动画任务，微任务。
一个事件循环中，只会执行一个普通任务。动画任务需要全部执行完，但是如果在执行过程中产生了新的动画任务，会把它放在下一次事件循环中。
但微任务需要全部清空，就算在执行过程中产生了新的微任务，也要等待当前的微任务执行完。才会渲染

微任务...... 队列清空-->渲染-->任务

useEffect(()=>{
使用 object.is 来比较依赖是否发生变化
},[依赖])

useLayoutEffect(()=>{},[])

回溯：暴力的思想，递归只是回溯思想的实现。
依赖收集：把当前的对象做成代理对象，
发布订阅：
evenBus：使用的就是发布订阅模式

调和 reconcile  
 调和的入口。 1.同步更新 优先级高的走同步更新 2.异步更新 优先级低的走异步更新

     1. beginWork （递归）遍历每一个fiber节点，深度优先   在执行这个方法的时候，会生成一个新的fiber树。
        在beginWork的时候，会执行diff算法。更新一个新的fiber树
     2. completeWork

一直都有俩 fiber 树，一个是当前使用的，一个正在更新的。只是 workInProgress 的指向在发生变化。
生成两个 fiber 树的意义：
新旧 fiber 树通过 alternative 属性连接起来。
fiber 双缓冲:快速更新。新旧 fiber 树交替使用。

fiber 树：
fiberNode 是 fiber 树的节点，是个对象
{
sibling:兄弟节点
return :父节点
child:指向该 Fiber 节点的第一个子 Fiber 节点
}

//源码
workLoop
//生成一个异步函数，messageChannel 异步任务
//

二：commit:把虚拟 dom 转换成真实 dom。 不可中断，在浏览器中进行
三个阶段：
beforeMutation
commitBeforeMutationEffects
commitBeforeMutationEffects_begin
commitBeforeMutationEffects_complete
mutation
commitMutationEffects
commiMutationEffects_begin
commitMutationEffects_complete
layout
commitlayoutEffects
commitlayoutEffects_begin
commitlayoutEffects_complete
在这些阶段里面会执行 hook,副作用函数。

合成事件:

虚拟 dom 和 fiber 树之间有一个字段叫 stateNode
//新增一个 dom ->更新虚拟 dom 对象->比较虚拟 dom 和 onprocessWorkTree ->更新一个新的 fiber 树->改变 workInProgressTree 的指向->更新新的真实 dom
