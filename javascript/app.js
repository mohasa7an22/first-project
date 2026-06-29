// variables

const suits = ["hearts", "spades", "clubs", "diamonds"];
const cards = [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"];
let deck = [];
let playerHand = [];
let dealerHand = [];
let balance = 500;
let bet = 0;
let stage = "betting";
let wins = 0;

// functions

function shuffle() {
  for (let i = 0; i < deck.length; i++) {
    const newShuffle = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[newShuffle]] = [deck[newShuffle], deck[i]];
  }
}
function createDeck() {
  deck = [];
  for (let symbol of suits)
    for (let number of cards) deck.push({ symbol, number });
  shuffle();
}

function draw() {
  const drawCards = deck.pop();
  updateCards();
  return drawCards;
}
function updateCards() {
  document.getElementById("cards").textContent = deck.length;
}
function cardValue(count) {
  if (count.number === "A") {
    return 11;
  }
  if (["J", "Q", "K"].includes(count.number)) return 10;
  return count.number;
}

function finalScore(hand) {
  let score = 0,
    aces = 0;
  for (let count of hand) {
    score += cardValue(count);
    if (count.number === "A") aces++;
  }
  while (score > 21 && aces > 0) {
    score -= 10;
    aces--;
  }
  return score;
}

function setStatus(message) {
  document.querySelector(".status").textContent = message;
}

function blackJackHand(hand) {
    if(hand.length !== 2){
        return false
    }
    const hasAce = hand.some(count => count.number === 'A')
    const hasTen = hand.some(count => cardValue(count) === 10)
    return hasAce && hasTen
}

function startGame() {
  if (bet === 0) {
    return setStatus("Place your bet");
  }
  if (deck.length < 12) createDeck();
  playerHand = [];
  dealerHand = [];
  [playerHand, dealerHand, playerHand, dealerHand].forEach((hand) =>
    hand.push(draw()),
  );
  stage = "playing";

  const playerBj = blackJackHand(playerHand)
  const dealerBj = blackJackHand(dealerHand)

  if (playerBj && dealerBj){
    setStatus('you both have a BlackJack it is a tie')
  }

  else if (playerBj){
    setStatus('You have a blackjack you win')
  }
  else if(dealerBj){
    setStatus('Dealer has BlackJack the house always wins')
  }
  else{
    setStatus('hit or stay') 
  }
}
function hitMe(){
    if (stage !== 'playing'){
        return false
    }
    playerHand.push(draw())
    if (finalScore(playerHand) > 21){
        setStatus('You busted you lose')
    }
}



//init and console checking
createDeck();
bet = 300;
startGame();
console.log("playerhand", playerHand);
console.log("dealer:", dealerHand);
console.log(deck);
console.log(deck.length);
console.log(stage);

