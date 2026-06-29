const suits = ['hearts', 'spades', 'clubs', 'diamonds']
const cards = [2 , 3 , 4 , 5 ,6 ,7 ,8 ,9 ,10 ,'J' , 'Q' , 'K', 'A']
let deck = [], playerHand = [], dealerHand = []
let balance = 500

function createDeck() {
  deck = [];
  for (let symbol of suits)
    for (let number of cards)
      deck.push({ symbol, number });
  }
createDeck()
console.log(deck)
console.log(deck.length)