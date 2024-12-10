import { readFileSync } from 'fs';


export default function ParseTextInput(path:string){
const data = readFileSync(path, 'utf8');

//split based on array of lines bases on line breaks in the file
const lines = data.split(/\r?\n/);

const instructions = lines.map((line) => {
    //this removes commas and add blanks
    const cleanedLine = line.replace(/,/g, '');
    //split on space
    const tokens = cleanedLine.split(' ').filter((t) => t !== ''); 
    return tokens;
});

return instructions;

}

