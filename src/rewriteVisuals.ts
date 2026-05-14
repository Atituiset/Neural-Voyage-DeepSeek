import fs from 'fs';

let code = fs.readFileSync('src/App.tsx', 'utf8');

const modifyVisual = (compName: string, replacement: string) => {
  const startRegex = new RegExp(`function ${compName}\\(\\) \\{\\s+const \\{ t \\} = useLanguage\\(\\);`);
  const match = code.match(startRegex);
  if (match) {
    // Find the end of the component
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
    // If we can't find it with just { t } maybe it already has { t, perspective }
    console.log(`Could not find ${compName}`);
  }
};

const tokenizationReplacement = `function TokenizationVisual() {
  const { t, perspective, lang } = useLanguage();
  return (
    <div className="relative h-96 bg-slate-100/80 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center overflow-hidden">
      <motion.h3 
        initial={{ opacity: 1 }}
        whileInView={{ opacity: 0 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-12 absolute top-1/3 text-center"
      >
        {perspective === 'expert' ? (lang === 'zh' ? 'Sentence_To_Token_Sequence(Text)' : 'Sentence_To_Token_Sequence(Text)') : t.visuals.tokenSentence}
      </motion.h3>
      
      <div className="flex flex-wrap gap-3 justify-center mt-auto z-10 w-full">
        {t.visuals.tokens.map((token, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 1.5 + (i * 0.1), type: 'spring' }}
            style={{ boxShadow: perspective === 'expert' ? 'none' : '0 0 20px rgba(6, 182, 212, 0.4)' }}
            className={\`flex flex-col items-center px-4 py-3 md:px-6 md:py-4 \${
              perspective === 'expert' 
                ? 'bg-slate-200 dark:bg-slate-800/80 border border-slate-400 dark:border-slate-600 rounded-sm font-mono' 
                : 'bg-white dark:bg-slate-800 border border-cyan-500/50 rounded-xl'
            }\`}
          >
            <span className={\`text-lg md:text-2xl font-semibold \${perspective==='expert'?'text-slate-800 dark:text-slate-200':'text-cyan-700 dark:text-cyan-300'}\`}>{token}</span>
            {perspective === 'expert' && (
              <span className="text-xs text-slate-500 dark:text-slate-400 mt-2">ID: {1000 + (token.length * 42) + i * 17}</span>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}`;

const embeddingReplacement = `function EmbeddingVisual() {
  const { t, perspective } = useLanguage();
  return (
    <div className="relative h-96 bg-slate-100/80 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-between overflow-hidden">
       {/* Scanner projector */}
       <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-0 w-full flex justify-center pt-6"
      >
        <div className="relative">
          <ScanLine className="w-16 h-16 text-purple-400 z-10 relative bg-slate-100 dark:bg-slate-900 rounded-full p-2 border border-purple-500/30" />
          <motion.div 
            animate={{ height: [0, 250, 0], opacity: [0, 0.5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 w-32 bg-gradient-to-b from-purple-500 to-transparent opacity-30 z-0"
            style={{ clipPath: 'polygon(50% 0, 100% 100%, 0 100%)' }}
          />
        </div>
      </motion.div>

      <div className="flex gap-4 md:gap-8 justify-center mt-24 z-10 w-full relative">
        {t.visuals.embedTokens.map((token, i) => (
          <div key={i} className="flex flex-col items-center gap-2 md:gap-4">
             <motion.div
              initial={{ y: -20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              className={\`px-3 py-2 bg-white dark:bg-slate-800 border \${perspective==='expert'?'border-slate-500 font-mono rounded-none':'border-purple-500/50 rounded-lg text-lg font-semibold'} text-purple-700 dark:text-purple-300 whitespace-nowrap\`}
            >
              {perspective === 'expert' ? \`v\_{iD\${i}}\` : token}
            </motion.div>
            <div className={\`flex flex-col \${perspective==='expert'?'gap-0 mt-2':'gap-1'}\`}>
              {perspective === 'expert' && <div className="text-[10px] text-slate-500 font-mono mb-1 text-center">W_E · hot</div>}
              {[...Array(6)].map((_, j) => (
                <motion.div
                  key={j}
                  initial={{ rotateX: 90, opacity: 0 }}
                  whileInView={{ rotateX: 0, opacity: 1 }}
                  transition={{ delay: 0.5 + (i * 0.2) + (j * 0.1) }}
                  className={\`w-12 h-4 md:h-6 \${perspective==='expert'?'bg-emerald-900/10 dark:bg-emerald-900/40 border border-emerald-500/50 text-emerald-600 dark:text-emerald-400':'bg-purple-900/10 dark:bg-purple-900/40 border border-purple-700/50 text-purple-600 dark:text-purple-400 rounded'} flex items-center justify-center text-[8px] md:text-[10px] font-mono\`}
                >
                  {((Math.sin(i*7 + j*3) * 2)).toFixed(2)}
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}`;

