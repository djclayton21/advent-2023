const input = require("../lib/get-string-from-file")(__dirname)("./input.txt");
console.log(part1());
console.log(part2());

function parseInput(input) {
  return input
    .split("\n")
    .map((row) => row.split(""))
    .reverse();
}

function part1() {
  const field = parseInput(input);
  const path = walkPath(field);

  return Math.floor(flatLength(path) / 2);
}

function part2() {
  const field = parseInput(input);
  const path = walkPath(field);
  const yugeField = doubleSize(field);
  const yugePath = walkPath(yugeField);
  const yugeOutside = wanderOutside(yugePath);
  const outside = halfSize(yugeOutside);
  const whole = field
    .map((line, row) =>
      line
        .map((char, col) => {
          if (path[row][col] === "O") return "O";
          if (outside[row][col] === "X") return "_";
          else return "I";
        })
        .join("")
    )
    .reverse()
    .join("\n");

  console.log(whole);

  const fieldLength = flatLength(field);
  const pathLength = flatLength(path);
  const outsideLength = flatLength(outside);
  return fieldLength - pathLength - outsideLength;
}

function flatLength(field) {
  return field.flat().filter((x) => x !== "_").length;
}

function step(pipe, current, prev) {
  const [row, col] = current;
  const [prevRow, prevCol] = prev;
  switch (pipe) {
    case "|":
      return row > prevRow ? [row + 1, col] : [row - 1, col];
    case "-":
      return col > prevCol ? [row, col + 1] : [row, col - 1];
    case "L":
      return row < prevRow ? [row, col + 1] : [row + 1, col];
    case "J":
      return col > prevCol ? [row + 1, col] : [row, col - 1];
    case "7":
      return row > prevRow ? [row, col - 1] : [row - 1, col];
    case "F":
      return row > prevRow ? [row, col + 1] : [row - 1, col];
    case "S":
    default:
      return "done";
  }
}

function doko([row, col], field) {
  return field[row][col];
}

function findStart(field) {
  for (let row = 0; row < field.length; row++) {
    const col = field[row].findIndex((pipe) => pipe === "S");
    if (col >= 0) return [row, col];
  }
}

function takeFirstStep([startRow, startCol]) {
  return [startRow - 1, startCol];
}

function walkPath(field) {
  const start = findStart(field);
  const path = makeNewField(field, "_");
  let curr = takeFirstStep(start);
  let prev = start;
  let i = 1;

  while (curr !== "done") {
    const pipe = doko(curr, field);
    path[curr[0]][curr[1]] = "O";
    const next = step(pipe, curr, prev);
    prev = curr;
    curr = next;
    i++;
  }

  return path;
}

function makeNewField(field, fill) {
  return Array(field.length)
    .fill(fill)
    .map(() => Array(field[0].length).fill(fill));
}

function logField(field) {
  console.log(
    field
      .map((row) => row.join(""))
      .reverse()
      .join("\n")
  );
}

function doubleSize(field) {
  // blow up the field so we can see the gaps; thanks friendly redditor
  const yugeField = [];
  for (const row of field) {
    const newRow = [];
    for (const col of row) {
      newRow.push(col, getCharToRight(col));
    }
    yugeField.push(newRow, newRow.map(getCharAbove));
  }

  return yugeField;
}

function getCharToRight(char) {
  switch (char) {
    case "|":
      return ".";
    case "-":
      return "-";
    case "L":
      return "-";
    case "J":
      return ".";
    case "7":
      return ".";
    case "F":
      return "-";
    case "S":
    default:
      return ".";
  }
}

function getCharAbove(char) {
  switch (char) {
    case "|":
      return "|";
    case "-":
      return ".";
    case "L":
      return "|";
    case "J":
      return "|";
    case "7":
      return ".";
    case "F":
      return ".";
    case "S":
      return "|";
    default:
      return ".";
  }
}

function halfSize(field) {
  const moreRegularField = [];
  for (let i = 0; i < field.length; i += 2) {
    const newRow = [];
    for (let j = 0; j < field[i].length; j += 2) {
      newRow.push(field[i][j]);
    }
    moreRegularField.push(newRow);
  }

  return moreRegularField;
}

function wanderOutside(path) {
  const visited = makeNewField(path, "_");
  const todo = [[0, 0]];

  while (todo.length) {
    const [row, col] = todo.pop();

    if (
      !isInField([row, col], visited, "X") &&
      !isInField([row, col], path, "O")
    ) {
      visited[row][col] = "X";
      const neighbors = getValidNeighbors([row, col], path);
      todo.push(...neighbors);
    }
  }

  return visited;
}

function getValidNeighbors([row, col], path) {
  const neighbors = [
    [row - 1, col],
    [row + 1, col],
    [row, col - 1],
    [row, col + 1],
  ];

  return neighbors.filter(
    (point) => isInBounds(point, path) && !isInField(point, path, "O")
  );
}

function isInBounds([row, col], field) {
  return row >= 0 && row < field.length && col >= 0 && col < field[0].length;
}

function isInField([row, col], field, fill) {
  return field[row][col] === fill;
}
