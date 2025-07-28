import { useState, useRef } from "react";
import ChildCom from "../childCom";
import { Button } from "antd";
export const ParentCom = () => {
  const [data, setData] = useState("cjm");
  const [count, setCount] = useState(0);
  return (
    <>
      <ChildCom name={data} />
      <Button onClick={() => setCount(count + 1)}>change</Button>
    </>
  );
};
