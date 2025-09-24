# 🚀fiber (important!) react16 引入的

链接：https://zhuanlan.zhihu.com/p/424967867

- ## 先了解一下虚拟 DOM
- ### 什么是虚拟 DOM

  - 虚拟 DOM 是由 React.createElement()方法创建的一个 JavaScript 对象，它代表了真实 DOM 的一个抽象。
  - 它存在运行时内存里面(**随机存取存储器 RAM**)
    - ⭐RAM 是 CPU 用来快速读写数据的地方，和硬盘不太一样，内存的数据是临时的，断电或者刷新页面就会丢失。
  - 🏃‍♀️ 三个步骤：
    - 1️⃣ 生成虚拟 DOM 树。
    - 2️⃣ 对比两棵虚拟 DOM 树（新&旧）。
    - 3️⃣ 更新视图，patch 到真实 DOM。
  - 🕸 虚拟 dom 的结构
    ![alt text](image-2.png)

    - 1️⃣ typeof：一个 Symbol(react.element)（或数字常量，老版本），用于内部标识这是 React 元素，防止被当成普通对象
    - 2️⃣ type：元素的类型（如 div、span、p 等）。--重要之一
    - 3️⃣ props：元素的属性（如 className、style、onClick，children 等）。 --重要之一
    - 4️⃣ key：元素的唯一标识（用于优化性能）。
    - 5️⃣ ref：元素的引用（用于操作 DOM）。
    - 6️⃣ \_owner:

      ```jsx
      const element = <div className="container">Hello, world!</div>;
      ```

- ### diff 算法

  - react16 之前的 diff 算法是**递归**,深度优先策略。
  - 会存在两棵虚拟 dom 树，一个是当前的，一个是更新的。
  - diff 算法负责比较新旧虚拟 dom 树的差异，并计算出最小的更新操作集合来使新虚拟 dom 和真实的 dom 树保持同步。
    - ⚠️ 缺点
    - 同步进行，不可中断，导致主线程被长时间占用，会阻塞主线程，带来卡顿。
  - **👫 具体 diff 策略**
    - 1️⃣ 同层比较原则，仅对同层的元素进行比较，原因是要保证效率为 O(n)级别。
    - 比较过程中，会进行以下几种操作：
      - 相同类型复用：如果新旧节点的类型相同，那么会保留旧节点，只更新属性和子节点。
      - 不同类型替换：如果新旧节点的类型不同，那么会直接删除旧节点，创建新节点。
      - 移动节点：如果新旧节点的位置发生变化，那么会移动节点的位置。
        - 移动节点也只会在**同层**进行，不会跨层移动。
        - **关于 key 属性**（很重要！可以提高性能）：
          - 如果没有设置 key 属性，那么 react 会认为所有的子节点都是唯一的，React 按顺序比对，错位就会导致大量删除和新建，性能差、状态丢失。。
          - 如果设置了 key 属性，那么 react 会根据 key 属性来识别'这是同一节点，只是顺序发生了变化'。
          - 那么在什么情况下需要加 key 呢？
            - 1️⃣ 列表渲染：如果列表项的顺序发生了变化，那么需要设置 key 属性来标识每个列表项。
            - 2️⃣ 表单元素：如果表单元素的顺序发生了变化，那么需要设置 key 属性来标识每个表单元素。
      - 文本节点：如果新旧节点都是文本节点，那么会直接更新文本内容。
    - **在比较的过程中也有一些原则**
      - 先复用再增删
        ![alt text](image-1.png)
    - 2️⃣（跨级不复用）不同层的节点被认为是完全不同的，回直接删除旧节点，创建新节点。
      - 🌰**举个栗子**
        下图 C、E、F，只能删掉再重新创建。
        ![alt text](image.png)

