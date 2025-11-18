import { useState, useRef, useEffect } from "react";
import { Button } from "antd";

export const ParentCom = () => {
  const fakeApi = () => {
    throw new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve("加载完成");
      }, 2000);
    }).then((res) => {
      return res;
    });
  };
  const data = fakeApi(); // ← 渲染中直接 throw
  return (
    <>
      <Button>加载完成{data}</Button>
    </>
  );
};
