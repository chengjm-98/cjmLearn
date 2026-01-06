// 假设接口返回一个大文件 / 大 JSON，例如 '/large-file.json'

async function streamLargeFile(url) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // 获取可读流
    const reader = response.body.getReader();
    const contentLength = response.headers.get("Content-Length");
    let receivedLength = 0; // 已接收字节
    const chunks = []; // 存储接收到的 Uint8Array 数据块

    while (true) {
      const { done, value } = await reader.read(); // 读取一个块
      if (done) {
        break; // 读取完成
      }
      chunks.push(value);
      receivedLength += value.length;

      // 实时处理数据块
      console.log(
        `已接收 ${((receivedLength / contentLength) * 100).toFixed(2)}%`
      );
    }

    // 将所有 Uint8Array 合并为一个 Blob
    const blob = new Blob(chunks);
    console.log("文件接收完成", blob);

    // 如果是文本 / JSON 文件，可以转换为文本
    const text = await blob.text();
    console.log("文件内容（前500字符示例）:", text.slice(0, 500));

    // 如果是 JSON 数据，可以解析
    try {
      const jsonData = JSON.parse(text);
      console.log("JSON 数据解析完成", jsonData);
    } catch (err) {
      console.warn("不是标准 JSON 文件，跳过解析");
    }
  } catch (err) {
    console.error("流式加载出错:", err);
  }
}

// 调用
streamLargeFile("/large-file.json");
