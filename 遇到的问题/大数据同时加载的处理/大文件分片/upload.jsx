import React, { useRef, useState } from "react";

/**
 * ================================
 * 配置
 * ================================
 */
const CHUNK_SIZE = 5 * 1024 * 1024; // 每片 5MB
const CONCURRENCY = 4; // 并发线程数

export default function FileUploader({ uploadUrl }) {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("idle"); // idle | uploading | paused | done

  const abortControllerRef = useRef(null);

  /**
   * ================================
   * 分片切割
   * ================================
   */
  const createChunks = (file) => {
    const chunks = [];
    let start = 0;
    let index = 0;

    while (start < file.size) {
      const end = Math.min(start + CHUNK_SIZE, file.size);
      chunks.push({
        index,
        start,
        end,
        blob: file.slice(start, end),
      });
      start = end;
      index++;
    }

    return chunks;
  };

  /**
   * ================================
   * 上传单片
   * ================================
   */
  const uploadChunk = async (chunk) => {
    const formData = new FormData();
    formData.append("file", chunk.blob);
    formData.append("index", chunk.index);
    formData.append("fileName", file.name);

    const res = await fetch(uploadUrl, {
      method: "POST",
      body: formData,
      signal: abortControllerRef.current.signal,
    });

    if (!res.ok) throw new Error(`Chunk ${chunk.index} 上传失败`);
    return true;
  };

  /**
   * ================================
   * 并发上传调度
   * ================================
   */
  const parallelUpload = async (chunks) => {
    let completed = 0;
    const queue = [...chunks];

    const worker = async () => {
      while (queue.length && !abortControllerRef.current.signal.aborted) {
        const chunk = queue.shift();
        try {
          await uploadChunk(chunk);
          completed++;
          setProgress(Math.floor((completed / chunks.length) * 100));
        } catch (err) {
          console.error("分片上传失败，重试:", chunk.index);
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
   * 开始上传
   * ================================
   */
  const startUpload = async () => {
    if (!file) return alert("请选择文件");

    setStatus("uploading");
    abortControllerRef.current = new AbortController();

    const chunks = createChunks(file);

    try {
      await parallelUpload(chunks);
      setStatus("done");
      alert("上传完成");
    } catch (err) {
      if (abortControllerRef.current.signal.aborted) {
        setStatus("paused");
        alert("上传已暂停");
      } else {
        setStatus("idle");
        alert("上传失败");
      }
    }
  };

  /**
   * ================================
   * 暂停上传
   * ================================
   */
  const pauseUpload = () => {
    abortControllerRef.current?.abort();
    setStatus("paused");
  };

  return (
    <div style={{ padding: 40, maxWidth: 700 }}>
      <h2>React 分片上传组件</h2>

      <input type="file" onChange={(e) => setFile(e.target.files[0])} />

      <div style={{ marginTop: 20 }}>
        <button onClick={startUpload} disabled={status === "uploading"}>
          开始上传
        </button>
        <button
          onClick={pauseUpload}
          disabled={status !== "uploading"}
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
