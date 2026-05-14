const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

// Inject import
if (!app.includes('GeekPerspectiveView')) {
  app = app.replace('import { useState, useEffect, createContext, useContext } from "react";',
    'import { useState, useEffect, createContext, useContext } from "react";\nimport { GeekPerspectiveView } from "./components/GeekPerspectiveView";'
  );
}

// Modify AppContent
// finding <main className="relative z-10 pb-32">
let mainRegex = /(<main className="relative z-10 pb-32">)([\s\S]*?)(<\/main>)/;

app = app.replace(mainRegex, (match, p1, p2, p3) => {
  return p1 + '\n        {perspective === "geek" ? <GeekPerspectiveView /> : (\n          <>\n' + p2 + '\n          </>\n        )}\n' + p3;
});

fs.writeFileSync('src/App.tsx', app);
console.log('Appched');
