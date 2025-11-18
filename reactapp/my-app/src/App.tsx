import { ParentCom } from "./pages/parentCom";
import { Suspense } from "react";
export default function App() {
  return (
    <Suspense fallback={<div>这里是fallback</div>}>
      <ParentCom></ParentCom>
    </Suspense>
  );
}
