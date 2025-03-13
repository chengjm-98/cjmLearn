/*
 * @Author: jamie jamie.cheng@yuansuan.com
 * @Date: 2025-03-11 11:13:44
 * @LastEditors: jamie jamie.cheng@yuansuan.com
 * @LastEditTime: 2025-03-13 11:34:17
 * @FilePath: \cjmLearn\ts\test.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// let suits = ["hearts", "spades", "clubs", "diamonds"];

// function pickCard(x: { suit: string; card: number }[]): number;
// function pickCard(x: number): { suit: string; card: number };
// function pickCard(x): any {
//   // Check to see if we're working with an object/array
//   // if so, they gave us the deck and we'll pick the card
//   if (typeof x == "object") {
//     let pickedCard = Math.floor(Math.random() * x.length);
//     return pickedCard;
//   }
//   // Otherwise just let them pick the card
//   else if (typeof x == "number") {
//     let pickedSuit = Math.floor(x / 13);
//     return { suit: suits[pickedSuit], card: x % 13 };
//   }
// }

// let myDeck = [
//   { suit: "diamonds", card: 2 },
//   { suit: "spades", card: 10 },
//   { suit: "hearts", card: 4 },
// ];
// let pickedCard1 = myDeck[pickCard(myDeck)];
// alert("card: " + pickedCard1.card + " of " + pickedCard1.suit);

// let pickedCard2 = pickCard(15);
// alert("card: " + pickedCard2.card + " of " + pickedCard2.suit);

let myDeck = (a: string): void => {
  console.log(a);
};
myDeck("hello");
