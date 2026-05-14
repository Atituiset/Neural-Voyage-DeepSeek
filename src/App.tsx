import React, { useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { Brain, Database, Cpu, Network, Zap, Lock, ScanLine, Layers, Aperture } from 'lucide-react';

function Section({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={`min-h-screen flex items-center items-center justify-center relative px-6 md:px-12 py-24 ${className}`}>
      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {children}
      </div>
    </section>
  );
}

function SectionContent({ title, description, icon: Icon }: { title: string; description: string; icon: React.ElementType }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      viewport={{ once: false, margin: "-100px" }}
      className="space-y-6"
    >
      <div className="inline-flex items-center justify-center p-4 bg-blue-900/30 border border-blue-500/50 rounded-2xl mb-4">
        <Icon className="w-10 h-10 text-cyan-400" />
      </div>
      <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-600">
        {title}
      </h2>
      <p className="text-xl text-slate-300 leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}

function TokenizationVisual() {
  const sentence = "大模型的原理是什么？";
  const tokens = ["大", "模型", "的", "原理", "是", "什么", "？"];
  
  return (
    <div className="relative h-96 bg-slate-900/50 border border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center overflow-hidden">
      <motion.h3 
        initial={{ opacity: 1 }}
        whileInView={{ opacity: 0 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="text-3xl font-bold text-white mb-12 absolute top-1/3"
      >
        {sentence}
      </motion.h3>
      
      <div className="flex flex-wrap gap-3 justify-center mt-auto z-10">
        {tokens.map((token, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 1.5 + (i * 0.1), type: 'spring' }}
            style={{ 
              boxShadow: '0 0 20px rgba(6, 182, 212, 0.4)' 
            }}
            className="px-6 py-4 bg-slate-800 border border-cyan-500/50 rounded-xl text-2xl font-semibold text-cyan-300"
          >
            {token}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function EmbeddingVisual() {
  const tokens = ["大", "模型", "的"];
  
  return (
    <div className="relative h-96 bg-slate-900/50 border border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-between overflow-hidden">
       {/* Scanner projector */}
       <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-0 w-full flex justify-center pt-6"
      >
        <div className="relative">
          <ScanLine className="w-16 h-16 text-purple-400 z-10 relative bg-slate-900 rounded-full p-2 border border-purple-500/30" />
          <motion.div 
            animate={{ 
              height: [0, 250, 0],
              opacity: [0, 0.5, 0]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 w-32 bg-gradient-to-b from-purple-500 to-transparent opacity-30 z-0"
            style={{ clipPath: 'polygon(50% 0, 100% 100%, 0 100%)' }}
          />
        </div>
      </motion.div>

      <div className="flex gap-8 justify-center mt-24 z-10 w-full relative">
        {tokens.map((token, i) => (
          <div key={i} className="flex flex-col items-center gap-4">
             <motion.div
              initial={{ y: -20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              className="px-4 py-2 bg-slate-800 border border-purple-500/50 rounded-lg text-lg font-semibold text-purple-300"
            >
              {token}
            </motion.div>
            
            <div className="flex flex-col gap-1">
              {[...Array(6)].map((_, j) => (
                <motion.div
                  key={j}
                  initial={{ rotateX: 90, opacity: 0 }}
                  whileInView={{ rotateX: 0, opacity: 1 }}
                  transition={{ delay: 0.5 + (i * 0.2) + (j * 0.1) }}
                  className="w-12 h-6 bg-purple-900/40 border border-purple-700/50 rounded flex items-center justify-center text-[10px] text-purple-400 font-mono"
                >
                  {(Math.random() * 2 - 1).toFixed(2)}
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AttentionVisual() {
  const qkv = [
    { label: 'Q', color: 'text-red-400', border: 'border-red-500/50', bg: 'bg-red-900/30' },
    { label: 'K', color: 'text-green-400', border: 'border-green-500/50', bg: 'bg-green-900/30' },
    { label: 'V', color: 'text-blue-400', border: 'border-blue-500/50', bg: 'bg-blue-900/30' },
  ];

  return (
    <div className="relative h-96 bg-slate-900/50 border border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center overflow-hidden">
      <div className="w-full h-full flex justify-between items-center relative">
        
        {/* Token 1 */}
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-slate-800 border border-slate-600 rounded-xl flex items-center justify-center text-xl font-bold mb-8 z-10">
            Token A
          </div>
          <div className="flex gap-2">
            {qkv.map((item, i) => (
               <motion.div
                key={i}
                initial={{ y: -40, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.2 }}
                className={`w-10 h-10 rounded-full border flex items-center justify-center font-bold ${item.color} ${item.border} ${item.bg} z-10 relative`}
              >
                {item.label}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Connections and Matrix */}
        <motion.div 
           initial={{ scale: 0.5, opacity: 0 }}
           whileInView={{ scale: 1, opacity: 1 }}
           transition={{ delay: 1 }}
           className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-slate-700 bg-slate-800/80 rounded-xl grid grid-cols-3 grid-rows-3 gap-1 p-2"
        >
          {[...Array(9)].map((_, i) => (
             <motion.div
               key={i}
               animate={{ opacity: [0.3, 1, 0.3] }}
               transition={{ duration: 2, repeat: Infinity, delay: Math.random() * 2 }}
               className={`w-full h-full rounded ${i % 2 === 0 ? 'bg-cyan-500/40' : 'bg-purple-500/40'}`}
             />
          ))}
          <div className="absolute inset-0 flex items-center justify-center font-bold text-slate-300 pointer-events-none drop-shadow-md">
            W Matrix
          </div>
        </motion.div>

        {/* Token 2 */}
         <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-slate-800 border border-slate-600 rounded-xl flex items-center justify-center text-xl font-bold mb-8 z-10">
            Token B
          </div>
          <div className="flex gap-2">
            {qkv.map((item, i) => (
               <motion.div
                key={i}
                initial={{ y: -40, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 + (i * 0.2) }}
                className={`w-10 h-10 rounded-full border flex items-center justify-center font-bold ${item.color} ${item.border} ${item.bg} z-10 relative`}
              >
                {item.label}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Animated Line Q to K */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
           <motion.path
             initial={{ pathLength: 0, opacity: 0 }}
             whileInView={{ pathLength: 1, opacity: 1 }}
             transition={{ duration: 1, delay: 1.5 }}
             d="M 120 250 Q 250 150 380 250"
             fill="transparent"
             stroke="rgba(34, 211, 238, 0.5)"
             strokeWidth="2"
             strokeDasharray="5,5"
           />
           {/* Moving particle along line */}
           <motion.circle
             r="4"
             fill="#22d3ee"
             animate={{ offsetDistance: ["0%", "100%"] }}
             transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
             style={{ offsetPath: "path('M 120 250 Q 250 150 380 250')" } as any}
           />
        </svg>

      </div>
    </div>
  );
}

function MoEVisual() {
  const experts = 8;
  const activeExperts = [2, 5];

  return (
    <div className="relative h-96 bg-slate-900/50 border border-slate-800 rounded-3xl p-8 flex items-center justify-center overflow-hidden">
      <div className="w-full max-w-md relative">
        <div className="absolute top-1/2 left-0 -translate-y-1/2 flex items-center">
            {/* Input Token */}
            <motion.div
              animate={{ x: [0, 80], opacity: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-10 h-10 bg-cyan-500 rounded flex items-center justify-center font-bold absolute left-0"
            >
              T
            </motion.div>
            {/* Router */}
            <div className="w-16 h-16 rounded-full border-2 border-yellow-500 bg-yellow-900/30 flex items-center justify-center z-10 ml-24 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]">
              <Network className="text-yellow-400 w-8 h-8" />
            </div>
        </div>

        <div className="ml-48 grid grid-cols-2 grid-rows-4 gap-4 h-full">
          {[...Array(experts)].map((_, i) => (
             <motion.div
               key={i}
               initial={{ borderColor: 'rgba(51, 65, 85, 0.5)' }}
               whileInView={{
                 borderColor: activeExperts.includes(i) ? 'rgba(34, 211, 238, 1)' : 'rgba(51, 65, 85, 0.5)',
                 boxShadow: activeExperts.includes(i) ? '0 0 20px rgba(34, 211, 238, 0.6)' : 'none',
                 scale: activeExperts.includes(i) ? 1.05 : 1
               }}
               transition={{ delay: 1, duration: 0.5 }}
               className={`h-16 rounded-lg border-2 flex flex-col items-center justify-center transition-all ${
                 activeExperts.includes(i) ? 'bg-cyan-900/40 text-cyan-300' : 'bg-slate-800/40 text-slate-500'
               }`}
             >
                <Database className="w-5 h-5 mb-1" />
                <span className="text-xs">Expert {i+1}</span>
             </motion.div>
          ))}
        </div>
        
        {/* Trigger Beams */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none -z-10">
           {activeExperts.map((expertIndex, j) => {
             const row = Math.floor(expertIndex / 2);
             const col = expertIndex % 2;
             const x = 200 + (col * 100);
             const y = 50 + (row * 80);
             
             return (
              <motion.line
                key={j}
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                x1="160" y1="190" x2={x+""} y2={y+""}
                stroke="rgba(34, 211, 238, 0.8)"
                strokeWidth="2"
              />
             );
           })}
        </svg>

      </div>
    </div>
  );
}

function SoftmaxVisual() {
  return (
    <div className="relative h-96 bg-slate-900/50 border border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center overflow-hidden">
      
      <div className="flex gap-4 mb-16 px-12 pb-4 border-b border-slate-700 z-10 w-full justify-between overflow-x-hidden">
         {[0.02, 0.05, 0.01, 0.82, 0.03, 0.07].map((val, i) => (
           <motion.div 
            key={i}
             initial={{ height: 0, opacity: 0 }}
             whileInView={{ height: val * 150, opacity: 1 }}
             transition={{ delay: 0.5 + (i * 0.1), duration: 1 }}
             className={`w-12 rounded-t-sm flex items-end justify-center pb-2 text-xs font-bold ${
               val > 0.5 ? 'bg-green-500/80 text-white drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]' : 'bg-slate-600 text-slate-400'
             }`}
             style={{ transformOrigin: 'bottom' }}
           >
             {val.toFixed(2)}
           </motion.div>
         ))}
      </div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.5, type: 'spring' }}
        className="w-32 h-32 rounded-2xl bg-gradient-to-br from-green-400 to-cyan-500 flex items-center justify-center text-4xl font-bold text-white shadow-[0_0_40px_rgba(34,197,94,0.6)] z-20"
      >
        生成
      </motion.div>

      {/* Projection Triangle */}
      <motion.div 
         initial={{ opacity: 0 }}
         whileInView={{ opacity: 0.2 }}
         transition={{ delay: 1 }}
         className="absolute bottom-24 left-1/2 -translate-x-1/2 w-[80%] h-48 bg-gradient-to-t from-green-500 to-transparent"
         style={{ clipPath: 'polygon(50% 100%, 0 0, 100% 0)' }}
      />
    </div>
  )
}

function Hero() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <motion.div 
      style={{ y: y1, opacity }}
      className="h-screen flex flex-col items-center justify-center relative text-center px-4"
    >
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1620121692029-d088224ddc74?q=80&w=2832&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#020617]"></div>
      
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="z-10 relative"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700 text-slate-300 mb-8 backdrop-blur-sm">
          <Aperture className="w-5 h-5 text-cyan-400" />
           硬核解析 · 沉浸式图解
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-500">
            大模型内部运行原理 
          </span>
          <br/>奇妙之旅
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed mb-12">
          你只是随手点开了一个对话框，没想到下一秒，一阵眩晕，你整个人被吸入了模型内部……
        </p>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-[1px] h-24 bg-gradient-to-b from-cyan-400 to-transparent mx-auto"></div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default function App() {
  return (
    <div className="bg-[#020617] min-h-screen text-slate-50 font-sans selection:bg-cyan-900 selection:text-cyan-100 overflow-x-hidden">
      
      {/* Dynamic Grid Background */}
      <div className="fixed inset-0 z-0 pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
      }}></div>

      <Hero />

      <main className="relative z-10 pb-32">
        <Section>
           <SectionContent 
             title="1. 分词系统 (Tokenizer)" 
             description="你的问题不再是普通的文字。它们在这里被无情地拆解，变成了一个个被称为 'Token' 的独立词块，这是大模型理解你的第一步。"
             icon={ScanLine}
           />
           <TokenizationVisual />
        </Section>

        <Section className="bg-slate-900/20 border-y border-slate-800">
           <EmbeddingVisual />
           <SectionContent 
             title="2. 嵌入层 (Embedding)" 
             description="巨大的投影装置从天而降。文字词块在这里被转化为了计算机能够识别的 '向量' (Vector)。它们化作一列数字列车，向网络深处驶去。"
             icon={Layers}
           />
        </Section>

        <Section>
           <SectionContent 
             title="3. 注意力机制 (Attention)" 
             description="迎面而来的是核心区域。在这里，每个 Token 幻化出三个维度分身：Q (查询)、K (键)、V (值)。它们在这个矩阵中飞速匹配，交换灵魂深处的信息，建立上下文关联。"
             icon={Brain}
           />
           <AttentionVisual />
        </Section>

        <Section className="bg-slate-900/20 border-y border-slate-800">
           <MoEVisual />
           <SectionContent 
             title="4. 混合专家 (MoE)" 
             description="穿过发光的迷宫，一座由无数子舱组成的混合专家模型映入门帘。门控网络瞬间完成计算，精准点亮对应的几位 '专家' 接管任务。在保留海量知识的同时，节约了巨量算力。"
             icon={Network}
           />
        </Section>

        <Section>
           <SectionContent 
             title="5. 回归与生成 (Softmax)" 
             description="旅程接近终点。线性投影层结合 Softmax 算法，将无形的向量映射回人类能够理解的词汇概率表。高悬的系统锁定概率最高的那颗完美词汇，至此，循环开启。"
             icon={Zap}
           />
           <SoftmaxVisual />
        </Section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800 py-12 text-center text-slate-500">
        <p>致敬 DeepSeek v4 架构灵感 · 动态可视化演示</p>
      </footer>
    </div>
  );
}
