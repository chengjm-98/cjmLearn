# 问题描述

当一个页面需要同时加载 100+json 文件，导致的页面卡顿，页面崩溃，内存爆表问题解决。

# 解决方法-思路和步骤

## 压缩/合并请求/缓存/按需加载

## 流式加载（分批加载）

流式加载能提高性能的原因：

- 批量加载： 将 100 个 JSON 文件分成多个小批次，每次只加载一部分文件。例如，每次加载 10 个 JSON 文件，加载完一批后再开始加载下一批。
- 分帧渲染： 每加载一批数据后，立即进行渲染，而不是等所有数据加载完成后再一起渲染。通过将渲染任务分散到多个帧（例如，使用 requestAnimationFrame）来减轻一次性渲染带来的性能负担。这样可以利用浏览器的渲染队列，让渲染任务不会堵塞 UI 线程。
- 渲染任务分散到不同的帧中，每次渲染一小部分，确保渲染过程平滑，不会一次性占用过多内存。不会一次性到达一个高峰从而导致内存爆表页面崩溃。

### 举例说明：

比如这次其实所有的 json 只有不到一个 g 的大小，但是因为是 100+个 json 文件同时渲染会导致浏览器内存占用瞬间到达 3 个 g，导致页面崩溃。但是流式加载的话会浏览器的内存占用会维持在一个 g 左右，不会瞬间到达 3 个 g。

```jsx
const c0 = new AbortController();
abortController.current = c0;
console.log("开始加载第一帧极限");
const p0 = fetch("/" + newStreamLine[0], {
  signal: c0.signal,
}).then((b) => b.json());
const p0data = await p0;
state.setNframes(1);

// 创建新的风场图层
const windLayer = new TraceLineLayer([p0data], WIND_LINE_LAYER_ID, windOptions);
// windLayer.createGUI(new GUI());
windLayers.add(windLayer);
let pslist: Promise<any>[] = [];
function chunkLoad(step = 10) {
  // 如果有剩余数据，继续加载
  if (obj.chunkCount > 0) {
    for (let i = 0; i < step; i++) {
      if (obj.currentChunkInd <= newStreamLine.length - 1) {
        pslist.push(
          fetch("/" + newStreamLine[obj.currentChunkInd], {
            signal: abortController.current.signal,
          }).then((b) => b.json())
        );
      }
      obj.currentChunkInd++;
      console.log("加载中极限", obj.currentChunkInd);
      if (i >= obj.chunkCount) {
        setIsLayerloading(false);
        break;
      }
    }
    Promise.all(pslist)
      .then((datas) => {
        windLayer.addFrame(datas);
        obj.chunkCount -= datas.length;
        pslist = [];
        //更新已加载的数量
        state.setNframes(obj.currentChunkInd - 1);
        // 如果有剩余数据，继续加载
        if (obj.chunkCount > 0) {
          chunkLoad();
        }
      })
      .catch((e) => {
        if (e.name === "AbortError") {
          console.log("chunkLoad 请求被中止");
        } else {
          console.error(e);
        }
      });
  }
}

chunkLoad();
```

## 切换页面的时候使用 AbortController 来中止请求

- 防止页面切换后，上个页面的 json 还在加载，占用没用的内存，导致内存崩溃。

```jsx
const controller = new AbortController();
const signal = controller.signal;

const fetchData = async () => {
  try {
    const response = await fetch("https://api.example.com/data", {
      method: "GET",
      signal: signal, // 将信号传递给请求
    });
    const data = await response.json();
    console.log("数据加载成功:", data);
  } catch (error) {
    if (error.name === "AbortError") {
      console.log("请求被中止");
    } else {
      console.error("请求错误:", error);
    }
  }
};

// 开始加载数据
fetchData();

// 假设页面切换时，调用 abort 方法
const handlePageSwitch = () => {
  controller.abort(); // 中止请求
};
```

