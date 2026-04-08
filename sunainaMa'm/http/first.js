const fs = require("fs")

// create & write file
fs.writeFileSync("output.txt", "hello world!");

// append data
fs.appendFileSync("output.txt", " vrushita");

// read file
const data = fs.readFileSync("output.txt", "utf-8");
console.log(data);

// rename file
fs.renameSync("output.txt", "newOutput.txt");

// delete file
fs.unlinkSync("newOutput.txt");