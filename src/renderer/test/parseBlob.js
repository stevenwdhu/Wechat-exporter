const utf8 = require("utf-8");

const hex =
  "0A 0C E5 AE 83 E7 9A 84 E7 A5 A8 E5 9C 88 1A 00 12 0A 61 6C 77 61 79 73 2D 34 30 34 22 0C 74 61 64 65 70 69 61 6F 6A 75 61 6E 2A 00 32 0C 74 61 64 65 70 69 61 6F 6A 75 61 6E 3A 00 42 00";
const hexArr = hex.split(" ");
const bytes = hexArr.map((each) => parseInt(each, 16));
// const str = utf8.getStringFromBytes(bytes)
//
// console.log(str);

function parseBytes(byteArr) {
  let baseIndex = 0;
  let output = [];
  while (baseIndex + 2 + byteArr[baseIndex + 1] <= byteArr.length) {
    output.push({
      [hexArr[baseIndex]]: byteArr.slice(
        baseIndex + 2,
        baseIndex + 2 + byteArr[baseIndex + 1]
      ),
    });
    baseIndex += 2 + byteArr[baseIndex + 1];
  }
  return output;
}

const output = parseBytes(bytes);
for (let i of output) {
  console.log(utf8.getStringFromBytes(Object.values(i)[0]));
}
