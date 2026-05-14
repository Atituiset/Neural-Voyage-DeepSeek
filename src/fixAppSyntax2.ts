import fs from 'fs';
let code = fs.readFileSync('src/App.tsx', 'utf8');

// The replacement was:
// code = code.replace(/} = useLanguage\(\);\n  return \(\n    <div className="relative h-96 bg-slate-100\/80 dark:bg-slate-900/g, '}\nfunction Garbage() {\n  return (\n    <div className="relative h-96 bg-slate-100/80 dark:bg-slate-900');
// So we want to replace back:
code = code.replace(/}\nfunction Garbage\(\) \{\n  return \(\n    <div/g, '} = useLanguage();\n  return (\n    <div');

// And we replaced: code = code.replace(/} = useLanguage\(\);/g, '}');
// This stripped ` = useLanguage();` from `const { t, perspective } = useLanguage();`
// We need to restore ` = useLanguage();` for `const { ... }` where it's at the end of the line
code = code.replace(/const \{([^}]+)\}\s*$/gm, 'const {$1} = useLanguage();');

// Also for `const { ... }` followed by empty line or `\n` without `=`
code = code.replace(/const \{([^}]+)\}\n/g, 'const {$1} = useLanguage();\n');

fs.writeFileSync('src/App.tsx', code);
console.log('Restored missed useLanguage calls');
