const assert = require("node:assert");
const input = require("../lib/get-string-from-file")(__dirname)("./input.txt");
const input2 = require("../lib/get-string-from-file")(__dirname)(
  "./input2.txt"
);
const types = [
  {
    name: "five of a kind",
    value: 7,
    test: (sortedHand) => !!sortedHand.match(/(.)\1{4}/g)?.length,
  },
  {
    name: "four of a kind",
    value: 6,
    test: (sortedHand) => !!sortedHand.match(/(.)\1{3}/g)?.length,
  },
  {
    name: "full house",
    value: 5,
    test: (sortedHand) => !!sortedHand.match(/(.)\1{2}(.)\2{1}/g)?.length,
  },
  {
    name: "three of a kind",
    value: 4,
    test: (sortedHand) => !!sortedHand.match(/(.)\1{2}/g)?.length,
  },
  {
    name: "two pair",
    value: 3,
    test: (sortedHand) => !!sortedHand.match(/(.)\1{1}(.)\2{1}/g)?.length,
  },
  {
    name: "one pair",
    value: 2,
    test: (sortedHand) => !!sortedHand.match(/(.)\1{1}/g)?.length,
  },
  { name: "high card", value: 1, test: () => true },
];

const cards = {
  A: 13,
  K: 12,
  Q: 11,
  J: 10,
  T: 9,
  9: 8,
  8: 7,
  7: 6,
  6: 5,
  5: 4,
  4: 3,
  3: 2,
  2: 1,
};

const cardsJokers = {
  A: 13,
  K: 12,
  Q: 11,
  T: 10,
  9: 9,
  8: 8,
  7: 7,
  6: 6,
  5: 5,
  4: 4,
  3: 3,
  2: 2,
  J: 1,
};

function parseInput(input) {
  return input.split("\n").map((line) => {
    const [cards, bid] = line.split(" ");
    return { cards, bid: Number(bid) };
  });
}

function sortHand(hand, wildCard) {
  const freq = hand.split("").reduce((freq, card) => {
    freq[card] = freq[card] ? freq[card] + 1 : 1;
    return freq;
  }, {});

  let ordered = Object.entries(freq).sort(
    ([, freqA], [, freqB]) => freqB - freqA
  );

  if (wildCard) {
    const wildCount = freq[wildCard];
    if (wildCount && wildCount !== 5) {
      ordered = ordered.filter(([card]) => card !== wildCard);
      ordered[0][1] += wildCount;
    }
  }

  let sorted = "";

  ordered.forEach(([card, freq]) => {
    sorted += Array(freq).fill(card).join("");
  });

  return sorted;
}

function scoreHand(hand, wildCard) {
  const sorted = sortHand(hand, wildCard);
  for (const type of types) {
    if (type.test(sorted))
      return { type: type.name, score: type.value, sorted };
  }
}

function breakTie(handA, handB, cards) {
  for (let i = 0; i < handA.length; i++) {
    if (cards[handA[i]] < cards[handB[i]]) return 1;
    if (cards[handA[i]] > cards[handB[i]]) return -1;
  }

  return 0;
}

function compareHand(a, b, cards) {
  const byScore = b.score - a.score;

  return byScore || breakTie(a.cards, b.cards, cards);
}

function part1(input) {
  const hands = parseInput(input);
  const scoredHands = hands.map((hand) => ({
    ...hand,
    ...scoreHand(hand.cards),
  }));

  const ranked = scoredHands
    .sort((a, b) => compareHand(a, b, cards))
    .map((hand, i) => ({
      ...hand,
      rank: hands.length - i,
      winnings: hand.bid * (hands.length - i),
    }));
  return ranked.reduce((total, { winnings }) => total + winnings, 0);
}

function part2(input) {
  const hands = parseInput(input);
  const scoredHands = hands.map((hand) => ({
    ...hand,
    ...scoreHand(hand.cards, "J"),
  }));

  const ranked = scoredHands
    .sort((a, b) => compareHand(a, b, cardsJokers))
    .map((hand, i) => ({
      ...hand,
      rank: hands.length - i,
      winnings: hand.bid * (hands.length - i),
    }));

  return ranked.reduce((total, { winnings }) => total + winnings, 0);
}

console.log("part1: ", part1(input));
// assert(253638586 === part1(input));
console.log("part2: ", part2(input));
