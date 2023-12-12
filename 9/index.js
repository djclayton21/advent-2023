const input = require("../lib/get-string-from-file")(__dirname)("./input.txt");
const histories = parseInput(input);
function parseInput(input) {
  return input.split("\n").map((line) => line.split(" ").map(Number));
}

function extrapolate(history) {
  const lastNum = history.slice(-1);
  let nextHistory = history;

  while (true) {
    nextHistory = getNextHistory(nextHistory);
    lastNum.unshift(nextHistory.at(-1));

    if (nextHistory.every((num) => num === 0)) {
      return lastNum.reduce(sum);
    }
  }
}

function instrapolate(history) {
  const firstNum = history.slice(0, 1);
  let nextHistory = history;

  while (true) {
    nextHistory = getNextHistory(nextHistory);
    firstNum.unshift(nextHistory[0]);

    if (nextHistory.every((num) => num === 0)) {
      return firstNum.reduce(minus);
    }
  }
}

function getNextHistory(history) {
  const nextHistory = [];

  for (let i = 1; i < history.length; i++) {
    nextHistory.push(history[i] - history[i - 1]);
  }
  return nextHistory;
}

function sum(a, b) {
  return a + b;
}

function minus(a, b) {
  return b - a;
}

function part1() {
  return histories.map(extrapolate).reduce(sum);
}

function part2() {
  return histories.map(instrapolate).reduce(sum);
}

console.log("part1: ", part1());
console.log("part2: ", part2());
