const input = require("../lib/get-string-from-file")(__dirname)("./input.txt");

function part1(input) {
  const cards = parseInput(input);
  return require("lodash").sum(
    cards
      .map(addCorrectPicks)
      .map(addMatchedWinners)
      .map(addPoints)
      .map((x) => x.points)
  );
}

function part2(input) {
  const cards = parseInput(input).map(addCorrectPicks).map(addMatchedWinners);
  const cardIndex = createCardIndex(cards);
  const allCards = getAllBonusCards(cards, cardIndex);
  return allCards?.length;
}

function parseInput(input) {
  const lines = input.split("\n");
  const cards = lines.reduce((cards, line) => {
    // card number
    const cardNumber = Number(line.match(/Card\s+(\d+):/)[1]);
    const [, winningNumbers, pickedNumbers] = line.match(
      /: ([\d\s]+)\s\|\s+([\d\s]+)/
    );
    return [
      ...cards,
      {
        cardNumber,
        winningNumbers: winningNumbers.split(/\s+/).map(Number),
        pickedNumbers: pickedNumbers.split(/\s+/).map(Number),
      },
    ];
  }, []);

  return cards;
}

function addCorrectPicks(card) {
  const correctPicks = card.pickedNumbers.filter((pickedNum) =>
    card.winningNumbers.includes(pickedNum)
  );
  return { ...card, correctPicks };
}

function addMatchedWinners(card) {
  const matchedWinners = card.winningNumbers.filter((winningNum) =>
    card.pickedNumbers.includes(winningNum)
  );

  return { ...card, matchedWinners };
}

function addPoints(card) {
  const points = card.correctPicks.length
    ? 2 ** (card.correctPicks.length - 1)
    : 0;
  console.log({ ...card, points });
  return { ...card, points };
}

function createCardIndex(cards) {
  return cards.reduce((index, card) => {
    index[card.cardNumber] = card;
    return index;
  }, {});
}

function getBonusCardsForCard(cardNumber, cardIndex) {
  const card = cardIndex[cardNumber];
  const newCards = [];
  for (
    let i = cardNumber + 1;
    i <= cardNumber + card.correctPicks.length;
    i++
  ) {
    if (cardIndex[i]) {
      newCards.push(cardIndex[i]);
    }
  }
  return newCards;
}

function getNewBonusCards(cards, cardIndex) {
  const newCards = [];

  cards.forEach((card) =>
    newCards.push(...getBonusCardsForCard(card.cardNumber, cardIndex))
  );

  return newCards;
}

function getAllBonusCards(cards, cardIndex) {
  const done = [];
  const toProcess = [...cards];

  while (toProcess.length) {
    const batch = toProcess.splice(0, 1000);
    const newCards = getNewBonusCards(batch, cardIndex);
    done.push(...batch);
    toProcess.push(...newCards);
  }

  return done;
}

console.log(part1(input));
console.log(part2(input));
