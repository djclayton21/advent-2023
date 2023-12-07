function part1(input) {
  const rows = input.split("\n");
  const numbers = rows.reduce(parseNumbersFromRow, []);
  const symbols = rows.reduce(parseSymbolsFromRow, []);

  const partNumbers = numbers.filter((number) => isPartNumber(number, symbols));
  console.log(partNumbers.filter((n) => n.number === 4));
  return require("lodash").sum(partNumbers.map((x) => x.number));
}

function part2(input) {
  const rows = input.split("\n");
  const numbers = rows.reduce(parseNumbersFromRow, []);
  const symbols = rows.reduce(parseSymbolsFromRow, []);

  const gears = symbols
    .map((symbol) => addGearRatio(symbol, numbers))
    .filter((symbol) => symbol.gearRatio);

  return require("lodash").sum(gears.map((x) => x.gearRatio));
}

function addGearRatio(symbol, numbers) {
  const adjacentNumbers = numbers.filter((number) => {
    const overlapsRow =
      symbol.row >= number.row - 1 && symbol.row <= number.row + 1;
    const overlapsColumn =
      symbol.col >= number.colStart - 1 && symbol.col <= number.colEnd + 1;
    return overlapsRow && overlapsColumn;
  });

  const isGear = adjacentNumbers.length === 2;

  if (isGear) {
    return {
      ...symbol,
      gearRatio: adjacentNumbers[0].number * adjacentNumbers[1].number,
    };
  } else return symbol;
}

function parseNumbersFromRow(numbers, row, rowNumber) {
  const nums = row.match(/\d+/g) ?? [];
  let cleanedRow = row;
  const newNumbers = nums.map((num) => {
    const start = cleanedRow.indexOf(num);
    const end = start + num.length - 1;

    cleanedRow = cleanedRow.replace(
      num,
      new Array(num.length).fill("X").join("")
    );

    return {
      number: Number(num),
      row: rowNumber,
      colStart: start,
      colEnd: end,
    };
  });

  return numbers.concat(newNumbers);
}

function parseSymbolsFromRow(symbols, row, rowNumber) {
  const syms = [];
  const chars = row.split("");
  chars.forEach((char, i) => {
    if (char.match(/[^\d\.\r]/)) {
      syms.push({ symbol: char, row: rowNumber, col: i });
    }
  });

  return symbols.concat(syms);
}

function isPartNumber(number, symbols) {
  const match = symbols.find((symbol) => {
    const overlapsRow =
      symbol.row >= number.row - 1 && symbol.row <= number.row + 1;
    const overlapsColumn =
      symbol.col >= number.colStart - 1 && symbol.col <= number.colEnd + 1;

    return overlapsRow && overlapsColumn;
  });
  number.match = match;

  return match;
}

console.log(
  part2(require("../lib/get-string-from-file")(__dirname)("./input-2.txt"))
);
