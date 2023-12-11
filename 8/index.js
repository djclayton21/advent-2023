const input = require("../lib/get-string-from-file")(__dirname)("./input.txt");

const { directions, nodeIndex } = parseInput(input);

function parseInput(input) {
  const directions = input.match(/[LR]+/)[0];
  const lines = input.match(/[A-Z]{3}.*\(.*\)/g);
  const nodeIndex = lines.reduce((nodeIndex, line) => {
    const [node, L, R] = line.match(/[A-Z]{3}/g);
    nodeIndex[node] = { L, R };
    return nodeIndex;
  }, {});

  return { directions, nodeIndex };
}

function part1() {
  return shortestPath("AAA", "ZZZ");
}

// function part2(input) {
//   const { directions, nodeIndex } = parseInput(input);
//   let nodes = Object.keys(nodeIndex).filter((node) => node.slice(-1) === "A");
//   let i = 0;
//   let cycles = 0;

//   while (nodes.some((node) => node.slice(-1)) !== "Z") {
//     nodes = nodes.map((node) => nodeIndex[node][directions[i]]);

//     if (i === directions.length - 1) {
//       i = 0;
//       cycles++;
//     } else {
//       i++;
//     }
//     if (nodes.every((node) => node.slice(-1) === "Z")) {
//       return i + cycles * directions.length;
//     }
//   }

//   return i + cycles * directions.length;
// }

function shortestPath(a, b) {
  let node = a;
  let i = 0;
  let cycles = 0;

  while (node !== b) {
    node = nodeIndex[node][directions[i]];

    if (i === directions.length - 1) {
      i = 0;
      cycles++;
    } else {
      i++;
    }
    if (cycles === 10000) return -1;
  }

  return i + cycles * directions.length;
}

function part2() {
  const endsWithA = Object.keys(nodeIndex).filter(
    (node) => node.slice(-1) === "A"
  );
  const endsWithZ = Object.keys(nodeIndex).filter(
    (node) => node.slice(-1) === "Z"
  );

  const shortests = endsWithA
    .map((a) => endsWithZ.map((b) => shortestPath(a, b)))
    .map((results) => results.filter((result) => result > 0)[0]);

  // least common multiple, I looked it up
  const gcd = (a, b) => (a ? gcd(b % a, a) : b);
  const lcm = (a, b) => (a * b) / gcd(a, b);

  return shortests.reduce(lcm);
}

console.log(part1());
console.log(part2());
