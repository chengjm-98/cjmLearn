/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2025-11-25 18:04:31
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2025-11-26 14:02:42
 * @FilePath: /cjmLearn/reactapp/my-app/src/App.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import AnimatedBarPage from "./pages/parentCom";
import { Suspense } from "react";
export default function App() {
  return (
    <Suspense fallback={<div>这里是fallback</div>}>
      <AnimatedBarPage></AnimatedBarPage>
    </Suspense>
  );
}
