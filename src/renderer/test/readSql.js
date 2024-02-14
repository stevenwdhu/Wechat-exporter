const utf8 = require("utf-8");


const db = require("better-sqlite3")("./src/render/test/WCDB_Contact.sqlite", {
  readonly: true,
  fileMustExist: true,
});

let arr = db
  .prepare("SELECT * from Friend WHERE type==3 and userName GLOB 'wxid*' LIMIT 20")
  .all();
console.log(arr);

function parseBytes(byteArr) {
  let baseIndex = 0;
  let output = [];
  while (baseIndex + 2 + byteArr[baseIndex + 1] <= byteArr.length) {
    output.push(
      byteArr.slice(baseIndex + 2, baseIndex + 2 + byteArr[baseIndex + 1])
    );
    baseIndex += 2 + byteArr[baseIndex + 1];
  }
  return output;
}

for (let a of arr) {
const output = parseBytes(a.dbContactRemark);
console.log(`${utf8.getStringFromBytes(output[0])}（${utf8.getStringFromBytes(output[1])}）`);
}