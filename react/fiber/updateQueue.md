   ### 1. 什么是 updateQueue?
    是每个 fiber 节点上的一个属性，用来记录该节点上的所有的挂起更新（state，props，forceUpdate）和相关的回调。 - 经典格式：

    ```jsx
    interface Update<State> {
      lane: Lane; // 优先级
      action: (prevState: State) => State | State; // 更新函数或新 state
      next: Update<State> | null; // 链表指向下一个更新
      callback?: () => void; // 更新完成后的回调
    }

    interface UpdateQueue<State> {
      baseState: State; // 上一次计算后的状态
      firstUpdate: Update<State> | null; // 链表头
      lastUpdate: Update<State> | null; // 链表尾
      shared?: {
        pending: Update<State> | null, // 并发模式下挂起的更新
      };
    }
    ```
  ### 2.updateQueue 的产生和使用（更新管理的一个机制）
      - 1️⃣ 产生：
         - state/props/forceUpdate 会产生一个 update 对象。
         - context 会产生一个 update 对象。
         - 生命周期函数会产生一个 update 对象。
      - 2️⃣ 使用：
        - 1️⃣ 挂载阶段
          - 把 update 对象添加到fiber节点的 updateQueue 队列中。
          - fiber.lanes |= update.lane，并冒泡到 root.pendingLanes 中。
        - 2️⃣ 调度：
          - 调度器根据 root.lanes 选择最高优先级的 lane 进行处理。
          - 进入 render 阶段，构建 WIP 树，在 beginWork 时，把 current Fiber 的 updateQueue 克隆到 WIP Fiber 上
        - 3️⃣ 调和：
          - 遍历 WIP 树，应用 updateQueue 中的 update，计算新 state。
          - 标记 effect，生成 effect list。
        - 4️⃣ 提交：
          - 提交阶段不可中断，会把新的 fiber 树一次性替换掉旧的 fiber 树。
          - 根据 effect list 更新真实 DOM / 调用生命周期 / 执行副作用     
### 3.关于lane和updateQueue的关系
  - 一个fiber节点上有一个updateQueue，这个updateQueue是一个链表，链表的每个节点是一个update对象，update对象上有一个lane属性，这个lane属性是一个二进制数，用来表示这个update的优先级。
  - 一个fiber节点上的updateQueue可以有多个update对象，每个update对象上的lane属性可以是不同的。
  - 一个fiber节点也有一个lanes属性，这个lanes属性也是一个二进制数，用来表示**这个fiber节点以及这个节点的子节点上**的所有update对象的优先级。
  - 当一个用户一个事件触发时，react会给他生成一个优先级，就是lane，然后这lane会被合并到fiber节点的lanes属性中。然后子节点的lanes会层层冒泡到根节点上，root.pendingLanes 更新。调度器从 root.pendingLanes 中选择最高优先级 lane，然后在 render 阶段根据该 lane 遍历 Fiber 树，处理匹配 lane 的 updateQueue。
  - **lane ≠ update**  那么如果一个事件被标注了lane，但是并没有生成update，那么即便这个事件的优先级有多高，也不会触发render。lanes只是起到了一个**提醒作用**，或者说粗略的看一下这棵树上哪里有优先级高的事件要处理，然后拿到优先级高的事件再去看这个事件有没有对应的update。只有有对应的update，才会触发render。