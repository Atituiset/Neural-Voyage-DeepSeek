const fs = require('fs');

const geekData = `
const geekData = {
  tok: {
    title: "Token Embedding",
    title_zh: "Token 嵌入",
    shapes: "𝒳_in: [B, T]  ➔  𝒳_out: [B, T, d_model]",
    math: "E(x_i) = W_e[t_i] \\cdot \\sqrt{d_{model}}",
    code: "def embed(tokens, W_e):\\n    return W_e[tokens] * math.sqrt(d_model)",
    desc_zh: "查表操作，将离散的整数索引映射为稠密连续的浮点特征向量。",
    desc_en: "Lookup operation mapping discrete integer indices to dense continuous floating-point feature vectors.",
    complexity: "𝒪(1) per token",
    color: "from-purple-500 to-fuchsia-600"
  },
  pos: {
    title: "Rotary Positional Embedding (RoPE)",
    title_zh: "位置编码",
    shapes: "𝒳: [B, T, n_heads, d_k]  ➔  𝒳': [B, T, n_heads, d_k]",
    math: "R_{\\Theta, m} x = (\\cos m\\theta) x + (\\sin m\\theta) x_\\perp",
    code: "def apply_rotary_emb(xq, xk, freqs_cis):\\n    xq_ = torch.view_as_complex(xq.float().reshape(*xq.shape[:-1], -1, 2))\\n    xk_ = torch.view_as_complex(xk.float().reshape(*xk.shape[:-1], -1, 2))\\n    xq_out = torch.view_as_real(xq_ * freqs_cis).flatten(3)\\n    xk_out = torch.view_as_real(xk_ * freqs_cis).flatten(3)\\n    return xq_out.type_as(xq), xk_out.type_as(xk)",
    desc_zh: "通过对 Q、K 特征切片进行复数范围内的旋转变换，在不改变绝对大小的前提下，巧妙地注入相对位置信息。",
    desc_en: "Explicitly encodes relative position information by applying complex rotations to the query and key representations.",
    complexity: "𝒪(T · d_model)",
    color: "from-blue-500 to-indigo-600"
  },
  ln1: {
    title: "Layer Normalization (RMSNorm)",
    title_zh: "层归一化",
    shapes: "𝒳: [B, T, d_model] ➔ [B, T, d_model]",
    math: "\\\\text{RMSNorm}(x) = \\\\frac{x}{\\\\sqrt{\\\\frac{1}{d}\\\\sum_{i=1}^d x_i^2 + \\\\epsilon}} \\\\odot \\\\gamma",
    code: "def rms_norm(x, weight, eps=1e-6):\\n    variance = x.pow(2).mean(-1, keepdim=True)\\n    return x * torch.rsqrt(variance + eps) * weight",
    desc_zh: "稳定前向梯度与激活分布，现多采用无均值漂移的 RMSNorm。",
    desc_en: "Stabilizes gradients and activations. Modern models often use mean-free RMSNorm.",
    complexity: "𝒪(T · d_model)",
    color: "from-emerald-500 to-teal-600"
  },
  attn: {
    title: "Paged Causal Multi-Head Attention",
    title_zh: "多头自注意力",
    shapes: "Q,K,V: [B, T, d_model] ➔ [B, n_heads, T, d_k] ➔ [B, T, d_model]",
    math: "\\\\text{Attention}(Q,K,V) = \\\\text{softmax}\\\\left(\\\\frac{QK^T}{\\\\sqrt{d_k}} \\\\odot M\\\\right)V",
    code: "def paged_attention(query, key_cache, value_cache, block_tables):\\n    attn_weights = []\\n    for block_idx in block_tables:\\n       k_block = key_cache[block_idx]\\n       score = query @ k_block.T / math.sqrt(d_k)\\n       attn_weights.append(score)\\n    probs = F.softmax(torch.cat(attn_weights), dim=-1)\\n    return probs @ v_blocks",
    desc_zh: "大模型推理的核心。基于 PagedAttention 分页对 KV Cache 寻址执行缩放点积。",
    desc_en: "The core of LLM scaling. Executes scaled dot-product attention utilizing PagedAttention for KV memory management.",
    complexity: "𝒪(T² · d_model)",
    color: "from-sky-400 to-blue-500"
  },
  add1: {
    title: "Residual Add",
    title_zh: "残差相加",
    shapes: "𝒳_new = 𝒳_old + 𝒳_attn",
    math: "x^{(l)} = x^{(l-1)} + \\\\text{Attn}(\\\\text{LN}(x^{(l-1)}))",
    code: "x = x + attn_output",
    desc_zh: "保留原始特征进入下一阶段，X + Attention(X)，避免梯度消失。",
    desc_en: "Preserve raw features into the next stage, X + Attention(X), preventing vanishing gradients.",
    complexity: "𝒪(T · d_model)",
    color: "from-slate-400 to-slate-500"
  },
  ln2: {
    title: "Layer Norm (RMSNorm)",
    title_zh: "前馈层归一化",
    shapes: "𝒳: [B, T, d_model] ➔ [B, T, d_model]",
    math: "\\\\text{RMSNorm}(x) = \\\\dots",
    code: "x_norm = rms_norm(x, ffn_norm_weight)",
    desc_zh: "再次缩放与平移，为 FFN 的非线性变换做准备。",
    desc_en: "Prepares activations for the non-linear Feed-Forward network.",
    complexity: "𝒪(T · d_model)",
    color: "from-emerald-500 to-teal-600"
  },
  ffn: {
    title: "SwiGLU FFN / Sparse MoE",
    title_zh: "前馈网络 / 混合专家",
    shapes: "𝒳: [B, T, d_model] ➔ [B, T, d_hidden] ➔ [B, T, d_model]",
    math: "\\\\text{MoE}(x) = \\\\sum w_i \\\\cdot ( \\\\text{SiLU}(x W_{g,i}) \\\\odot x W_{u,i} ) W_{d,i}",
    code: "def moe_ffn(x, router, experts):\\n    routing_weights, selected_experts = router(x).topk(2, dim=-1)\\n    routing_weights = F.softmax(routing_weights, dim=-1)\\n    final_output = torch.zeros_like(x)\\n    for i, expert in enumerate(experts):\\n        expert_out = expert(x) # SwiGLU\\n        final_output += expert_out * routing_weights[:, i:i+1]\\n    return final_output",
    desc_zh: "采用门控单元的 SwiGLU。搭配路由网络仅激活 Top-K 专家，在不增加计算的前提下扩大模型容量。",
    desc_en: "SwiGLU FFN gating. Often paired with a routing network to only activate Top-K experts.",
    complexity: "𝒪(T · d_model · d_hidden) per expert",
    color: "from-orange-500 to-pink-600"
  },
  add2: {
    title: "Residual Add",
    title_zh: "残差相加",
    shapes: "𝒳_new = 𝒳_old + 𝒳_ffn",
    math: "x^{(l+1)} = x^{(l)} + \\\\text{FFN}(\\\\text{LN}(x^{(l)}))",
    code: "x = x + ffn_output",
    desc_zh: "单层 Transformer Block 的最终汇总。",
    desc_en: "Final residual aggregation completing one Transformer layer.",
    complexity: "𝒪(T · d_model)",
    color: "from-slate-400 to-slate-500"
  },
  out_ln: {
    title: "Final Norm",
    title_zh: "最终归一化",
    shapes: "𝒳: [B, T, d_model] ➔ [B, T, d_model]",
    math: "\\\\text{RMSNorm}(x_{final})",
    code: "x = rms_norm(x, output_norm_weight)",
    desc_zh: "准备映射回词表前的最后一次归一化。",
    desc_en: "Last normalization step before logit projection.",
    complexity: "𝒪(T · d_model)",
    color: "from-emerald-500 to-teal-600"
  },
  logits: {
    title: "Logits Projection",
    title_zh: "分类器头",
    shapes: "𝒳: [B, T, d_model] ➔ Logits: [B, T, |V|]",
    math: "\\\\text{Logits} = x \\\\cdot W_{vocab}^T",
    code: "logits = linear(x, weight=vocab_weights)\\n# shape: (B, T, vocab_size)",
    desc_zh: "无偏线性映射至浩如烟海的词表空间。",
    desc_en: "Unbiased linear mapping to the vocabulary space, outputting log-odds for every token.",
    complexity: "𝒪(T · d_model · |V|)",
    color: "from-rose-500 to-red-600"
  },
  softmax: {
    title: "Softmax & Nucleus Sampling",
    title_zh: "采样机制",
    shapes: "Logits: [B, T, |V|] ➔ ℤ",
    math: "\\\\hat{P}(x) = \\\\text{softmax}(\\\\text{Logits} / \\\\tau)",
    code: "probs = F.softmax(logits / temperature, dim=-1)\\n\\n# Nucleus (Top-p) Sampling\\nsorted_probs, sorted_indices = torch.sort(probs, descending=True)\\ncumulative_probs = torch.cumsum(sorted_probs, dim=-1)\\nprobs_to_remove = cumulative_probs > top_p\\nprobs[probs_to_remove] = 0.0\\nprobs = probs / probs.sum()\\n\\nnext_token = torch.multinomial(probs, num_samples=1)",
    desc_zh: "转化为概率并根据 Top-P, Temperature 截断与缩放后采样最终 Token。",
    desc_en: "Temperature and Top-p truncate and shift the distribution, sampling yields the next Token.",
    complexity: "𝒪(|V| \\\\log |V|)",
    color: "from-yellow-400 to-amber-500"
  }
};

function GeekPerspectiveView() {
  const { lang } = useLanguage();
  const [activeNode, setActiveNode] = useState('tok');
  
  const Node = ({ id, w = "w-48", h = "h-16", center=true, isLayer=false }: { id: keyof typeof geekData, w?: string, h?: string, center?: boolean, isLayer?: boolean }) => {
     const isActive = activeNode === id;
     const data = geekData[id];
     const color = data.color;
     
     return (
       <div 
         className="relative group cursor-pointer z-10"
         onMouseEnter={() => setActiveNode(id)}
         onClick={() => setActiveNode(id)}
       >
         <div className={\`flex flex-col items-center justify-center \${w} \${h} rounded-lg shadow-lg \${isActive ? 'scale-[1.03] ring-4 ring-offset-2 ring-offset-slate-950 ring-cyan-400 z-20 shadow-[0_0_20px_rgba(34,211,238,0.5)]' : 'opacity-80 hover:opacity-100 ring-1 ring-white/10'} bg-gradient-to-r \${color} transition-all duration-300\`}>
            <span className={\`font-bold text-white tracking-wide px-4 leading-tight \${center?'text-center':''}\`}>{lang === 'zh' ? data.title_zh : data.title}</span>
         </div>
       </div>
     )
  }

  const data = geekData[activeNode as keyof typeof geekData];

  return (
    <div className="w-full relative z-10 py-8 px-4 flex flex-col xl:flex-row gap-6 lg:h-[1100px] max-w-[1600px] mx-auto items-stretch overflow-hidden">
       {/* Left Panel: Graphic Flowchart (Interactive View) */}
       <div className="flex-[3] lg:flex-[3] bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-auto flex flex-col custom-scrollbar">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiIGZpbGw9Im5vbmUiLz4KPHBhdGggZD0iTTAgMGgwLjV2NDBIMHoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMSkiLz4KPHBhdGggZD0iTTAgMGg0MHYwLjVIMHoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMSkiLz4KPC9zdmc+')] pointer-events-none opacity-50"></div>
          
          <div className="sticky top-0 left-0 z-50 flex items-center justify-between gap-3 bg-slate-950/80 backdrop-blur pb-4 border-b border-slate-800 w-full pt-2">
            <div className="flex items-center gap-3">
              <Network className="w-6 h-6 text-cyan-500" />
              <h3 className="text-xl font-bold font-mono text-slate-200">
                {lang === 'zh' ? '交互架构拓扑' : 'Interactive Topology'}
              </h3>
            </div>
            <div className="text-sm text-slate-500 font-mono animate-pulse">
                {lang === 'zh' ? '点击或悬浮节点查看详情' : 'Hover/Click nodes for details'}
            </div>
          </div>

          <div className="relative flex flex-col items-center gap-6 min-w-[700px] py-12 px-8 flex-1 mt-6">
             <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-60" style={{ zIndex: 0 }}>
                 <path d="M 350 30 L 350 1100" stroke="url(#line-grad)" strokeWidth="4" strokeDasharray="6 6" fill="none" className="animate-[pulse_2s_ease-in-out_infinite]" />
                 
                 {/* Skip connection 1 (Add1 to LN1) */}
                 <path d="M 350 240 C 140 250, 100 480, 350 510" stroke="currentColor" className="text-slate-500 dark:text-slate-600" strokeWidth="4" fill="none" />
                 <circle cx="350" cy="510" r="4" fill="#94a3b8" />

                 {/* Skip connection 2 (Add2 to LN2) */}
                 <path d="M 350 600 C 140 610, 100 820, 350 850" stroke="currentColor" className="text-slate-500 dark:text-slate-600" strokeWidth="4" fill="none" />
                 <circle cx="350" cy="850" r="4" fill="#94a3b8" />

                 <defs>
                   <linearGradient id="line-grad" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="0%" stopColor="#06b6d4" />
                     <stop offset="50%" stopColor="#8b5cf6" />
                     <stop offset="100%" stopColor="#ec4899" />
                   </linearGradient>
                 </defs>
             </svg>

             <div className="bg-slate-800/80 px-6 py-2 rounded-full border border-slate-600 shadow-xl text-slate-400 font-mono text-lg z-10 mb-4">Inputs (Tokens)</div>
             
             <div className="flex gap-4 w-full justify-center">
                 <Node id="tok" w="w-48" />
                 <Node id="pos" w="w-48" />
             </div>
             
             <div className="text-slate-500 font-mono my-4 text-3xl font-light z-10">+</div>

             <div className="border border-cyan-500/30 bg-[#0f172a] w-full max-w-2xl p-8 rounded-[2.5rem] flex flex-col items-center gap-8 relative shadow-[0_0_60px_rgba(6,182,212,0.1)] z-10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/20 to-blue-950/20 pointer-events-none"></div>

                <div className="absolute -left-12 sm:-left-32 top-1/2 -translate-y-1/2 text-cyan-600/30 font-mono tracking-widest uppercase text-2xl sm:text-3xl font-bold pointer-events-none" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg) translateY(50%)' }}>
                   Nx Layers
                </div>

                <Node id="ln1" w="w-full max-w-sm" />
                
                <div className="flex gap-6 items-center justify-center my-2 transition-transform hover:scale-105">
                   <div className="flex flex-col gap-2 items-center">
                      <div className="w-10 h-10 bg-blue-500/80 rounded flex items-center justify-center text-white font-bold shadow shadow-blue-500/50">Q</div>
                      <div className="w-1.5 h-10 bg-blue-500/50 rounded-full"></div>
                   </div>
                   <div className="flex flex-col gap-2 items-center">
                      <div className="w-10 h-10 bg-amber-500/80 rounded flex items-center justify-center text-white font-bold shadow shadow-amber-500/50">K</div>
                      <div className="w-1.5 h-10 bg-amber-500/50 rounded-full"></div>
                   </div>
                   <div className="flex flex-col gap-2 items-center relative top-8">
                      <div className="w-10 h-10 bg-green-500/80 rounded flex items-center justify-center text-white font-bold shadow shadow-green-500/50">V</div>
                      <div className="w-1.5 h-10 bg-green-500/50 rounded-full"></div>
                   </div>
                </div>

                <Node id="attn" w="w-full max-w-md" h="h-20" />

                <Node id="add1" w="w-32" h="h-10" />

                <Node id="ln2" w="w-full max-w-sm" />

                <Node id="ffn" w="w-full max-w-md" h="h-20" />

                <Node id="add2" w="w-32" h="h-10" />
             </div>

             <div className="my-2 z-10"></div>

             <Node id="out_ln" w="w-1/2 max-w-sm" />
             <Node id="logits" w="w-1/2 max-w-sm" />
             <Node id="softmax" w="w-1/2 max-w-sm" />

             <div className="bg-slate-800/80 px-6 py-2 mt-4 rounded-full border border-slate-600 shadow-xl text-slate-400 font-mono text-lg z-10">Outputs (Next Token)</div>
          </div>
       </div>

       {/* Right Panel: Deep Dive Inspector */}
       <div className="flex-[2] lg:flex-[2] flex flex-col h-full bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-auto custom-scrollbar">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800 mt-2">
             <h3 className="text-2xl font-bold font-serif text-cyan-400 tracking-wide">{lang === 'zh' ? data.title_zh : data.title}</h3>
             <Code2 className="w-6 h-6 text-slate-600" />
          </div>
          <p className="text-slate-300 text-[15px] mb-6 leading-relaxed bg-slate-950 p-5 rounded-2xl border border-slate-800/80 shadow-inner min-h-[100px]">
             {lang === 'zh' ? data.desc_zh : data.desc_en}
          </p>

          <div className="grid grid-cols-1 gap-4 mb-6">
             <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex flex-col justify-center shadow-inner">
                <div className="text-xs text-slate-500 font-mono mb-2 uppercase tracking-wide flex items-center gap-2">
                   <Database className="w-3 h-3 text-cyan-500" /> Tensor Shapes
                </div>
                <div className="text-blue-300 font-mono text-xs xl:text-sm 2xl:text-[15px] font-semibold">{data.shapes}</div>
             </div>
             
             <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex flex-col justify-center shadow-inner">
                <div className="text-xs text-slate-500 font-mono mb-2 uppercase tracking-wide flex items-center gap-2">
                   <Activity className="w-3 h-3 text-emerald-500" /> Time Complexity
                </div>
                <div className="text-emerald-400 font-mono text-sm xl:text-base font-semibold">{data.complexity}</div>
             </div>
          </div>

          <div className="mb-6 bg-slate-950 border border-slate-800 p-5 rounded-xl text-yellow-300 overflow-x-auto shadow-inner relative flex-none">
             <div className="absolute top-0 right-0 bg-yellow-500/10 px-3 py-1 rounded-bl-lg border-b border-l border-yellow-500/20 text-yellow-600/50 text-xs font-mono uppercase font-bold">Formula</div>
             <div className="font-serif text-xl tracking-wide whitespace-nowrap pt-3 pb-1">{data.math}</div>
          </div>

          <div className="flex-1 bg-[#0d1117] border border-slate-800 rounded-xl overflow-hidden relative shadow-inner flex flex-col min-h-[300px]">
             <div className="bg-[#161b22] px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">pytorch_impl.py</span>
                </div>
                <div className="flex gap-2">
                   <div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-400 transition-colors cursor-pointer"></div>
                   <div className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-400 transition-colors cursor-pointer"></div>
                   <div className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-400 transition-colors cursor-pointer"></div>
                </div>
             </div>
             <div className="p-5 overflow-x-auto text-sm leading-loose font-mono text-slate-300 flex-1">
                <pre>
                   <code dangerouslySetInnerHTML={{
                      __html: data.code
                          .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
                          .replace(/(def |return |for |in |if |else )/g, '<span class="text-pink-400 font-bold">$1</span>')
                          .replace(/(import )/g, '<span class="text-pink-400 font-bold">$1</span>')
                          .replace(/(torch|math|F)/g, '<span class="text-cyan-400 font-semibold">$1</span>')
                          .replace(/(self)/g, '<span class="text-purple-400">$1</span>')
                          .replace(/(#.*)/g, '<span class="text-slate-500 italic">$1</span>')
                   }} />
                </pre>
             </div>
          </div>

       </div>
    </div>
  );
}
`

let app = fs.readFileSync('src/App.tsx', 'utf8');
const regex = /(const geekData = \{)[\s\S]*?(function AppContent\(\) \{)/;
app = app.replace(regex, geekData + '\n$2');

fs.writeFileSync('src/App.tsx', app);