const positionalReplacement = `function PositionalEncodingVisual() {
  const { t, perspective } = useLanguage();
  return (
    <div className="relative h-96 bg-slate-100/80 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 md:p-8 flex flex-col items-center justify-center overflow-hidden">
      <div className="flex items-center gap-2 md:gap-8 w-full justify-center">

        {/* Token Vector */}
        <div className="flex flex-col items-center">
            <span className="text-xs md:text-sm text-slate-500 font-bold mb-4">{t.visuals.tokenVector}</span>
            <div className="w-10 md:w-16 h-32 bg-slate-200 dark:bg-slate-800 rounded md:rounded-xl border border-slate-300 dark:border-slate-700 flex flex-col overflow-hidden shadow-inner">
               {[...Array(8)].map((_, i) => (
                 <div key={i} className={\`w-full h-full flex items-center justify-center \${i % 2 === 0 ? 'bg-cyan-500/20' : 'bg-transparent'}\`}>
                   {perspective === 'expert' && <span className="text-[6px] md:text-[8px] font-mono opacity-60">val</span>}
                 </div>
               ))}
            </div>
        </div>

        <span className="text-2xl font-bold text-slate-600 dark:text-slate-400">+</span>

        {/* Positional Wave */}
        <div className="flex flex-col items-center">
            <span className="text-xs md:text-sm text-slate-500 font-bold mb-4">{perspective === 'expert' ? 'PE(pos, 2i)' : t.visuals.position}</span>
            <div className="w-20 md:w-32 h-32 relative flex items-center justify-center">
               {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ scale: [1, 1.5, 1], opacity: [0.8, 0, 0.8] }}
                    transition={{ duration: 2, delay: i * 0.4, repeat: Infinity }}
                    className={\`absolute w-full h-full border rounded-full \${perspective === 'expert' ? 'border-orange-500/80' : 'border-blue-500/60'}\`}
                    style={{ borderColor: perspective==='expert'?'rgba(249, 115, 22, 0.6)':'rgba(59, 130, 246, 0.6)' }}
                  />
               ))}
               {perspective === 'expert' && (
                 <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-80 z-10 font-mono text-[8px] text-orange-600 dark:text-orange-400">
                    <div>sin(pos/10000^2i/d)</div>
                    <div>cos(pos/10000^2i/d)</div>
                 </div>
               )}
            </div>
        </div>

        <span className="text-2xl font-bold text-slate-600 dark:text-slate-400">=</span>

        {/* Result Vector */}
        <div className="flex flex-col items-center">
            <span className="text-xs md:text-sm text-slate-500 font-bold mb-4">{t.visuals.fused}</span>
            <div className="w-10 md:w-16 h-32 bg-slate-200 dark:bg-slate-800 rounded md:rounded-xl border border-slate-300 dark:border-slate-700 flex flex-col overflow-hidden relative shadow-lg shadow-blue-500/20">
               <motion.div 
                 animate={{ opacity: [0.3, 0.8, 0.3] }}
                 transition={{ duration: 1.5, repeat: Infinity }}
                 className={\`absolute inset-0 \${perspective === 'expert' ? 'bg-gradient-to-b from-orange-400/30 to-cyan-400/30' : 'bg-gradient-to-b from-blue-400/40 to-cyan-400/40'} mix-blend-overlay\`} 
               />
               {[...Array(8)].map((_, i) => (
                 <div key={i} className={\`w-full h-full flex items-center justify-center \${i % 2 === 0 ? 'bg-cyan-500/20' : 'bg-transparent'} relative z-10\`}>
                   {perspective === 'expert' && <span className="text-[6px] md:text-[8px] font-mono opacity-80 text-slate-700 dark:text-white">{((Math.sin(i)*0.5+0.5)).toFixed(2)}</span>}
                 </div>
               ))}
            </div>
        </div>
      </div>
    </div>
  );
}`;

