import fs from 'fs';
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(/} = useLanguage\(\);\n  return \(\n    <div className="relative h-96 bg-slate-100\/80 dark:bg-slate-900/g, '}\nfunction Garbage() {\n  return (\n    <div className="relative h-96 bg-slate-100/80 dark:bg-slate-900');
code = code.replace(/} = useLanguage\(\);/g, '}');
code = code.replace(/^ = useLanguage\(\);/gm, '');

// just clean it aggressively
const match1 = code.indexOf('} = useLanguage()');

fs.writeFileSync('src/App.tsx', code);
console.log('Fixed syntax!');