- ### ❌ 关于虚拟 dom 的误区
  - 1️⃣ 关于说虚拟 dom 更快的误区
    - 存在一种说法说虚拟 dom 的存在使得浏览器不用频繁操作真实 dom，所以更快。这种说法存在一定得问题。
      ```jsx
        诚然，真实dom的操作确实开销很大（需要重排，重绘，布局计算，渲染树更新等），而虚拟dom只是一个js对象，操作成本低。但是事情不可以一概而论，不是说‘有了虚拟dom就一定更快’。如果一次只做一个简单的dom更新，那么虚拟dom的开销可能比真实dom的开销更大。 因为少了diff算法的开销。
      ```
    - 准确得说，虚拟 dom 的优势不在于单次的操作，而是在于大量的频繁的更新的情况下，能够对视图进行更合理，高效的更新。
      ```jsx
        - 虚拟 DOM 的核心优势是批量更新 + diff 策略。
        - 它通过 diff 算法 比较新旧虚拟 DOM 树，只把变化的部分映射到真实 DOM，而不是全部重绘。
        - 在高频更新的场景下（比如 React 的状态频繁变化、复杂 UI 需要更新多个子树），虚拟 DOM 能减少不必要的真实 DOM 操作，从而整体性能更好。
        - 这是一种 “以空间换时间” 的策略：牺牲一点 diff 的计算时间，换来减少大量昂贵的真实 DOM 操作。
      ```
