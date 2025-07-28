// import { useEffect } from "react";
import React from "react";

// const ChildCom = React.memo(({ name }: { name: { name: string } }) => {
//   console.log("子组件 render"); // 每次渲染都会执行
//   return (
//     <>
//       <div>ChildCom</div>
//       <div>{name.name}</div>
//     </>
//   );
// });
// export default ChildCom;
const ChildCom = React.memo(({ name }: { name: string }) => {
  console.log("子组件 render"); // 每次渲染都会执行
  return (
    <>
      <div>ChildCom</div>
      <div>{name}</div>
    </>
  );
});
export default ChildCom;

// const ChildCom = ({ name }: { name: string }) => {
//   console.log("子组件 render"); // 每次渲染都会执行
//   return (
//     <>
//       <div>ChildCom</div>
//       <div>{name}</div>
//     </>
//   );
// };
// export default ChildCom;
