import React, { useRef, useState } from "react";

/**
 * ================================
 * 基本配置
 * ================================
 */
const CHUNK_SIZE = 5 * 1024 * 1024; // 分片大小 5MB
const CONCURRENCY = 6; // 并发线程数

export default function FileDownloader() {
  const [url, setUrl] = useState("");
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("idle"); // idle | downloading | paused | done
  const [chunksUrls, setChunksUrls] = useState([]); // 已下载分片的 Blob URL 用于渲染

  const abortControllerRef = useRef(null);
  const dbRef = useRef(null);

  /**
   * ================================
   * IndexedDB 初始化
   * ================================
   */
  const openDB = () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("downloadDB", 1);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        db.createObjectStore("chunks");
      };
      request.onsuccess = (e) => resolve(e.target.result);
      request.onerror = (e) => reject(e);
    });
  };

  const saveChunk = (index, data) => {
    return new Promise((resolve) => {
      const tx = dbRef.current.transaction("chunks", "readwrite");
      tx.objectStore("chunks").put(data, index);
      tx.oncomplete = () => resolve();
    });
  };

  const getChunk = (index) => {
    return new Promise((resolve) => {
      const tx = dbRef.current.transaction("chunks", "readonly");
      const req = tx.objectStore("chunks").get(index);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    });
  };

  const clearChunks = () => {
    return new Promise((resolve) => {
      const tx = dbRef.current.transaction("chunks", "readwrite");
      tx.objectStore("chunks").clear();
      tx.oncomplete = () => resolve();
    });
  };

  /**
   * ================================
   * 获取文件信息
   * ================================
   */
  const getFileInfo = async (url) => {
    const res = await fetch(url, { method: "HEAD" });
    const size = Number(res.headers.get("Content-Length"));
    const acceptRanges = res.headers.get("Accept-Ranges");

    return {
      size,
      supportRange: acceptRanges === "bytes",
    };
  };

  /**
   * ================================
   * 创建分片任务
   * ================================
   */
  const createChunks = (totalSize) => {
    const chunks = [];
    let start = 0;
    let index = 0;

    while (start < totalSize) {
      const end = Math.min(start + CHUNK_SIZE - 1, totalSize - 1);
      chunks.push({ index, start, end });
      start = end + 1;
      index++;
    }

    return chunks;
  };

  /**
   * ================================
   * 下载单个分片
   * ================================
   */
  const downloadChunk = async (url, chunk, signal) => {
    const res = await fetch(url, {
      headers: { Range: `bytes=${chunk.start}-${chunk.end}` },
      signal,
    });

    if (res.status !== 206) throw new Error("Server does not support range");

    return await res.arrayBuffer();
  };

  /**
   * ================================
   * 并发下载调度（边下载边渲染）
   * onChunkReady: 每个分片完成后回调
   * ================================
   */
  const parallelDownload = async (url, chunks, signal, onChunkReady) => {
    let completed = 0;
    const queue = [...chunks];

    const worker = async () => {
      while (queue.length && !signal.aborted) {
        const chunk = queue.shift();

        const cached = await getChunk(chunk.index);
        let data;
        if (cached) {
          data = cached;
        } else {
          try {
            data = await downloadChunk(url, chunk, signal);
            await saveChunk(chunk.index, data);
          } catch (err) {
            if (!signal.aborted) queue.push(chunk);
            continue;
          }
        }

        completed++;
        setProgress(Math.floor((completed / chunks.length) * 100));
        onChunkReady?.(chunk.index, data);
      }
    };

    const workers = Array.from({ length: CONCURRENCY }, () => worker());
    await Promise.all(workers);
  };

  /**
   * ================================
   * 保存完整文件
   * ================================
   */
  const saveFile = (buffers, filename) => {
    const blob = new Blob(buffers);
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  /**
   * ================================
   * 开始下载
   * ================================
   */
  const startDownload = async () => {
    if (!url) return alert("请输入下载地址");

    setStatus("downloading");
    abortControllerRef.current = new AbortController();
    dbRef.current = await openDB();

    const info = await getFileInfo(url);
    if (!info.supportRange) return alert("服务器不支持分片下载");

    const chunks = createChunks(info.size);
    const buffers = [];

    setChunksUrls([]); // 清空上次渲染

    await parallelDownload(
      url,
      chunks,
      abortControllerRef.current.signal,
      (index, data) => {
        // 保存到最终 buffers（顺序可能乱，可在最后排序）
        buffers[index] = data;

        // 生成可渲染 Blob URL
        const blobUrl = URL.createObjectURL(new Blob([data]));
        setChunksUrls((prev) => [...prev, { index, url: blobUrl }]);
      }
    );

    if (abortControllerRef.current.signal.aborted) return;

    const filename = url.split("/").pop();
    saveFile(buffers, filename);

    await clearChunks();
    setStatus("done");
  };

  const pauseDownload = () => {
    abortControllerRef.current?.abort();
    setStatus("paused");
  };

  return (
    <div style={{ padding: 40, maxWidth: 700 }}>
      <h2>React 分片下载器（边下载边显示）</h2>

      <input
        style={{ width: "100%", padding: 10 }}
        placeholder="请输入下载地址"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

      <div style={{ marginTop: 20 }}>
        <button onClick={startDownload} disabled={status === "downloading"}>
          开始下载
        </button>

        <button
          onClick={pauseDownload}
          disabled={status !== "downloading"}
          style={{ marginLeft: 20 }}
        >
          暂停
        </button>
      </div>

      <div style={{ marginTop: 20 }}>
        <p>状态：{status}</p>
        <progress value={progress} max="100" style={{ width: "100%" }} />
        <p>{progress}%</p>
      </div>

      <div style={{ marginTop: 20 }}>
        <h3>已下载分片预览</h3>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {chunksUrls
            .sort((a, b) => a.index - b.index) // 按顺序渲染
            .map((chunk) => (
              <img
                key={chunk.index}
                src={chunk.url}
                alt={`chunk-${chunk.index}`}
                style={{ width: 150, margin: 5 }}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
