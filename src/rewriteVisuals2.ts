import fs from 'fs';

let code = fs.readFileSync('src/App.tsx', 'utf8');

const modifyVisual = (compName: string, replacement: string) => {
  const startRegex = new RegExp(`function ${compName}\\(\\) \\{\\s+const \\{ t \\} = useLanguage\\(\\);`);
  const match = code.match(startRegex) || code.match(new RegExp(`function ${compName}\\(\\) \\{\\s+const \\{ t, perspective \\} = useLanguage\\(\\);`));
  if (match) {
    const startIndex = match.index!;
    let openBraces = 0;
    let i = startIndex + `function ${compName}() {`.length;
    let foundInitialBrace = false;
    for (; i < code.length; i++) {
        if (code[i] === '{') {
            openBraces++;
            foundInitialBrace = true;
        } else if (code[i] === '}') {
            openBraces--;
            if (foundInitialBrace && openBraces === 0) {
                break;
            }
        }
    }
    const endIndex = i + 1;
    const existingComp = code.substring(startIndex, endIndex);
    code = code.replace(existingComp, replacement);
  } else {
    const backupRegex = new RegExp(`function ${compName}\\(\\) \\{[\\s\\S]*?  \\);\\n\\}`);
    const backupMatch = code.match(backupRegex);
    if (backupMatch) {
        code = code.replace(backupMatch[0], replacement);
    } else {
        console.log(`Could not find ${compName}`);
    }
  }
};

const residualReplacement = `function ResidualNormVisual() {
  const { t, perspective } = useLanguage();
  return (
    <div className="relative h-96 bg-slate-100/80 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center overflow-hidden">
      <div className="relative w-full max-w-lg flex flex-col items-center">
        
        {/* Input */}
        <div className={\`z-10 bg-slate-200 dark:bg-slate-800 \${perspective==='expert'?'rounded-none border-blue-500':'rounded px-6 py-2 shadow border-slate-300 dark:border-slate-700'} border flex items-center justify-center font-bold px-4 py-2\`}>
          {perspective === 'expert' ? <span className="font-mono text-blue-500">x</span> : t.visuals.inputX}
        </div>

        {/* Path Divider */}
        <div className="w-full h-24 relative">
          <svg className="absolute inset-0 w-full h-full overflow-visible">
            {/* Main Path */}
            <motion.path 
              initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              d="M 50% 0 L 50% 100%" stroke="rgba(59, 130, 246, 0.5)" strokeWidth="3" fill="none" 
            />
            {/* Skip Connection */}
            <motion.path 
              initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              d="M 50% 10 C 10% 10, 10% 90, 50% 90" stroke={perspective==='expert' ? "rgba(239, 68, 68, 0.8)" :"rgba(16, 185, 129, 0.8)"} strokeWidth="3" strokeDasharray="6 6" fill="none" 
            />
          </svg>
        </div>

        {/* Processing Block */}
        <motion.div 
          animate={{ scale: [1, 1.02, 1] }} transition={{ duration: 2, repeat: Infinity }}
          className={\`w-48 py-4 \${perspective==='expert'?'bg-blue-900/20 border-2 border-blue-500 rounded-none':'bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700'} flex flex-col items-center justify-center relative z-10\`}
        >
          {perspective === 'expert' ? (
            <span className="font-mono font-bold text-blue-500">Sublayer(x)</span>
          ) : (
            <>
              <Activity className="w-6 h-6 text-blue-500 mb-2" />
              <span className="text-sm font-semibold">{t.visuals.sublayer}</span>
            </>
          )}
        </motion.div>

        <div className="w-full h-16 relative">
          <svg className="absolute inset-0 w-full h-full overflow-visible">
            <motion.path 
              initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 1, repeat: Infinity, ease: "linear" }}
              d="M 50% 0 L 50% 100%" stroke="rgba(59, 130, 246, 0.8)" strokeWidth="3" fill="none" 
            />
          </svg>
           {perspective === 'expert' && <span className="absolute top-1/2 left-[55%] text-lg font-bold text-slate-500 font-mono">+</span>}
        </div>

        {/* Output & Norm */}
        <div className={\`z-10 \${perspective==='expert'?'bg-emerald-900/40 border-[3px] border-emerald-500 rounded-none w-56':'bg-slate-800 px-8 py-3 rounded-full border-2 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]'} flex items-center justify-center py-3\`}>
          {perspective === 'expert' ? (
             <span className="font-mono text-emerald-400 font-bold whitespace-nowrap">LayerNorm(x + Sublayer(x))</span>
          ) : (
             <span className="font-bold text-emerald-400">{t.visuals.layerNorm}</span>
          )}
        </div>

      </div>
    </div>
  );
}`;