- ### fiber

  - react16 之后为了提高 diff 算法的性能，引入了**fiber**。
  - **先解释一下什么是 IO 调度，什么是 CPU 调度**
    - IO 调度：（输入输出调度）
      - 常见的 IO：
      - 磁盘 IO → 读写硬盘文件
      - 网络 IO → 请求/响应数据
      - 用户 IO → 用户输入（键盘、鼠标）
      - 显示 IO → 把结果输出到屏幕
      - 指的是操作系统对输入输出设备的调度，它的目的是提高 IO 设备的利用率，减少 IO 设备的等待时间。
      - 比如发送网络请求后幼等待数据返回才能进一步操作导致的不能快速响应。
    - CPU 调度：
      - 指的是操作系统对 CPU 的调度，比如操作系统分配 CPU 给不同进程/线程去执行任务。
      - 比如多个进程或线程在 CPU 上运行，CPU 调度器会根据进程或线程的优先级来决定哪个进程或线程先运行。
      - cpu 的瓶颈就是 cpu 算不过来了，需要等待。
  - **fiber 产生的原因**
    - 影响网页快速响应的两类情景
      - IO 的瓶颈
        - 是程序花很多时间在等数据（网络/磁盘等），而不是 CPU 算不过来。
        - 比如发送网络请求后幼等待数据返回才能进一步操作导致的不能快速响应。
      - cpu 的瓶颈
        - 算不过来了。
  - **为什么会产生 fiber**

    - 为了解决**cpu 的瓶颈**，即为了解决复杂页面渲染时的卡顿影响用户体验，react16 引入了 fiber。
    - **为什么是 cpu 瓶颈不是 IO 瓶颈？**

    ```jsx
      - 是因为之前的diff算法是占用主线程，这是一整个计算过程(纯计算逻辑)，几乎不涉及IO，比如磁盘的调度，网络的请求等。
      所以卡顿的原因是因为主线程(cpu被占满)被diff算法占用，主线程没用空来处理用户交互。包括点击输入动画渲染等，才会导致卡顿。

      -Fiber 的中断机制，其实是 React 自己在 JS 层面模拟了一种“任务调度”：
      把渲染任务拆成小块（一个 fiber 单元）。
      每次执行一点点，然后检查“现在还有更紧急的任务吗？”
      如果有，就把 CPU 时间“让出来”，去执行更高优先级的任务（比如用户输入）。这是一种 在 JS 层面的 CPU 调度，不是 IO 调度。
      👉 因为它解决的问题是 CPU 长时间被渲染占用，而不是“等待网络/磁盘 IO”。
    ```

  - **浏览器的工作模式**
    - 什么情况下用户感知下认为浏览器是流畅的？
      - 每秒渲染 至少 60 帧的情况下用户会感觉到是流畅的，也就是 16.6ms 一帧。如果低于这个标准，就会出现卡顿。
      - 然后每一帧内要做的事情，这些都需要顺序执行，有严格的顺序。
        - 1️⃣ 处理用户输入事件（比如点击、滚动、输入等）。
        - 2️⃣ 执行 JavaScript 代码（比如 React 组件的渲染（diff 算法等）、事件处理等）。
        - 3️⃣ 计算样式，生成那些样式树
        - 4️⃣ 布局（layout），计算出每个节点在屏幕上的位置和大小。
        - 5️⃣ 绘制（paint），将计算好的样式应用到每个节点上。
        - 6️⃣ 合成与渲染。
      - 如果长时间停留在某一个步骤，导致进入不了绘制阶段就会导致卡顿，掉帧。
  - **fiber 是什么**
    - 可以说是一种数据结构，也可以说是一种调度机制。
    - **数据结构**：Fiber 是一个 对象，所有 Fiber 节点通过 链表 + 树 的形式串起来 → 构成 Fiber Tree。
    - **机制**：Fiber 是 React 的一种 任务调度与渲染机制，解决 CPU 瓶颈，让渲染可中断、可恢复、可分优先级。
  - ✨**优点**
    - 1️⃣ 任务切片
    - 2️⃣ 可中断
    - 3️⃣ 可恢复
    - 4️⃣ 优先级调度
    - 5️⃣ 双缓冲
  - 👫 有 fiber 以后的渲染步骤：
    - 1️⃣ JSX 通过 Babel 编译成 React.createElement()方法创建的虚拟 DOM。
    - 2️⃣ 虚拟 DOM -> Fiber 树。（协调 Reconciliation）
      - 1️⃣ react 根据虚拟 DOM 生成/更新 Fiber 树。
      - 2️⃣ 旧 的 fiber 树和新的 dom 树进行比较，生成新的 fiber 树。
      - ❓ 这里有个问题从虚拟 dom 到 fiber 树的步骤？会有一个问题这样不会额外多加一层虚拟 dom 到 diff 树的过程嘛？这个过程可以中断嘛？
        ```js
           这里有个关键的点：
           1️⃣ 在fiber构建的过程中，React不会额外跑一遍diff算法，用于生成新的fiber树。
           2️⃣ 而是用新虚拟 DOM 描述更新 → 在创建 workInProgress Fiber 时顺带和旧 Fiber 对比（diff） → 生成 flags。
           所以说：fiber的创建过程和diff是一体化的过程，并不是先虚拟dom进行diff再生成fiber树。
           👉 换句话说，虚拟 DOM 只是一个“快照描述”，真正的 diff 是在 Fiber 层面完成的，React 并没有做两遍。
           所以说：整个fiber树的更新过程是可以中断的。
        ```
    - 3️⃣ 调度（Scheduling）
      - fiber 是可中断的，react 内部通过 Scheduler 来进行 CPU 的时间分片分配。
    - 4️⃣ 渲染（Rendering）
      - 遍历 workInProgress Fiber 树，收集更新副作用链表（effect list）。这一步只在内存里面完成。
    - 5️⃣ 提交（Commit）
      - 一旦渲染完成，React 把 effect list 应用到到真实 DOM 中，完成视图更新。
      - 这一步是不可中断的，因为这一步是在浏览器层面的。
  - ⛓**fiber 具体结构**
  - fiber 的调度单元 **【FiberNode】** 其实就相当于虚拟 dom 中的一个节点

  ```jsx
    //这个是16-17的版本：
    {
      ...
      //基本信息
      tag: WorkTag,             // 节点类型 (函数组件/类组件/HostComponent 等)
      key: null | string,       // 唯一标识 key
      elementType: any,         // React element 类型（区分函数/类/内置组件）
      type: any,                // 已解析的组件类型（function/class/tagName）
      stateNode: any,           // 对应的真实 DOM 节点 or class 实例
      // 单链表树结构
      return: Fiber | null,// 指向他在Fiber节点树中的`parent`，用来在处理完这个节点之后向上返回
      child: Fiber | null,// 指向自己的第一个子节点
      sibling: Fiber | null,  // 指向自己的兄弟结构，兄弟节点的return指向同一个父节点

      // 更新相关
      pendingProps: any,  // 新的变动带来的新的props
      memoizedProps: any,  // 上一次渲染完成之后的props
      updateQueue: UpdateQueue<any> | null,  // 该Fiber对应的组件产生的Update会存放在这个队列里面
      memoizedState: any, // 上一次渲染的时候的state

      // 调度相关
      expirationTime: ExpirationTime,  // 代表任务在未来的哪个时间点应该被完成，不包括他的子树产生的任务。
      childExpirationTime: ExpirationTime, // 子节点的过期时间--快速确定子树中是否有不在等待的变化

      // 在Fiber树更新的过程中，每个Fiber都会有一个跟其对应的Fiber
      // 我们称他为`current <==> workInProgress`
      // 在渲染完成之后他们会交换位置

      alternate: Fiber | null,

      // Effect 相关的
      effectTag: SideEffectTag, // 用来记录Side Effect
      nextEffect: Fiber | null, // 单链表用来快速查找下一个side effect
      firstEffect: Fiber | null,  // 子树中第一个side effect
      lastEffect: Fiber | null, // 子树中最后一个side effect
      ...
    },
    //这是18最新的版本：
    {
       // 基本信息保持一致
      // Fiber 树结构
      return: Fiber | null,     // 指向父 Fiber
      child: Fiber | null,      // 指向第一个子 Fiber
      sibling: Fiber | null,    // 指向兄弟 Fiber（共享同一个 return）
      index: number,            // 在兄弟节点中的位置

      // 更新相关
      pendingProps: any,        // 新的 props（等待处理）
      memoizedProps: any,       // 上一次渲染完成后的 props
      updateQueue: UpdateQueue<any> | null, // 组件产生的更新队列
      memoizedState: any,       // 上一次渲染完成后的 state

      // 调度优先级 (新版 lanes 模型)
      lanes: Lanes,             // 当前 Fiber 上的更新优先级集合
      childLanes: Lanes,        // 子树中包含的优先级集合

      // 双缓冲机制
      alternate: Fiber | null,  // current <-> workInProgress 的互相切换

      // 副作用相关
      flags: Flags,             // 副作用标记 (替代 effectTag)
      subtreeFlags: Flags,      // 子树的副作用标记
      deletions: Array<Fiber> | null, // 要删除的子 Fiber 节点集合
  }

  ```

