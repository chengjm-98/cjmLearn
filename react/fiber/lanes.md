# lanes（react16 之后的优先级工作方式）

16 之前是用 expirationTime 来表示优先级的，16 之后用的是 lanes 来表示优先级的。

## 1. 什么是 lane

- lane 是 React 内部用来标记更新优先级的**位掩码**，一个**32 位**二进制数（最多有 32 位）。

## 2. 用途

- 1️⃣ 标记 fiber 上挂起的更新类型和优先级。
- 2️⃣ 用于调度和优先级管理。

## 3.几种类型的 lane

- **常用的几种类型**当然真实的 react 中还有别的类型。 （这里不用特别关系具体的值到底是多少，每个版本可能都不太一样，值需要知道每种事件会对用一个不同的优先级，而这些优先级由位掩码来标记）
- 比如某个版本中是这样的：
- 1️⃣ NoLane：0b00000000000000000000000000000000，没有任何优先级。
- 2️⃣ SyncLane：0b00000000000000000000000000000001，同步优先级。 - 离散事件，指需要立即执行的事件，例如输入框的 onChange 事件。这些事件需要立即得到响应，以保证应用的交互性能。
- 3️⃣ InputLane：0b00000000000000000000000000000010，输入优先级。
- 4️⃣ TransitionLane：0b00000000000000000000000000000100，过渡优先级。
- 5️⃣ IdleLane：0b00000000000000000000000000001000，空闲优先级。
- **特殊的类型**【todo】
  - 1️⃣ NoLanes：0b00000000000000000000000000000000，没有任何优先级。
  - 2️⃣ Suspense 的控制
  - 3️⃣ ssr 等
- 优先级规则：
  - 值越小，优先级越高。
  - 调度器总是选择优先级最高的 lane 进行处理。

## 4. lane 的工作方式&调度流程

- 1️⃣ 事件触发-生成更新
  - 用户事件触发或者state或者props更新变化，根据事件类型选择 lane 并标记更新。
- 2️⃣ 更新挂载到 Fiber
  - 把更新挂载到对应的 fiber 的 updateQueue（fiber 的属性,lane 是这个属性中的一个 key） 上。
  - 更新标记 lane： fiber.lanes |= update.lane
  - 冒泡到父节点： fiber.lanes |= child.lanes
  - 冒泡到根节点： root.lanes |= fiber.lanes
- 3️⃣ 调度
  - 调度器根据 root.lanes 选择最高优先级的 lane 进行处理。
  ```js
   const nextLane = getHighestPriorityLane(root.pendingLanes)
   找到最低值位 1 的 lane（值越小 → 优先级越高）
  ```
- 4️⃣ fiber 调和
  - 根据 nextLane 开始构建 WIP 树。
  - 判断每个 fiber 是否包含当前 lane。
  - 可中断，高优先级可以插队，剩余低优先级会保留在 fiber 上。
- 5️⃣ 提交阶段
  - 不可中断，正常的提交阶段可参考 fiber。
  - 清理 lane，~nextLane 是按位取反，按位 AND → 只清掉已完成 lane，其他 lane 保留
  ```js
  fiber.lanes &= ~nextLane;
  root.pendingLanes &= ~nextLane;
  ```
- 6️⃣ 剩余更新处理
- 如果还有低优先级 lane：调度器会在空闲或下一帧再次处理。
