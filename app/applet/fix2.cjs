const fs = require('fs');
let lines = fs.readFileSync('src/App.tsx', 'utf8').split('\n');

const expertAttentionCode = \`function AttentionVisual() {
  const { t, perspective } = useLanguage();
  return (
    <div className="relative h-[25rem] bg-slate-100/80 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 flex items-center justify-center overflow-hidden">
      
      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 w-full justify-center relative z-10 w-full max-w-5xl px-4">
        {/* Input */}
        <div className={\\\`flex flex-col items-center gap-2 w-1/4 \\\${perspective==='expert'?'':'opacity-90'}\\\`}>
           <div className={\\\`w-16 h-16 md:w-20 md:h-20 bg-slate-200 dark:bg-slate-700 flex items-center justify-center border-2 \\\${perspective==='expert'?'border-slate-600 rounded':'border-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]'}\\\`}>
             <span className={\\\`font-bold text-center leading-tight \\\${perspective==='expert'?'font-mono text-sm':'text-sm md:text-lg'}\\\`}>{perspective === 'expert' ? 'X_m' : t.visuals.tokenA}</span>
           </div>
           
           <div className="flex gap-1 mt-4">
             <motion.div animate={{ y: [-3, 3, -3] }} transition={{ duration: 2, repeat: Infinity }} className="w-8 h-8 md:w-10 md:h-10 bg-blue-500 rounded shadow-lg text-xs md:text-sm flex flex-col items-center justify-center font-bold text-white"><span>Q</span></motion.div>
             <motion.div animate={{ y: [-3, 3, -3] }} transition={{ duration: 2.2, repeat: Infinity }} className="w-8 h-8 md:w-10 md:h-10 bg-amber-500 rounded shadow-lg text-xs md:text-sm flex flex-col items-center justify-center font-bold text-white"><span>K</span></motion.div>
             <motion.div animate={{ y: [-3, 3, -3] }} transition={{ duration: 1.8, repeat: Infinity }} className="w-8 h-8 md:w-10 md:h-10 bg-green-500 rounded shadow-lg text-xs md:text-sm flex flex-col items-center justify-center font-bold text-white"><span>V</span></motion.div>
           </div>
           {perspective === 'expert' && <span className="text-[10px] text-slate-500 font-mono mt-2 text-center w-full block">× W_q, W_k, W_v</span>}
        </div>

        {/* Matrix Multiplication Area */}
        <div className="flex-1 flex justify-center items-center relative w-full h-64 border border-slate-300 dark:border-slate-700/50 rounded-xl bg-slate-50 dark:bg-slate-900/80 shadow-inner">
          {perspective === 'expert' ? (
            <div className="absolute inset-0 flex flex-col items-center justify-start p-4 w-full">
              <span className="text-xl md:text-2xl text-slate-800 dark:text-slate-200 font-serif border-b border-slate-400 pb-2 w-full text-center tracking-wider mb-6 flex items-center justify-center whitespace-nowrap">
                <span>Attention(Q,K,V) = </span>
                <span className="text-blue-600 dark:text-blue-400 font-bold ml-2 leading-none">Softmax</span>
                <span className="mx-1 text-slate-400 leading-none">(</span>
                <div className="flex flex-col items-center justify-center text-sm md:text-lg mx-1 inline-flex align-middle relative top-[-4px]">
                   <span className="border-b border-slate-400 pb-0.5 leading-none">QK<sup className="text-[10px]">T</sup></span>
                   <span className="pt-0.5 leading-none shadow-sm pb-1">√<span className="text-[10px]">d_k</span></span>
                </div>
                <span className="text-pink-500 font-bold -ml-[2px] mr-1 translate-y-[-2px]">+ M</span>
                <span className="mx-1 text-slate-400 leading-none">)</span>
                <span className="text-green-500 font-bold leading-none">V</span>
              </span>
              
              <div className="flex items-center justify-center gap-2 md:gap-4 text-[10px] md:text-xs font-mono text-slate-500 dark:text-slate-400 opacity-90 mt-2 w-full">
                 <div className="flex flex-col gap-1 items-center">
                    <span className="text-blue-500 font-bold tracking-tight">Q•K^T</span>
                    <div className="grid grid-cols-4 grid-rows-4 gap-[2px]">
                       {[...Array(16)].map((_, i) => <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1+Math.random(), repeat: Infinity }} key={i} className={\\\`w-4 h-4 rounded-sm \\\${i%5===0 ? 'bg-blue-500' : 'bg-blue-300 dark:bg-blue-900'}\\\`}></motion.div>)}
                    </div>
                 </div>
                 <span className="text-lg md:text-xl text-slate-400 font-thin">÷√d_k</span>
                 <div className="flex flex-col gap-1 items-center">
                    <span className="text-pink-400 font-bold tracking-tight">Mask</span>
                    <div className="grid grid-cols-4 grid-rows-4 gap-[2px]">
                       {[...Array(16)].map((_, i) => <div key={i} className={\\\`w-4 h-4 rounded-sm \\\${(i%4) <= Math.floor(i/4) ? 'bg-pink-500/80' : 'bg-slate-200 dark:bg-slate-800'}\\\`}></div>)}
                    </div>
                 </div>
                 <span className="text-lg md:text-xl text-green-500 font-thin">× V</span>
                 <div className="flex flex-col gap-1 items-center">
                    <span className="text-green-500 font-bold tracking-tight">Z</span>
                    <div className="grid grid-cols-4 grid-rows-4 gap-[2px]">
                       {[...Array(16)].map((_, i) => <div key={i} className={\\\`w-4 h-4 rounded-sm \\\${i%2===0 ? 'bg-green-400/80' : 'bg-green-700'}\\\`}></div>)}
                    </div>
                 </div>
              </div>
            </div>
          ) : (
            <>
              {/* Basic Animated Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                <motion.line initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1.5, repeat: Infinity }} x1="10%" y1="50%" x2="40%" y2="50%" stroke="#3b82f6" strokeWidth="3" strokeDasharray="6 6" />
                <motion.circle cx="50%" cy="50%" r="30" fill="rgba(59,130,246,0.1)" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5 5" className="animate-spin" style={{ animationDuration: '4s' }} />
                <motion.line initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 0.5, repeat: Infinity }} x1="60%" y1="50%" x2="90%" y2="50%" stroke="#22c55e" strokeWidth="3" strokeDasharray="6 6" />
              </svg>
              <div className="z-10 text-center font-bold text-slate-700 dark:text-slate-300">
                <span className="block text-2xl mb-2 text-blue-500">Q + K Match</span>
                <span className="text-sm text-green-500">Extract V</span>
              </div>
            </>
          )}
        </div>

        {/* Output */}
        <div className={\\\`flex flex-col items-center gap-2 w-1/4 \\\${perspective==='expert'?'':'opacity-90'}\\\`}>
           <div className={\\\`w-16 h-16 md:w-20 md:h-20 bg-slate-200 dark:bg-slate-700 flex items-center justify-center border-2 \\\${perspective==='expert'?'border-slate-600 rounded':'border-green-500 rounded-full shadow-[0_0_15px_rgba(34,197,94,0.5)]'}\\\`}>
             <span className={\\\`font-bold text-center leading-tight \\\${perspective==='expert'?'font-mono text-sm':'text-sm md:text-lg'}\\\`}>{perspective === 'expert' ? 'Z_m' : t.visuals.fused}</span>
           </div>
           {perspective === 'expert' && <span className="text-[10px] text-slate-500 font-mono mt-2 text-center w-full block">Concat & W_o</span>}
        </div>
      </div>

    </div>
  );
}\`

let s = lines.findIndex(l => l.includes('function AttentionVisual()'));
let e = lines.findIndex(l => l.includes('function ResidualNormVisual()'));

if (s !== -1 && e !== -1) {
  let newLines = lines.slice(0, s);
  newLines.push(expertAttentionCode);
  newLines = newLines.concat(lines.slice(e));
  fs.writeFileSync('src/App.tsx', newLines.join('\\n'));
}
