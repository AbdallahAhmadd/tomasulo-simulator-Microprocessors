"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var data = (0, fs_1.readFileSync)('/Users/Abdallah/Documents/Semester 7🤞/Microprocessors/testdata1.txt', 'utf8');
//split based on array of lines bases on line breaks in the file
var lines = data.split(/\r?\n/);
console.log(lines);
var instructions = lines.map(function (line) {
    //this removes commas and add blanks
    var cleanedLine = line.replace(/,/g, '');
    //split on space
    var tokens = cleanedLine.split(' ').filter(function (t) { return t !== ''; });
    return tokens;
});
var instructionsEdit = instructions.shift();
console.log("New Instructions is", instructionsEdit);
console.log(instructions);
