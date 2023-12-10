const input = require("../lib/get-string-from-file")(__dirname)("./input.txt");

function part1(input) {
  const races = formatInput(input);

  return races.map(addWaysToBeat).reduce((prod, race) => {
    return prod * race.waysToBeat;
  }, 1);
}
function part2(input) {
  const race = formatInput2(input);

  return addWaysToBeat(race).waysToBeat;
}

function formatInput(input) {
  const time = input.match(/(?<=Time:)[\s\d]+/g)[0].match(/\d+/g);
  const distance = input.match(/(?<=Distance:)[\s\d]+/g)[0].match(/\d+/g);
  return time.map((time, i) => ({ time, distance: distance[i] }));
}

function formatInput2(input) {
  return formatInput(input).reduce(
    (bigRace, race) => {
      bigRace.time += race.time;
      bigRace.distance += race.distance;
      return bigRace;
    },
    { time: "", distance: "" }
  );
}

function getDistance(timeHeld, raceTime) {
  const timeMoving = raceTime - timeHeld;
  return timeMoving * timeHeld;
}

function addWaysToBeat({ time, distance }) {
  let count = 0;
  for (let i = 0; i < time; i++) {
    if (getDistance(i, time) > distance) {
      count++;
    }
  }
  return { time, distance, waysToBeat: count };
}

console.log("part1: ", part1(input));
console.log("part2: ", part2(input));
