//  cached elements
const btnStart = document.querySelector("#btnStart");
const btnHit = document.querySelector("#btnHit");
const btnStay = document.querySelector("#btnStay");
const btnAllIn = document.querySelector('#allIn')
const five = document.querySelector("#five");
const ten = document.querySelector("#ten");
const twoFive = document.querySelector("#twoFive");
const fifty = document.querySelector("#Fifty");
const btnClearBet = document.querySelector("#btnClearBet");
const betBtn = document.querySelectorAll(".bet-btn");
const splitBtn = document.querySelector("#splitBtn");

console.log(btnStart);
console.log(btnHit);
console.log(btnStay);
console.log(splitBtn);
console.log(btnAllIn)
console.log(five);
console.log(ten);
console.log(twoFive);
console.log(fifty);
console.log(btnClearBet);
console.log(betBtn);

// variables

const suits = ["hearts", "spades", "clubs", "diamonds"];
const cards = [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"];
const icons = { hearts: "♥️", spades: "♠️", clubs: "♣️", diamonds: "♦️" };
const redCard = ["hearts", "diamonds"];
let deck = [];
let playerHand = [];
let dealerHand = [];
let split = [];
let splitHand = false;
let balance = 500;
let bet = 0;
let maxBet = 0
let stage = "betting";
let wins = 0;

// functions

function shuffle() {
  for (let i = deck.length - 1; i > 0; i--) {
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
  if (hand.length !== 2) {
    return false;
  }
  const hasAce = hand.some((count) => count.number === "A");
  const hasTen = hand.some((count) => cardValue(count) === 10);
  return hasAce && hasTen;
}

function playingSplit() {
  if (stage !== "playing") return;
  if (playerHand.length !== 2) return;
  if (cardValue(playerHand[0]) !== cardValue(playerHand[1])) {
    setStatus("You can only split matching cards");
    return;
  }
  if (balance < bet) {
    setStatus("You do not have enough balance to split");
    return;
  }

  balance -= bet;
  maxBet = bet*2
  split = [playerHand.pop()];
  playerHand.push(draw());
  split.push(draw());
  splitHand = true;
  render(true);
  setStatus("Playing on first split - Hit or Stay");
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
  render(true);
  const playerBj = blackJackHand(playerHand);
  const dealerBj = blackJackHand(dealerHand);

  if (playerBj && dealerBj) {
    render(false);
    setStatus("You both have a BlackJack it is a tie");
    endRound(0);
  } else if (playerBj) {
    setStatus("You have a blackjack you win");
    endRound(1, true);
  } else if (dealerBj) {
    render(false);
    setStatus("Dealer has BlackJack the house always wins");
    endRound(-1);
  } else {
    setStatus("Hit or Stay");
  }
}

function bustedHand() {
  if (finalScore(playerHand) > 21) {
    setStatus("You busted");
    endRound(-1);
  } else {
    render(true);
  }
}

function hitMe() {
  if (stage !== "playing") {
    return;
  }
  playerHand.push(draw());
  bustedHand();
}

function stay() {
  if (stage !== "playing") return;
  if (splitHand) {
    setStatus("Playing on second split - Hit or Stay");
    playerHand = split;
    split = [];
    splitHand = false;
    render(true);
    return;
  }
  render(false)
  dealerPlay();
}
function clearBet() {
  if (stage !== "betting") return;
  balance += bet;
  bet = 0;
  setStatus("Cleared bet");
  render();
}
function dealerPlay() {
  if (finalScore(dealerHand) < 17) {
    dealerHand.push(draw());
    return dealerPlay();
  }

  const playerScore = finalScore(playerHand);
  const dealerScore = finalScore(dealerHand);

  if (dealerScore > 21 || playerScore > dealerScore) {
    setStatus(`You won ${bet}P!`);
    endRound(1);
  } else if (playerScore < dealerScore) {
    setStatus("The house always wins ");
    endRound(-1);
  } else {
    setStatus("It is a tie");
    endRound(0);
  }
  render();
}

function endRound(results, blackJackHand = false) {
  stage = "betting";
  let totalBet
  if (totalBet > 0){
    totalBet = maxBet
  }
  else{
    totalBet = bet
  }
  if (results === 1) {
    if (blackJackHand) {
      balance += totalBet * 3;
    } else {
      balance += totalBet * 2;
      wins++;
    }
  } else if (results === 0) {
    balance += totalBet;
  }
  bet = 0;
  maxBet = 0
  split = [];
  splitHand = false;
  if (balance <= 0) {
    let time = 5;
    setStatus(`out of chips restarting in ${time}`);
    const timer = setInterval(() => {
      time--;
      setStatus(`out of chips restarting in ${time}`);
      if (time <= 0) {
        clearInterval(timer);
        location.reload();
      }
    }, 1000);
  }
  render();
}

function dealCards(hand, hide) {
  let msg = "";
  for (let i = 0; i < hand.length; i++) {
    const crd = hand[i];
    if (hide && i === 1) {
      msg += `<li><article class ="card-back" aria-label="hidden card"></article></li>`;
    } else {
      let cardColor;
      if (redCard.includes(crd.symbol)) {
        cardColor = "red";
      } else {
        cardColor = "black";
      }
      msg += `<li>
    <article class="card ${cardColor}" aria-label="${crd.number} of ${crd.symbol}">
    <span class="corner"> ${crd.number} ${icons[crd.symbol]} </span>
    </article>
  </li>`;
    }
  }
  return msg;
}
function placeBet(points) {
  if (stage !== "betting") return;

  if (points > balance) {
    setStatus("Not enough points");
    return;
  }
  bet += points;
  balance -= points;
  setStatus(`Bet: ${bet}P - click start`);
  render();
}
function allIn (){
  if (stage !== 'betting') return
  if (balance <= 0){
    setStatus('You used all your balance')
    return
  }
  bet += balance
  balance = 0
  setStatus (`All in bet: ${bet}P - click start`)
  render()
}
function render(dealerHidden = false) {
  let dealerScoreText;
  if (dealerHidden) {
    dealerScoreText = "?";
  } else {
    dealerScoreText = finalScore(dealerHand);
  }

  let splitCards = "";
  if (split.length > 0) {
    splitCards = `
    <section class="hand">
    <h3> Split hand <span> (${finalScore(split)})</span></h3>
    <ul role="list">${dealCards(split, false)}</ul>
    </section>
    
    `;
  }

  document.getElementById("player").innerHTML = `
  <section class = "hand">
  <h3> Your Hand <span> (${finalScore(playerHand)})</span></h3>
  <ul role = "list"> ${dealCards(playerHand, false)}</ul>
  </section>
  ${splitCards}
  <section class ="hand">
  <h3> Dealers hand <span> (${dealerScoreText}) </span> </h3>
  <ul role = "list"> ${dealCards(dealerHand, dealerHidden)}</ul>
  </section>
  <footer class= "stats">
  <p> Balance: <strong> ${balance}P</strong></p>
  <p> Bet: <strong> ${bet}P</strong></p>
  <p> Wins: <strong> ${wins}P</strong></p>
  </footer>
  `;
  const phase = stage === "playing";
  const splitAllow =
    phase &&
    playerHand.length === 2 &&
    cardValue(playerHand[0]) === cardValue(playerHand[1]) &&
    balance >= bet &&
    !splitHand;
  btnStart.disabled = phase;
  btnHit.disabled = !phase;
  btnStay.disabled = !phase;
  btnAllIn.disabled = phase || balance <=0
  splitBtn.disabled = !splitAllow;
}
// event listeners

btnStart.addEventListener("click", startGame);
btnHit.addEventListener("click", hitMe);
btnStay.addEventListener("click", stay);
btnClearBet.addEventListener("click", clearBet);
btnAllIn.addEventListener('click', allIn)
splitBtn.addEventListener("click", playingSplit);
five.addEventListener("click", () => placeBet(5));
ten.addEventListener("click", () => placeBet(10));
twoFive.addEventListener("click", () => placeBet(25));
fifty.addEventListener("click", () => placeBet(50));

//init and console checking
createDeck();
render();
setStatus("Place a bet and start");

