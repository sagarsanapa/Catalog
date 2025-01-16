const fs = require('fs');
const BigNumber = require('bignumber.js');

function processFile(filename) {
  const data = JSON.parse(fs.readFileSync(filename, 'utf8'));
  const { n, k } = data.keys;

  console.log(`\nProcessing file: ${filename}`);
  console.log(`Number of roots (n): ${n}, Minimum roots required (k): ${k}`);

  const points = decodeYValues(data).slice(0, k);
  const constantTerm = lagrangeInterpolation(points);
  console.log("Constant Term (c):", constantTerm);
}

function decodeYValues(data) {
  const points = [];
  Object.keys(data).forEach((key) => {
    if (key !== "keys") {
      const x = parseInt(key, 10);
      const base = parseInt(data[key].base, 10);
      const yValue = data[key].value;
      const y = new BigNumber(yValue, base);
      points.push({ x, y });
    }
  });
  return points;
}

function lagrangeInterpolation(points) {
  let constantTerm = new BigNumber(0);

  points.forEach((pointI, i) => {
    let termNumerator = new BigNumber(pointI.y);
    let termDenominator = new BigNumber(1);

    points.forEach((pointJ, j) => {
      if (i !== j) {
        termNumerator = termNumerator.multipliedBy(-pointJ.x);
        termDenominator = termDenominator.multipliedBy(pointI.x - pointJ.x);
      }
    });

    constantTerm = constantTerm.plus(termNumerator.dividedBy(termDenominator));
  });

  return constantTerm.toFixed(0);
}

processFile("testcase1.json");
processFile("testcase2.json");