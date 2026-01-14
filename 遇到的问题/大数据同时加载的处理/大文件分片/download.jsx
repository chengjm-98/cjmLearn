import React, { useRef, useState } from "react";

/**
 * ================================
 * 基本配置
 * ================================
 */
const CHUNK_SIZE = 5 * 1024 * 1024; // 分片大小，这里设置为 5MB

const CONCURRENCY = 6; // 并发线程数

export default function FileDownloader() {
  const [url, setUrl] = useState("");
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("idle"); // idle | downloading | paused | done

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
      //浏览器创建一个名为downloadDB的数据库，版本号为1

      //在数据库里面创建一个名为chunks的对象仓库，相当于一个表
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        db.createObjectStore("chunks");
      };

      request.onsuccess = (e) => resolve(e.target.result);
      request.onerror = (e) => reject(e);
    });
  };

  /**
   * ================================
   * 获取文件信息，查询文件大小和是否支持断点续传
   * 这里使用了 HEAD 请求，只获取文件的元数据，不下载文件内容
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
      headers: {
        Range: `bytes=${chunk.start}-${chunk.end}`,
      },
      signal,
    });

    if (res.status !== 206) {
      //下载失败，抛出错误
      throw new Error("Server does not support range");
    }

    return await res.arrayBuffer();
  };

  /**
   * ================================
   * IndexedDB 操作
   * ================================
   */
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
   * 并发下载调度
   * url：下载地址
   * chunks：分片任务列表
   * signal：取消信号
   * 返回一个 Promise，当所有分片下载完成后，返回一个包含所有分片数据的数组
   * ================================
   */
  const parallelDownload = async (url, chunks, signal) => {
    const results = new Array(chunks.length);
    let completed = 0; //已完成的分片数

    const queue = [...chunks];

    const worker = async () => {
      while (queue.length && !signal.aborted) {
        const chunk = queue.shift();

        // 已下载过的分片直接读取
        const cached = await getChunk(chunk.index);
        if (cached) {
          results[chunk.index] = cached;
          completed++;
          setProgress(Math.floor((completed / chunks.length) * 100));
          continue;
        }

        try {
          const data = await downloadChunk(url, chunk, signal);
          await saveChunk(chunk.index, data); //存到indexdb里面

          results[chunk.index] = data;
          completed++;
          setProgress(Math.floor((completed / chunks.length) * 100));
        } catch (err) {
          if (!signal.aborted) {
            console.error("Chunk failed, retry:", chunk.index);
            queue.push(chunk);
          }
        }
      }
    };

    const workers = [];
    for (let i = 0; i < CONCURRENCY; i++) {
      workers.push(worker());
    }

    await Promise.all(workers);
    return results;
  };

  /**
   * ================================
   * 保存文件
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

    const info = await getFileInfo(url); //获取文件信息，包括大小和是否支持断点续传
    if (!info.supportRange) {
      alert("服务器不支持分片下载");
      return;
    }

    const chunks = createChunks(info.size); //创建分片任务，返回一个分好的片的列表

    const buffers = await parallelDownload(
      url,
      chunks,
      abortControllerRef.current.signal
    );

    if (abortControllerRef.current.signal.aborted) return;

    const filename = url.split("/").pop();
    saveFile(buffers, filename);

    await clearChunks();

    setStatus("done");
  };

  /**
   * ================================
   * 暂停下载
   * ================================
   */
  const pauseDownload = () => {
    abortControllerRef.current?.abort();
    setStatus("paused");
  };

  return (
    <div style={{ padding: 40, maxWidth: 700 }}>
      <h2>React 分片下载器</h2>

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
    </div>
  );
}
