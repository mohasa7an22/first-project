// variables

const suits = ["hearts", "spades", "clubs", "diamonds"];
const cards = [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"];
let deck = [],
  playerHand = [],
  dealerHand = [];
let balance = 500;
let bet = 0;

// functions

function shuffle() {
  for (let i = 0; i < deck.length;  i++) {
    const newShuffle = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[newShuffle]] = [deck[newShuffle], deck[i]]
  }
}
function createDeck() {
  deck = [];
  for (let symbol of suits)
    for (let number of cards) 
        deck.push({ symbol, number });
    shuffle();
}


createDeck();
console.log(deck);
console.log(deck.length);
