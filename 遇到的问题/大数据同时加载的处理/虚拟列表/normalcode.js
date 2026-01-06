import React, { useEffect, useRef, useState } from "react";

const ITEM_HEIGHT = 120;
const BUFFER = 3; // 上下缓冲区
const PAGE_SIZE = 20;

function createData(page) {
  return Array.from({ length: PAGE_SIZE }).map((_, i) => ({
    id: page * PAGE_SIZE + i,
    title: `标题 ${page * PAGE_SIZE + i}`,
    img: "https://picsum.photos/200/200?random=" + (page * PAGE_SIZE + i),
  }));
}

export default function VirtualListDemo() {
  const containerRef = useRef(null);

  const [list, setList] = useState([]);
  const [page, setPage] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  const containerHeight = window.innerHeight;
  const totalHeight = list.length * ITEM_HEIGHT;

  /** 加载数据（模拟接口） */
  const loadMore = () => {
    setTimeout(() => {
      setList((prev) => [...prev, ...createData(page)]);
      setPage((p) => p + 1);
    }, 500);
  };

  useEffect(() => {
    loadMore();
  }, []);

  /** 计算可视区 */
  const startIndex = Math.max(Math.floor(scrollTop / ITEM_HEIGHT) - BUFFER, 0);

  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / ITEM_HEIGHT) + BUFFER * 2,
    list.length
  );

  const visibleList = list.slice(startIndex, endIndex);

  /** 滚动处理 */
  const onScroll = (e) => {
    const top = e.target.scrollTop;
    setScrollTop(top);

    // 无限滚动
    if (top + containerHeight >= totalHeight - 200) {
      loadMore();
    }
  };

  return (
    <div ref={containerRef} className="container" onScroll={onScroll}>
      <div style={{ height: totalHeight }}>
        <div
          style={{
            transform: `translateY(${startIndex * ITEM_HEIGHT}px)`,
          }}
        >
          {visibleList.map((item) => (
            <ListItem key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
function ListItem({ item }) {
  const imgRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          img.src = item.img;
          observer.disconnect();
        }
      },
      {
        rootMargin: "100px",
      }
    );

    observer.observe(img);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="item">
      <img ref={imgRef} alt="" />
      <div className="text">
        <h4>{item.title}</h4>
        <p>这是移动端 H5 虚拟列表</p>
      </div>
    </div>
  );
}
