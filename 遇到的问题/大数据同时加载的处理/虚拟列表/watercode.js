import React, { useEffect, useRef, useState } from "react";

const COLUMN_COUNT = 2;
const GAP = 8;
const BUFFER = 300; // 上下缓冲区 px
const ESTIMATE_HEIGHT = 200;

export default function WaterfallVirtualList() {
  const containerRef = useRef(null);

  const [data, setData] = useState([]); //纯数据
  const [positions, setPositions] = useState([]); //positions 是整套方案的「灵魂」一项对应一个 item 的 布局信息
  //   {
  //   top: number,
  //   left: number,
  //   width: number,
  //   height: number, // 先预估，后修正
  //   col: number     // 所在列
  // }

  const [visibleList, setVisibleList] = useState([]); //展示在屏幕上的item

  const columnHeights = useRef(new Array(COLUMN_COUNT).fill(0)); //[ 当前第0列高度, 当前第1列高度 ]

  const loadingRef = useRef(false);

  /* 模拟接口 */
  const fetchData = async () => {
    if (loadingRef.current) return;
    loadingRef.current = true;

    await new Promise((r) => setTimeout(r, 800));

    const newData = Array.from({ length: 20 }).map((_, i) => ({
      id: data.length + i,
      img: `https://picsum.photos/300/${
        200 + Math.floor(Math.random() * 200)
      }?random=${Date.now() + i}`,
    }));

    setData((prev) => [...prev, ...newData]);
    loadingRef.current = false;
  };

  /* 初始化加载 */
  useEffect(() => {
    fetchData();
  }, []);

  /* 计算瀑布流布局 */
  //只要data发生变化，就为新增数据计算瀑布流位置
  useEffect(() => {
    const containerWidth = containerRef.current.clientWidth;
    const columnWidth =
      (containerWidth - GAP * (COLUMN_COUNT - 1)) / COLUMN_COUNT; //总宽度减去间距，平均分给每一列;

    const newPositions = [...positions];

    for (let i = newPositions.length; i < data.length; i++) {
      const minCol = columnHeights.current.indexOf(
        Math.min(...columnHeights.current)
      );

      const top = columnHeights.current[minCol];
      const left = minCol * (columnWidth + GAP);

      newPositions[i] = {
        top,
        left,
        width: columnWidth,
        height: ESTIMATE_HEIGHT,
        col: minCol,
      };

      columnHeights.current[minCol] += ESTIMATE_HEIGHT + GAP;
    }

    setPositions(newPositions);
  }, [data]);

  /* 虚拟滚动 */
  useEffect(() => {
    const el = containerRef.current;

    const onScroll = () => {
      const scrollTop = el.scrollTop;
      const viewHeight = el.clientHeight;

      const visible = positions.filter((pos) => {
        return (
          pos.top + pos.height > scrollTop - BUFFER &&
          pos.top < scrollTop + viewHeight + BUFFER
        );
      });

      setVisibleList(visible);

      // 无限滚动触底
      if (scrollTop + viewHeight > el.scrollHeight - 300) {
        fetchData();
      }
    };

    el.addEventListener("scroll", onScroll);
    onScroll();

    return () => el.removeEventListener("scroll", onScroll);
  }, [positions]);

  /* 图片加载完成后修正高度 */ //动态高度修正
  const onImageLoad = (index, img) => {
    const realHeight =
      (img.naturalHeight / img.naturalWidth) * positions[index].width;

    const diff = realHeight - positions[index].height;
    if (diff === 0) return;

    positions[index].height = realHeight;

    // 修正当前列后续 item
    for (let i = index + 1; i < positions.length; i++) {
      if (positions[i].col === positions[index].col) {
        positions[i].top += diff;
      }
    }

    columnHeights.current[positions[index].col] += diff;
    setPositions([...positions]);
  };

  const containerHeight = Math.max(...columnHeights.current);

  return (
    <div
      ref={containerRef}
      style={{
        height: "100vh",
        overflowY: "auto",
        position: "relative",
      }}
    >
      <div
        style={{
          height: containerHeight,
          position: "relative",
        }}
      >
        {visibleList.map((pos) => {
          const item = data[positions.indexOf(pos)];
          return (
            <Item
              key={item.id}
              item={item}
              style={pos}
              onLoad={(img) => onImageLoad(item.id, img)}
            />
          );
        })}
      </div>
    </div>
  );
}
