import { useState, useRef, useEffect } from "react";
import { Button } from "antd";
export const ParentCom = () => {
  const [count, setCount] = useState(0);
  const asyncFun = async()=>{
   return 11;''
  }
  useEffect(()=>{
    const myFun = async()=>{
  const data = await asyncFun();
   console.log('看一下async的返回值',data)
    
    }
  myFun();
   
  },[])
  return (
    <>
      <Button onClick={() => setCount(count + 1)}>change</Button>
    </>
  );
};
