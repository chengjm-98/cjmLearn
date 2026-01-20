//基于indexdb+http range+pdf.js 实现的pdf文件切片下载渲染
export function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("pdf_chunk_cache", 1);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("chunks")) {
        db.createObjectStore("chunks", { keyPath: "key" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export function saveChunk(db, fileKey, index, buffer) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction("chunks", "readwrite");
    const store = tx.objectStore("chunks");

    store.put({
      key: `${fileKey}_${index}`,
      index,
      buffer,
    });

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export function getAllChunks(db, fileKey) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction("chunks", "readonly");
    const store = tx.objectStore("chunks");
    const req = store.getAll();

    req.onsuccess = () => {
      const list = req.result
        .filter((item) => item.key.startsWith(fileKey + "_"))
        .sort((a, b) => a.index - b.index);
      resolve(list);
    };

    req.onerror = () => reject(req.error);
  });
}

export function clearChunks(db, fileKey) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction("chunks", "readwrite");
    const store = tx.objectStore("chunks");
    const req = store.getAllKeys();

    req.onsuccess = () => {
      req.result.forEach((key) => {
        if (key.startsWith(fileKey + "_")) {
          store.delete(key);
        }
      });
      resolve();
    };

    req.onerror = () => reject(req.error);
  });
}

import React, { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.entry";
import { openDB, saveChunk, getAllChunks, clearChunks } from "./idb";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

/**
 * ================================
 * 配置
 * ================================
 */
const CHUNK_SIZE = 2 * 1024 * 1024; // 2MB
const CONCURRENCY = 3;

export default function PdfChunkDownloader({ url, fileKey }) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("idle"); // idle | downloading | paused | done
  const [totalSize, setTotalSize] = useState(0);

  const abortControllerRef = useRef(null);
  const receivedRef = useRef(0);
  const bufferListRef = useRef([]);
  const canvasRef = useRef(null);
  const dbRef = useRef(null);

  /**
   * ================================
   * 初始化 IndexedDB
   * ================================
   */
  useEffect(() => {
    openDB().then((db) => {
      dbRef.current = db;
      restoreFromDB(db);
    });
  }, []);

  /**
   * ================================
   * 获取文件大小
   * ================================
   */
  const getFileSize = async () => {
    const res = await fetch(url, { method: "HEAD" });
    const size = Number(res.headers.get("content-length"));
    setTotalSize(size);
    return size;
  };

  /**
   * ================================
   * 创建分片任务
   * ================================
   */
  const createChunks = (size, downloaded = 0) => {
    const chunks = [];
    let start = downloaded;
    let index = Math.floor(downloaded / CHUNK_SIZE);

    while (start < size) {
      const end = Math.min(start + CHUNK_SIZE - 1, size - 1);
      chunks.push({ index, start, end });
      start = end + 1;
      index++;
    }

    return chunks;
  };

  /**
   * ================================
   * 下载单片
   * ================================
   */
  const downloadChunk = async (chunk) => {
    const res = await fetch(url, {
      headers: {
        Range: `bytes=${chunk.start}-${chunk.end}`,
      },
      signal: abortControllerRef.current.signal,
    });

    if (![200, 206].includes(res.status)) {
      throw new Error("服务器不支持 Range");
    }

    return await res.arrayBuffer();
  };

  /**
   * ================================
   * 合并 Buffer
   * ================================
   */
  const mergeBuffers = () => {
    const total = receivedRef.current;
    const merged = new Uint8Array(total);

    let offset = 0;
    for (let buf of bufferListRef.current) {
      merged.set(new Uint8Array(buf), offset);
      offset += buf.byteLength;
    }

    return merged.buffer;
  };

  /**
   * ================================
   * 尝试渲染 PDF
   * ================================
   */
  const tryRenderPdf = async (buffer) => {
    try {
      const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 1.5 });

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({ canvasContext: ctx, viewport }).promise;
    } catch {
      // PDF 尚未完整，忽略解析错误
    }
  };

  /**
   * ================================
   * 从 IndexedDB 恢复数据
   * ================================
   */
  const restoreFromDB = async (db) => {
    const list = await getAllChunks(db, fileKey);
    if (!list.length) return;

    bufferListRef.current = list.map((item) => item.buffer);
    receivedRef.current = bufferListRef.current.reduce(
      (sum, buf) => sum + buf.byteLength,
      0,
    );

    const merged = mergeBuffers();
    கொள்ள渲染(merged);

    if (totalSize > 0) {
      setProgress(Math.floor((receivedRef.current / totalSize) * 100));
    }
  };

  const 渲染 = async (merged) => {
    await tryRenderPdf(merged);
  };

  /**
   * ================================
   * 并发下载调度
   * ================================
   */
  const parallelDownload = async (chunks) => {
    const queue = [...chunks];

    const worker = async () => {
      while (queue.length && !abortControllerRef.current.signal.aborted) {
        const chunk = queue.shift();

        try {
          const buffer = await downloadChunk(chunk);

          await saveChunk(dbRef.current, fileKey, chunk.index, buffer);

          bufferListRef.current.push(buffer);
          receivedRef.current += buffer.byteLength;

          const merged = mergeBuffers();
          await tryRenderPdf(merged);

          const percent = Math.floor((receivedRef.current / totalSize) * 100);
          setProgress(percent);
        } catch (err) {
          console.error("分片下载失败，重试:", chunk.index);
          queue.push(chunk);
        }
      }
    };

    const workers = [];
    for (let i = 0; i < CONCURRENCY; i++) {
      workers.push(worker());
    }

    await Promise.all(workers);
  };

  /**
   * ================================
   * 开始 / 继续下载
   * ================================
   */
  const startDownload = async () => {
    setStatus("downloading");
    abortControllerRef.current = new AbortController();

    const size = totalSize || (await getFileSize());

    const downloaded = receivedRef.current;
    const chunks = createChunks(size, downloaded);

    await parallelDownload(chunks);

    if (!abortControllerRef.current.signal.aborted) {
      setStatus("done");
      await clearChunks(dbRef.current, fileKey);
    }
  };

  /**
   * ================================
   * 暂停
   * ================================
   */
  const pauseDownload = () => {
    abortControllerRef.current?.abort();
    setStatus("paused");
  };

  return (
    <div style={{ padding: 40, maxWidth: 800 }}>
      <h2>PDF 分片下载 + IndexedDB 流式预览</h2>

      <button onClick={startDownload} disabled={status === "downloading"}>
        开始 / 继续下载
      </button>

      <button
        onClick={pauseDownload}
        disabled={status !== "downloading"}
        style={{ marginLeft: 20 }}
      >
        暂停
      </button>

      <p>状态：{status}</p>

      <progress value={progress} max="100" style={{ width: "100%" }} />
      <p>{progress}%</p>

      <canvas
        ref={canvasRef}
        style={{ marginTop: 20, border: "1px solid #ccc" }}
      />
    </div>
  );
}
