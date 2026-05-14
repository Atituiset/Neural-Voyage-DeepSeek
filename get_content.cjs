const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const tStart = code.indexOf('const content = {');
const tEnd = code.indexOf('function AppProvider', tStart);

console.log(code.substring(tStart, tEnd));
