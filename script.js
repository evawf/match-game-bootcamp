// boardSize has to be an even number
const boardSize = 4;
const board = [];
let firstCard = null;
let firstCardElement;
let deck;
let outputMsg = "";
let numOfMatch = 0;

const outputMsgDiv = document.createElement("div");
outputMsgDiv.classList.add("msgDiv");
document.body.appendChild(outputMsgDiv);

const generateMsg = (msg) => {
  let message = "Not a Match! Please try again!";
  outputMsgDiv.style.color = "red";
  if (msg === "match") {
    message = "It's a match!";
    outputMsgDiv.style.color = "green";
  }
  return message;
};

const squareClick = (cardElement, row, column) => {
  const clickedCard = board[row][column];
  // the user already clicked on this square
  if (cardElement.innerText !== "") {
    return;
  }
  // first turn
  if (firstCard === null) {
    firstCard = clickedCard;
    // turn this card over
    cardElement.innerText = firstCard.name;
    // hold onto this for later when it may not match
    firstCardElement = cardElement;
    // second turn
  } else {
    if (
      clickedCard.name === firstCard.name &&
      clickedCard.suit === firstCard.suit
    ) {
      outputMsg = generateMsg("match");
      numOfMatch += 1;
      // turn this card over
      cardElement.innerText = clickedCard.name;
      cardElement.style.backgroundColor = "green";
      firstCardElement.style.backgroundColor = "green";
    } else {
      outputMsg = generateMsg();
      // turn this card back over
      cardElement.innerText = clickedCard.name;
      setTimeout(() => {
        cardElement.innerText = "";
      }, 500);
      firstCardElement.innerText = "";
    }
    // reset the first card
    firstCard = null;
  }

  if (numOfMatch === 8) outputMsg = "Congrats! You are the winner.";
  outputMsgDiv.innerText = outputMsg;
};

// create all the board elements that will go on the screen
// return the built board
const buildBoardElements = (board) => {
  const boardElement = document.createElement("div");
  boardElement.classList.add("board");
  for (let i = 0; i < board.length; i += 1) {
    const row = board[i];
    const rowElement = document.createElement("div");
    rowElement.classList.add("row");
    for (let j = 0; j < row.length; j += 1) {
      const square = document.createElement("div");
      square.classList.add("square");
      square.addEventListener("click", (event) => {
        // we will want to pass in the card element so
        // that we can change how it looks on screen, i.e.,
        // "turn the card over"
        squareClick(event.currentTarget, i, j);
      });
      rowElement.appendChild(square);
    }
    boardElement.appendChild(rowElement);
  }
  return boardElement;
};

const makeDeck = () => {
  const newDeck = [];
  const suits = ["hearts", "diamonds", "clubs", "spades"];
  const suitsSymbol = ["♥︎", "♦︎", "♣︎", "♠︎"];
  for (let suitIndex = 0; suitIndex < suits.length; suitIndex += 1) {
    const currentSuit = suits[suitIndex];
    const currentSymbol = suitsSymbol[suitIndex];
    // rank 1-13
    for (let rankCounter = 1; rankCounter <= 13; rankCounter += 1) {
      // Convert rankCounter to string
      let cardName = `${rankCounter}`;
      // 1, 11, 12 ,13
      if (cardName === "1") {
        cardName = "ace";
      } else if (cardName === "11") {
        cardName = "jack";
      } else if (cardName === "12") {
        cardName = "queen";
      } else if (cardName === "13") {
        cardName = "king";
      }
      // make a single card object variable
      const card = {
        name: cardName,
        suit: currentSuit,
        suitSymbol: currentSymbol,
        rank: rankCounter,
      };
      // add the card to the deck
      newDeck.push(card);
      newDeck.push(card);
    }
  }
  return newDeck;
};

// Shuffle an array of cards
const getRandomIndex = (max) => Math.floor(Math.random() * max);
const shuffleCards = (cards) => {
  for (let currentIndex = 0; currentIndex < cards.length; currentIndex += 1) {
    const randomIndex = getRandomIndex(cards.length);
    const randomCard = cards[randomIndex];
    const currentCard = cards[currentIndex];
    cards[currentIndex] = randomCard;
    cards[randomIndex] = currentCard;
  }
  // Return the shuffled deck
  return cards;
};

// Make a 4x4 board with cards but don't show content in html
const initGame = () => {
  const doubleDeck = makeDeck();
  let deckSubset = doubleDeck.slice(0, boardSize * boardSize);
  deck = shuffleCards(deckSubset);
  for (let i = 0; i < boardSize; i += 1) {
    board.push([]);
    for (let j = 0; j < boardSize; j += 1) {
      board[i].push(deck.pop());
    }
  }
  const boardEl = buildBoardElements(board);
  document.body.appendChild(boardEl);
};

initGame();