const attentionReplacement = `function AttentionVisual() {
  const { t, perspective } = useLanguage();
  return (
    <div className="relative h-96 bg-slate-100/80 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 flex items-center justify-center overflow-hidden">
      
      <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12 w-full justify-center relative z-10 w-full max-w-2xl px-4">
        {/* Token A */}
        <div className={\`flex flex-col items-center gap-3 w-1/3 \${perspective==='expert'?'opacity-90':''}\`}>
           <div className={\`w-16 h-16 md:w-20 md:h-20 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center border-2 \${perspective==='expert'?'border-slate-600 rounded-none':'border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]'}\`}>
             <span className={\`font-bold text-center leading-tight \${perspective==='expert'?'font-mono text-sm':'text-sm md:text-lg'}\`}>{perspective === 'expert' ? 'X_1' : t.visuals.tokenA}</span>
           </div>
           
           <div className="flex gap-1 md:gap-2">
             <motion.div animate={{ y: [-5, 5, -5] }} transition={{ duration: 2, repeat: Infinity }} className="w-4 h-4 md:w-6 md:h-6 bg-blue-500 rounded-sm text-[8px] md:text-xs flex items-center justify-center font-bold text-white">Q</motion.div>
             <motion.div animate={{ y: [-5, 5, -5] }} transition={{ duration: 2.2, repeat: Infinity }} className="w-4 h-4 md:w-6 md:h-6 bg-amber-500 rounded-sm text-[8px] md:text-xs flex items-center justify-center font-bold text-white">K</motion.div>
             <motion.div animate={{ y: [-5, 5, -5] }} transition={{ duration: 1.8, repeat: Infinity }} className="w-4 h-4 md:w-6 md:h-6 bg-green-500 rounded-sm text-[8px] md:text-xs flex items-center justify-center font-bold text-white">V</motion.div>
           </div>
        </div>

        {/* Matrix Multiplication Area */}
        <div className="flex-1 flex justify-center items-center relative w-full h-32">
          {perspective === 'expert' ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2">
              <span className="font-mono text-xl text-blue-600 dark:text-blue-400 font-bold border-b border-slate-400 pb-1 w-full text-center tracking-widest">
                Softmax(QK^T / √d_k) V
              </span>
              <div className="w-32 h-16 grid grid-cols-4 grid-rows-2 gap-1 opacity-60">
                 {[...Array(8)].map((_, i) => (
                   <div key={i} className={\`w-full h-full rounded-sm \${i%3===0 ? 'bg-blue-500/50' : 'bg-slate-400/30'} flex items-center justify-center text-[8px]\`}>
                     {Math.random().toFixed(1)}
                   </div>
                 ))}
              </div>
            </div>
          ) : (
            <>
              {/* Animated Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                <motion.line initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1, repeat: Infinity }} x1="20%" y1="20%" x2="50%" y2="50%" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 4" />
                <motion.line initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.2, repeat: Infinity }} x1="80%" y1="20%" x2="50%" y2="50%" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 4" />
                <motion.circle cx="50%" cy="50%" r="20" fill="none" stroke="#22c55e" strokeWidth="2" strokeDasharray="5 5" className="animate-spin" style={{ animationDuration: '4s' }} />
              </svg>
              <div className="z-10 bg-white/90 dark:bg-slate-800/90 py-2 px-4 rounded shadow-lg border border-slate-300 dark:border-slate-700 text-sm font-bold text-slate-800 dark:text-slate-200">
                 {t.visuals.wMatrix}
              </div>
            </>
          )}
        </div>

        {/* Token B */}
        <div className={\`flex flex-col items-center gap-3 w-1/3 \${perspective==='expert'?'opacity-90':''}\`}>
           <div className={\`w-16 h-16 md:w-20 md:h-20 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center border-2 relative \${perspective==='expert'?'border-slate-600 rounded-none':'border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]'}\`}>
             <span className={\`font-bold text-center leading-tight \${perspective==='expert'?'font-mono text-sm':'text-sm md:text-lg'}\`}>{perspective === 'expert' ? 'X_2' : t.visuals.tokenB}</span>
             {/* Masking overlay */}
             <div className="absolute inset-0 bg-slate-900/40 rounded-full md:rounded-none flex items-center justify-center backdrop-blur-[1px]">
               <span className="text-[10px] md:text-sm font-bold text-white bg-slate-800 px-2 rounded opacity-90">{perspective === 'expert' ? '-∞' : 'MASKED'}</span>
             </div>
           </div>
           
           <div className="flex gap-1 md:gap-2">
             <motion.div animate={{ y: [-5, 5, -5] }} transition={{ duration: 2, delay: 0.5, repeat: Infinity }} className="w-4 h-4 md:w-6 md:h-6 bg-blue-500 rounded-sm text-[8px] md:text-xs flex items-center justify-center font-bold text-white opacity-40">Q</motion.div>
             <motion.div animate={{ y: [-5, 5, -5] }} transition={{ duration: 2.2, delay: 0.5, repeat: Infinity }} className="w-4 h-4 md:w-6 md:h-6 bg-amber-500 rounded-sm text-[8px] md:text-xs flex items-center justify-center font-bold text-white opacity-40">K</motion.div>
             <motion.div animate={{ y: [-5, 5, -5] }} transition={{ duration: 1.8, delay: 0.5, repeat: Infinity }} className="w-4 h-4 md:w-6 md:h-6 bg-green-500 rounded-sm text-[8px] md:text-xs flex items-center justify-center font-bold text-white opacity-40">V</motion.div>
           </div>
        </div>
      </div>
    </div>
  );
}`;