# 还有更多思考 - Chrome 有个机制，对于同一个域名，默认允许同时建立 6 个 TCP 持久连接，那么如果前端同时 fetch 请求 100 个 json，为什么还要流式加载

## 核心

6 个 TCP 连接，只限制“在路上的请求数量”，
但不限制“返回数据在同一时间涌入内存”

```jsx
👉 同时 fetch 100 个 JSON，即使只走 6 个连接，
   解析、缓存、渲染、JS 执行依然可能在短时间内把前端压垮
👉 流式加载是为了解决：内存峰值、主线程阻塞、用户体验问题.
```

## 为什么六个连接救不了性能

- 1️⃣ 请求是排队的，但响应不是“慢慢处理”的

  ```jsx
  T1: 第 1～6 个请求发出
  T2: 第 1～6 个请求几乎同时返回（JSON 很小）
  T3: 浏览器立刻发第 7～12 个
  T4: 第 7～12 个也很快返回
  ...

  ```

  100 个 JSON 会在极短时间内全部完成,压垮前端。

- 问题不是“网络”，是“前端处理”
  ```jsx
  对每一个 fetch(JSON)：
  接收完整 response
  放入内存 buffer
  JSON.parse（⚠️ 同步，阻塞主线程）
  生成 JS 对象
  触发状态更新（React / Vue）
  diff / render
  GC 压力上升
  这 100 次几乎是“连着发生的”
  ```

## 流式加载到底解决是什么问题

- 降低内存峰值（非常关键），内存可及时释放
- 拆解主线程压力
- 提前可用数据，提升用户体验感

## 思考，那 http2 是不是更加需要流式加载呢？

- 是的
  因为 HTTP/2 的特点是：请求不再排队，100 个请求可以几乎同时返回，数据洪峰更猛

# 面试模板

```jsx
浏览器对同一域名的 6 个 TCP 连接限制，只限制并发请求数，
并不能限制响应数据在短时间内返回和被解析。
当前端同时请求大量 JSON 时，
会造成内存峰值过高和主线程同步解析阻塞。

因此需要通过流式或分批加载，
来控制解析和渲染节奏，
提升页面响应性和稳定性，
在 HTTP/2 场景下这一点尤为重要。
```

# 大文件的分块流式加载

- 流式：一边下载/上传一边处理，避免占用大量内存。
- 分块：把大文件拆成多个小块（chunk），按顺序加载/上传。

## ReadableStream(真流式)配合 fetch 实现

ReadableStream 是 Web Streams API 的一部分，

## http 的 range 请求

- HTTP 的 Range 请求 是一种 按字节范围请求资源 的机制，它允许客户端只获取文件的一部分，而不是一次性下载整个文件
- Range: bytes=<start>-<end>

```jsx
async function fetchChunk(url, start, end) {
  const response = await fetch(url, {
    headers: {
      Range: `bytes=${start}-${end}`,
    },
  });
  return response.arrayBuffer(); // 返回二进制
}

async function downloadLargeFile(url, chunkSize = 1024 * 1024) {
  // 1MB
  // 获取文件大小
  const headResp = await fetch(url, { method: "HEAD" });
  const size = Number(headResp.headers.get("Content-Length"));

  let offset = 0;
  const chunks = [];

  while (offset < size) {
    const end = Math.min(offset + chunkSize - 1, size - 1);
    const chunk = await fetchChunk(url, offset, end);
    chunks.push(chunk);
    offset += chunkSize;
    console.log(`Downloaded ${offset}/${size}`);
  }

  // 合并 ArrayBuffer
  const totalBuffer = new Uint8Array(size);
  let position = 0;
  for (const chunk of chunks) {
    totalBuffer.set(new Uint8Array(chunk), position);
    position += chunk.byteLength;
  }

  // 生成 Blob 下载
  const blob = new Blob([totalBuffer]);
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "large_file.bin";
  a.click();
}
```
