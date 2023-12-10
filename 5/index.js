const input = require("../lib/get-string-from-file")(__dirname)("./input.txt");

class XtoY {
  constructor(name, entries) {
    this.name = name;
    this.entries = entries;
  }
  getY(sourceNum) {
    const entry = this.#findEntryBySource(sourceNum);

    if (!entry) return sourceNum;

    return entry.destination + (sourceNum - entry.source);
  }
  getX(destinationNum) {
    const entry = this.#findEntryByDestination(destinationNum);
    if (!entry) return destinationNum;

    return entry.source + (destinationNum - entry.destination);
  }
  #findEntryBySource(sourceNum) {
    return this.entries.find(
      ({ source, range }) => sourceNum >= source && sourceNum < source + range
    );
  }
  #findEntryByDestination(destinationNum) {
    return this.entries.find(
      ({ destination, range }) =>
        destinationNum >= destination && destinationNum < destination + range
    );
  }
}

class Almanac {
  #converters;

  constructor(input) {
    this.#converters = this.#processInput(input);
  }
  seedToSoil(seed) {
    return this.#converters.seedToSoil.getY(seed);
  }
  soilToFertilizer(soil) {
    return this.#converters.soilToFertilizer.getY(soil);
  }
  fertilizerToWater(fertilizer) {
    return this.#converters.fertilizerToWater.getY(fertilizer);
  }
  waterToLight(water) {
    return this.#converters.waterToLight.getY(water);
  }
  lightToTemperature(light) {
    return this.#converters.lightToTemperature.getY(light);
  }
  temperatureToHumidity(temperature) {
    return this.#converters.temperatureToHumidity.getY(temperature);
  }
  humidityToLocation(humidity) {
    return this.#converters.humidityToLocation.getY(humidity);
  }
  soilToSeed(soil) {
    return this.#converters.seedToSoil.getX(soil);
  }
  fertilizerToSoil(fertilizer) {
    return this.#converters.soilToFertilizer.getX(fertilizer);
  }
  waterToFertilizer(water) {
    return this.#converters.fertilizerToWater.getX(water);
  }
  lightToWater(light) {
    return this.#converters.waterToLight.getX(light);
  }
  temperatureToLight(temperature) {
    return this.#converters.lightToTemperature.getX(temperature);
  }
  humidityToTemperature(humidity) {
    return this.#converters.temperatureToHumidity.getX(humidity);
  }
  locationToHumidity(location) {
    return this.#converters.humidityToLocation.getX(location);
  }
  getSeedForLocation(location) {
    return this.soilToSeed(
      this.fertilizerToSoil(
        this.waterToFertilizer(
          this.lightToWater(
            this.temperatureToLight(
              this.humidityToTemperature(this.locationToHumidity(location))
            )
          )
        )
      )
    );
  }
  get locationStarts() {
    return this.#converters.humidityToLocation.entries
      .map(({ destination }) => destination)
      .sort();
  }
  #processInput(input) {
    const maps = input
      .match(/[a-z,-]+\smap:\n[\d\s\n]+/g)
      .map(this.#parseInputSection);

    const converters = {};
    for (const { name, entries } of maps) {
      converters[name] = new XtoY(name, entries);
    }
    return converters;
  }
  #parseInputSection(section) {
    const [name, lines] = section.split(" map:\n");
    const entries = lines.split("\n").map((line) => {
      const [destination, source, range] = line.split(" ");
      return {
        destination: Number(destination),
        source: Number(source),
        range: Number(range),
      };
    });
    return { name: camelCase(name), entries };
  }
}

class Seed {
  constructor(seedNumber, Almanac) {
    this.seedNumber = seedNumber;
    this.Almanac = Almanac;
  }
  get soil() {
    return this.Almanac.seedToSoil(this.seedNumber);
  }
  get fertilizer() {
    return this.Almanac.soilToFertilizer(this.soil);
  }
  get water() {
    return this.Almanac.fertilizerToWater(this.fertilizer);
  }
  get light() {
    return this.Almanac.waterToLight(this.water);
  }
  get temperature() {
    return this.Almanac.lightToTemperature(this.light);
  }
  get humidity() {
    return this.Almanac.temperatureToHumidity(this.temperature);
  }
  get location() {
    return this.Almanac.humidityToLocation(this.humidity);
  }
}

function part1(input) {
  const almanac = new Almanac(input);
  const seeds = parseSeedNumbers(input)
    .map((num) => new Seed(num, almanac))
    .sort((seedA, seedB) => seedA.location - seedB.location);
  console.log(seeds[0].location);
}
function part2(input) {
  const almanac = new Almanac(input);
  const numbers = parseSeedNumbers(input);
  const ranges = parseSeedRanges(numbers);
  for (let i = 0; i <= 65689071; i++) {
    const seed = almanac.getSeedForLocation(i);
    const seedIsInRange = isSeedInRange(ranges, seed);
    if (seedIsInRange) return { i, seed };
    console.log(i);
  }
}

function part3(input) {
  const almanac = new Almanac(input);

  const numbers = parseSeedNumbers(input);
  const ranges = parseSeedRanges(numbers);
  let [bottom, top] = [0, 7873088];
  let loops = 0;
  while (bottom !== top && loops < 100) {
    bottomSeed = almanac.getSeedForLocation(bottom);
    topSeed = almanac.getSeedForLocation(top);
    topInRange = isSeedInRange(ranges, topSeed);
    bottomInRange = isSeedInRange(ranges, bottomSeed);
    const spread = top - bottom;
    console.log([bottom, spread, top]);

    if (!bottomInRange && topInRange) {
      console.log("top in range");
      bottom = bottom + Math.ceil(spread / 2);
    } else if (!bottomInRange && !topInRange) {
      bottom = top;
      top = top + spread;
    } else {
      top = bottom;
      bottom = top - spread >= 0 ? top - spread : 0;
    }
    loops++;
  }
  return top;
}

function parseSeedNumbers(input) {
  return input
    .match(/(?<=seeds:\s)[\d\s]+/)[0]
    .trim()
    .split(" ")
    .map(Number);
}

function isSeedInRange(ranges, seedNumber) {
  const matches = ranges
    .sort()
    .filter(
      ({ start, range }) => seedNumber >= start && seedNumber < start + range
    );

  return matches.length > 0;
}

function parseSeedRanges(seedRange) {
  const allSeeds = [];

  while (seedRange.length) {
    const [start, range] = seedRange.splice(0, 2);
    allSeeds.push({ start, range });
  }

  return allSeeds;
}

// part1(input);
// console.log(part2(input));
console.log(part3(input));

function camelCase(kebab) {
  const words = kebab.split("-");

  let camelCase = words[0];
  for (let i = 1; i < words.length; i++) {
    camelCase = camelCase + words[i][0].toUpperCase() + words[i].slice(1);
  }

  return camelCase;
}