modifyVisual('TokenizationVisual', tokenizationReplacement);
modifyVisual('EmbeddingVisual', embeddingReplacement);
modifyVisual('PositionalEncodingVisual', positionalReplacement);
modifyVisual('AttentionVisual', attentionReplacement);

const moeReplacement = `function MoEVisual() {
  const { t, perspective } = useLanguage();
  const [activeExperts, setActiveExperts] = useState([1, 4]);

  useEffect(() => {
    const interval = setInterval(() => {
      let e1 = Math.floor(Math.random() * 6);
      let e2 = Math.floor(Math.random() * 6);
      while(e1 === e2) e2 = Math.floor(Math.random() * 6);
      setActiveExperts([e1, e2]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-96 bg-slate-100/80 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center overflow-hidden">
      <div className="relative w-full max-w-sm mx-auto flex flex-col items-center">
        
        {/* Router */}
        <motion.div 
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className={\`z-20 px-6 py-3 \${perspective==='expert'?'bg-slate-800 rounded-none border border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]':'bg-white dark:bg-slate-800 rounded-2xl shadow-xl border-t border-slate-100 dark:border-slate-700/50'} mb-12 flex items-center justify-center\`}
        >
           {perspective === 'expert' ? (
             <div className="font-mono text-cyan-400 font-bold text-lg">Top-K Router(x)</div>
           ) : (
             <Network className="w-8 h-8 text-cyan-500" />
           )}
        </motion.div>

        {/* Experts Grid */}
        <div className="grid grid-cols-3 gap-3 md:gap-4 w-full z-10 relative px-4">
           {[...Array(6)].map((_, i) => (
             <motion.div 
                key={i}
                initial={{ opacity: 0.8 }}
                animate={{ 
                  scale: activeExperts.includes(i) ? 1.1 : 1,
                  boxShadow: activeExperts.includes(i) ? '0 0 20px rgba(6, 182, 212, 0.4)' : 'none'
                }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className={\`\${perspective==='expert'?'rounded-sm':'rounded-lg'} border flex flex-col items-center justify-center transition-all min-h-[60px] md:min-h-[80px] \${
                  activeExperts.includes(i) 
                    ? (perspective === 'expert' ? 'bg-cyan-900/80 border-cyan-400 text-cyan-100' : 'bg-cyan-900/60 border-cyan-700/50 text-cyan-800 dark:text-cyan-200') 
                    : 'bg-slate-200/40 dark:bg-slate-800/40 border-transparent text-slate-500 dark:text-slate-400'
                }\`}
              >
                 {perspective === 'expert' ? (
                   <span className="font-mono text-xs md:text-sm font-bold opacity-80">FFN_{i+1}</span>
                 ) : (
                   <>
                     <Database className="w-4 h-4 md:w-5 md:h-5 mb-1 opacity-80" />
                     <span className="text-[10px] md:text-xs whitespace-nowrap">{t.visuals.expert} {i+1}</span>
                   </>
                 )}
             </motion.div>
          ))}
        </div>
        
        {/* Trigger Beams */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
           {activeExperts.map((expertIndex, j) => {
             const row = Math.floor(expertIndex / 3);
             const col = expertIndex % 3;
             return (
              <motion.line
                key={j}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                x1="50%" y1="3rem"
                x2={\`\${16.6 + col*33.3}%\`}
                y2={\`\${7.5 + row*4}rem\`}
                stroke={perspective==='expert' ? "rgba(34, 211, 238, 1)" : "rgba(34, 211, 238, 0.8)"} 
                strokeWidth={perspective==='expert' ? "3" : "2"} 
                strokeDasharray="4,4"
              />
             );
           })}
        </svg>

      </div>
    </div>
  );
}`;

modifyVisual('MoEVisual', moeReplacement);

fs.writeFileSync('src/App.tsx', code);
console.log('Visuals replaced!');