const softmaxReplacement = `function SoftmaxVisual() {
  const { t, perspective } = useLanguage();
  return (
    <div className="relative h-96 bg-slate-100/80 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center overflow-hidden">
      
      {perspective === 'expert' && (
        <div className="absolute top-8 w-full flex justify-center">
            <div className="bg-slate-800/80 px-4 py-2 border border-slate-600 rounded text-center">
               <span className="font-mono text-sm text-yellow-400 font-bold tracking-widest block mb-1">y_i = e^(z_i) / Σ e^(z_j)</span>
            </div>
        </div>
      )}

      <div className="flex gap-2 md:gap-5 mb-16 px-4 md:px-12 pb-4 border-b border-slate-300 dark:border-slate-700 z-10 w-full justify-between items-end h-40">
         {[0.02, 0.05, 0.01, 0.82, 0.03, 0.07].map((val, i) => (
           <div key={i} className="flex flex-col items-center justify-end h-full">
             {perspective === 'expert' && (
               <motion.span 
                 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.5 + i*0.1 }}
                 className={\`text-[10px] font-mono mb-2 \${val > 0.5 ? 'text-green-400 font-bold' : 'text-slate-500'}\`}
               >
                 {val.toFixed(2)}
               </motion.span>
             )}
             <motion.div 
               initial={{ height: 0, opacity: 0 }}
               whileInView={{ height: val * 100 + "%", opacity: 1 }}
               transition={{ delay: 0.5 + (i * 0.1), duration: 1 }}
               className={\`w-8 md:w-12 rounded-t-sm flex items-end justify-center pb-2 text-[10px] md:text-sm font-bold shadow-lg \${
                 val > 0.5 ? 'bg-gradient-to-t from-green-600 to-green-400 text-slate-900 dark:text-white drop-shadow-[0_0_15px_rgba(34,197,94,0.8)]' : 'bg-slate-700 text-slate-600 dark:text-slate-400'
               }\`}
             >
               {perspective !== 'expert' && (val > 0.5 ? "99%" : "")}
             </motion.div>
           </div>
         ))}
      </div>
      
      <motion.div 
        animate={{ scale: [1, 1.05, 1], boxShadow: ['0 0 0px rgba(34,197,94,0)', '0 0 30px rgba(34,197,94,0.6)', '0 0 0px rgba(34,197,94,0)'] }}
        transition={{ duration: 2, repeat: Infinity }}
        className={\`mt-auto px-12 py-4 \${perspective==='expert'?'bg-green-900 border-2 border-green-400 rounded-none':'bg-gradient-to-r from-emerald-500 to-green-400 rounded-full'} text-white font-black text-xl tracking-widest z-10 shadow-xl\`}
      >
         {perspective === 'expert' ? 'argmax(P) -> Token' : t.visuals.generate}
      </motion.div>

    </div>
  );
}`;

modifyVisual('ResidualNormVisual', residualReplacement);
modifyVisual('SoftmaxVisual', softmaxReplacement);

fs.writeFileSync('src/App.tsx', code);
console.log('Visuals replaced again!');
