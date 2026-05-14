import React, { useState } from 'react';

const blockData = {
  tok: {
    zh: { title: "Token 嵌入 (Embedding)", desc: "将离散词汇映射到高维稠密空间向量 𝒳" },
    en: { title: "Token Embedding", desc: "Maps discrete tokens to dense continuous vectors 𝒳" },
    color: "from-purple-500 to-fuchsia-600"
  },
  pos: {
    zh: { title: "位置编码 (Positional Encoding)", desc: "注入序列位置信号 (绝对/相对/RoPE)，使模型感知次序" },
    en: { title: "Positional Encoding", desc: "Injects sequence position signals (Absolute/Relative/RoPE)" },
    color: "from-blue-500 to-indigo-600"
  },
  ln1: {
    zh: { title: "层归一化 (RMSNorm)", desc: "稳定前向梯度与激活分布，现多采用无均值漂移的 RMSNorm" },
    en: { title: "Layer Normalization (RMSNorm)", desc: "Stabilizes gradients. Now mostly mean-free RMSNorm" },
    color: "from-emerald-500 to-teal-600"
  },
  attn: {
    zh: { title: "多头自注意力 (Multi-Head Attention)", desc: "QKV矩阵乘法，获取全局上下文依赖，带有因果掩码避免窥视未来" },
    en: { title: "Multi-Head Attention", desc: "QKV matrix multiplication for global context dependency, heavily masked" },
    color: "from-sky-400 to-blue-500"
  },
  add1: {
    zh: { title: "残差相加 (Add)", desc: "保留原始特征进入下一阶段，X + Attention(X)" },
    en: { title: "Residual Add", desc: "Preserve raw features into the next stage, X + Attention(X)" },
    color: "from-slate-400 to-slate-500"
  },
  ln2: {
    zh: { title: "层归一化 (RMSNorm)", desc: "对注意力聚合后的表征进行再度归一化处理" },
    en: { title: "Layer Normalization", desc: "Re-normalize representations after attention aggregation" },
    color: "from-emerald-500 to-teal-600"
  },
  ffn: {
    zh: { title: "前馈网络 (SwiGLU FFN / MoE)", desc: "门控非线性升维映射，或动态路由到稀疏专家网络进行知识提取" },
    en: { title: "Feed-Forward / MoE", desc: "Gated non-linear high-dimensional mapping or sparse expert routing" },
    color: "from-orange-500 to-pink-600"
  },
  add2: {
    zh: { title: "残差相加 (Add)", desc: "最终汇总：X + FFN(X)，完成单层计算" },
    en: { title: "Residual Add", desc: "Final summation: X + FFN(X) for a single layer" },
    color: "from-slate-400 to-slate-500"
  },
  out_ln: {
    zh: { title: "最终归一化 (Final Norm)", desc: "准备映射回词表前的最后一次归一化" },
    en: { title: "Final Norm", desc: "Last normalization before logit projection" },
    color: "from-emerald-500 to-teal-600"
  },
  logits: {
    zh: { title: "分类器头 (LM Head)", desc: "解码到模型词表维度的离散分布 (Logits)" },
    en: { title: "LM Head", desc: "Decodes to discrete vocabulary likelihoods (Logits)" },
    color: "from-rose-500 to-red-600"
  },
  softmax: {
    zh: { title: "Softmax 与 采样机制", desc: "转化为概率并根据 Top-P, Temperature 进行采样" },
    en: { title: "Softmax & Sampling", desc: "Convert to probabilities and sample via Top-P/Temp" },
    color: "from-yellow-400 to-amber-500"
  }
};

