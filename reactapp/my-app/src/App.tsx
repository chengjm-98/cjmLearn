let guest = 0;

function Cup() {
  // Bad：正在更改预先存在的变量！
  guest = guest + 1;
  console.log("Cup", guest);
  return <h2>Tea cup for guest #{guest}</h2>;
}

export default function App() {
  return (
    <>
      <Cup />
      <Cup />
      <Cup />
    </>
  );
}