- 🌲**fiber 的结构是什么**？

  - 本质上是一个带有兄弟指针的多叉树。
  - 它本质上树形结构，但是通过 child/sibling/return 三个指针，形成了一个链表化的树结构,能“链表化”遍历(放弃递归，采用的是循环遍历)。让它既能表达层级关系，又能支持中断和恢复。
  - 遍历策略：深度优先（child 优先，再 sibling，最后 return 回溯）。

- ❓ **那 fiber 分块中断什么的虽然有效让出主线程，那不会导致渲染不完全嘛？**
  - 不会，因为 fiber 是在 js 层面的，不是在浏览器层面的，react 的 fiber 架构设计了双缓冲机制+提交(commit)阶段不可中断。
    **只有调和的阶段可中断，commit 不可中断**
  - 双缓冲机制：
    - 1️⃣ 一个是当前的 fiber 树,current 树(当前正在屏幕上显示应用的树)，一个是更新的 fiber 树，正在构建中的树，workinProgress 树。（WIP 树）。
    - 2️⃣ 双缓冲机制的作用是，在更新过程中，旧的 fiber 树（current 树）还在内存中，新的 fiber 树（workinnProcess 树）也在内存中，然后在提交阶段，会把新的 fiber 树替换掉旧的 fiber 树。
    - 3️⃣ 提交阶段不可中断，会把新的 fiber 树一次性替换掉旧的 fiber 树。
  - 关于 **alternate 指针**
    - 1️⃣ alternate 指针是用来指向当前 fiber 树的另一个版本（WIP 树）。用于连接 current 树和 workinProcess 树。
    - 那为什么需要 alternate 指针呢？
      - 因为如果如果每次更新都需要重新新建整理一整棵 fiber 树的话，开销过大。所以 React 通过 alternate 指针来指向当前 fiber 树的另一个版本（WIP 树）。
      - 这样就可以
        - 1️⃣ 有变化的部分新建或者更新。
        - 2️⃣ 复用已经存在的 fiber 节点，避免重复创建

- **fiber 的优先级**
  - 1️⃣ 16之前用是expirationTime来表示优先级。
  - 2️⃣ 16之后用的是lanes来表示优先级。
- **fiber在更新的时候做的事情**
  - 1️⃣ 创建update对象
  - 2️⃣ 把update对象添加到updateQueue队列中
  - 3️⃣ 调度
  - 4️⃣ 调和
  - 5️⃣ 生成effect list
  - 6️⃣ 提交
  - 7️⃣ 渲染
  - 8️⃣ 并发与中断

-💖 **介绍一下lanes的工作方式**
   具体看lanes.md