const { sum } = require("lodash");
function part1(input) {
  const games = parseInput(input);
  return games.reduce((sum, { game, pulls }) => {
    const isGamePossible = pulls.every(isPullPossible);

    if (isGamePossible) {
      console.log(game, pulls);
      sum += game;
    }
    return sum;
  }, 0);
}

function part2(input) {
  const games = parseInput(input);

  const powers = games.map(getPower);

  return sum(powers);
}

function getPower(game) {
  const mins = game.pulls.reduce(
    (min, pull) => {
      Object.entries(pull).forEach(([key, value]) => {
        if (pull[key] > min[key]) {
          min[key] = value;
        }
      });
      return min;
    },
    { red: 0, blue: 0, green: 0 }
  );
  console.log(mins);
  const { red, blue, green } = mins;
  return red * blue * green;
}

function addPower(game) {
  return { ...game, power: game.red + game.blue + game.green };
}

function isPullPossible({ red, green, blue }) {
  return red <= 12 && green <= 13 && blue <= 14;
}

function parseInput(input) {
  const lines = input.split("\n");
  return lines.map((line) => {
    const [rawGame, rawPulls] = line.split(":");
    const game = Number(rawGame.match(/Game (\d+)/)[1]);
    const pulls = rawPulls.split(";").map((pull) => {
      const red = pull.match(/(\d+) red/)?.[1] ?? 0;
      const blue = pull.match(/(\d+) blue/)?.[1] ?? 0;
      const green = pull.match(/(\d+) green/)?.[1] ?? 0;

      return { red: Number(red), blue: Number(blue), green: Number(green) };
    });

    return {
      game,
      pulls,
    };
  });
}

console.log(part2(require("./input")));
