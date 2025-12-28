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