export function GeekPerspectiveView() {
  const { lang } = useLanguage();
  const [hovered, setHovered] = useState(null);

  const Node = ({ id, w = "w-64", h = "h-16" }) => {
     const isHovered = hovered === id;
     const data = blockData[id][lang];
     const color = blockData[id].color;
     
     return (
       <div 
         className="relative group cursor-crosshair z-10"
         onMouseEnter={() => setHovered(id)}
         onMouseLeave={() => setHovered(null)}
       >
         <div className={\`flex items-center justify-center \${w} \${h} rounded-lg shadow-lg \${isHovered ? 'scale-105 ring-4 ring-offset-2 ring-offset-slate-900 ring-cyan-400' : ''} bg-gradient-to-r \${color} transition-all duration-300\`}>
            <span className="font-bold text-white tracking-wide text-center px-4">{data.title}</span>
         </div>
         {isHovered && (
           <div className="absolute top-1/2 left-[calc(100%+20px)] -translate-y-1/2 w-64 p-4 bg-slate-900/95 border border-slate-700 shadow-2xl rounded-xl z-50 animate-in fade-in zoom-in duration-200 pointer-events-none">
             <div className="text-cyan-400 font-mono text-xs mb-2">Node Info</div>
             <div className="text-white text-sm font-light leading-relaxed">{data.desc}</div>
           </div>
         )}
       </div>
     )
  }

  return (
    <div className="w-full relative z-10 py-16 px-4 flex flex-col items-center overflow-x-auto min-h-[1200px]">
      <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-600 mb-2">
         {lang === 'zh' ? 'Transformer 交互数据流全景' : 'Transformer Interactive Pipeline Map'}
      </h2>
      <p className="text-slate-500 mb-12">{lang === 'zh' ? '悬停以探索网络节点工作原理' : 'Hover over nodes to explore network mechanics'}</p>
      
      <div className="relative flex flex-col items-center gap-6 min-w-[800px]">
         {/* BG SVGs */}
         <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-50" style={{ zIndex: 0 }}>
             <path d="M 400 30 L 400 1100" stroke="url(#line-grad)" strokeWidth="4" strokeDasharray="6 6" fill="none" className="animate-[pulse_2s_ease-in-out_infinite]" />
             
             {/* Skip connection 1 */}
             <path d="M 400 220 C 150 250, 150 500, 400 530" stroke="rgba(255,255,255,0.2)" strokeWidth="4" fill="none" />
             <path d="M 400 580 C 150 610, 150 780, 400 810" stroke="rgba(255,255,255,0.2)" strokeWidth="4" fill="none" />
             
             <defs>
               <linearGradient id="line-grad" x1="0" y1="0" x2="0" y2="1">
                 <stop offset="0%" stopColor="#3b82f6" />
                 <stop offset="50%" stopColor="#8b5cf6" />
                 <stop offset="100%" stopColor="#ec4899" />
               </linearGradient>
             </defs>
         </svg>

         <div className="text-slate-400 font-mono mb-4 text-xl">Inputs (Tokens)</div>
         
         <div className="flex gap-4">
             <Node id="tok" w="w-48" />
             <Node id="pos" w="w-48" />
         </div>
         
         <div className="text-slate-400 font-mono my-4 text-2xl">+</div>

         <div className="border border-slate-700 bg-slate-800/50 p-8 rounded-3xl flex flex-col items-center gap-6 relative shadow-[0_0_50px_rgba(30,41,59,0.5)]">
            <div className="absolute -left-32 top-1/2 -translate-y-1/2 text-slate-500 font-mono vertical-text rotate-180 tracking-widest uppercase">
               Nx Layers
            </div>

            <Node id="ln1" />
            
            <div className="flex gap-4 items-center">
               <Node id="attn" w="w-72" h="h-24" />
            </div>

            <Node id="add1" w="w-32" h="h-10" />

            <Node id="ln2" />

            <Node id="ffn" w="w-72" h="h-24" />

            <Node id="add2" w="w-32" h="h-10" />
         </div>

         <div className="my-4"></div>

         <Node id="out_ln" />
         
         <Node id="logits" />
         
         <Node id="softmax" />

         <div className="text-slate-400 font-mono mt-4 text-xl">Outputs (Next Token)</div>
                 
      </div>
    </div>
  )
}
