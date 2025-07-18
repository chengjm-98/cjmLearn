async function testPromise() {
  const a = await awaitfunction();
  const b = 11;
  return b;
}
function awaitfunction() {
  return 111;
}
console.log(testPromise());
