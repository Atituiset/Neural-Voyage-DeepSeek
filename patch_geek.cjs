const fs = require('fs');

const geekCode = `
const geekData = {
  tok: {
    title: "Token Embedding",
    shapes: "𝒳_in: [B, T]  ➔  𝒳_out: [B, T, d_model]",
    math: "E(x_i) = W_e[t_i] \\cdot \\sqrt{d_{model}}",
    code: "def embed(tokens, W_e):\\n    return W_e[tokens] * math.sqrt(d_model)",
    desc_zh: "查表操作，将离散的整数索引映射为稠密连续的浮点特征向量。",
    desc_en: "Lookup operation mapping discrete integer indices to dense continuous floating-point feature vectors.",
    complexity: "𝒪(1) per token"
  },
  pos: {
    title: "Rotary Positional Embedding (RoPE)",
    shapes: "𝒳: [B, T, n_heads, d_k]  ➔  𝒳': [B, T, n_heads, d_k]",
    math: "R_{\\Theta, m} x = (\\cos m\\theta) x + (\\sin m\\theta) x_\\perp",
    code: "def apply_rotary_emb(xq, xk, freqs_cis):\\n    xq_ = torch.view_as_complex(xq.float().reshape(*xq.shape[:-1], -1, 2))\\n    xk_ = torch.view_as_complex(xk.float().reshape(*xk.shape[:-1], -1, 2))\\n    xq_out = torch.view_as_real(xq_ * freqs_cis).flatten(3)\\n    xk_out = torch.view_as_real(xk_ * freqs_cis).flatten(3)\\n    return xq_out.type_as(xq), xk_out.type_as(xk)",
    desc_zh: "通过对 Q、K 特征切片进行复数范围内的旋转变换，在不改变绝对大小的前提下，巧妙地显式化并注入相对位置信息。",
    desc_en: "Explicitly encodes relative position information by applying complex rotations to the query and key representations without changing their norms.",
    complexity: "𝒪(T · d_model)"
  },
  attn: {
    title: "Paged Causal Multi-Head Attention",
    shapes: "Q,K,V: [B, T, d_model] ➔ [B, n_heads, T, d_k] ➔ [B, T, d_model]",
    math: "\\\\text{Attention}(Q,K,V) = \\\\text{softmax}\\\\left(\\\\frac{QK^T}{\\\\sqrt{d_k}} \\\\odot M\\\\right)V",
    code: "def paged_attention(query, key_cache, value_cache, block_tables):\\n    attn_weights = []\\n    for block_idx in block_tables:\\n       k_block = key_cache[block_idx]\\n       score = query @ k_block.T / math.sqrt(d_k)\\n       attn_weights.append(score)\\n    probs = F.softmax(torch.cat(attn_weights), dim=-1)\\n    return probs @ v_blocks",
    desc_zh: "大模型推理的核心瓶颈。基于 PagedAttention 分页对 KV Cache 寻址执行缩放点积。伴随计算密集与访存密集的双重挑战。",
    desc_en: "The core bottleneck of LLM inference. Executes scaled dot-product attention using PagedAttention to address fragmented KV Cache.",
    complexity: "𝒪(T² · d_model)"
  },
  ffn: {
    title: "SwiGLU FFN / Sparse MoE",
    shapes: "𝒳: [B, T, d_model] ➔ [B, T, d_hidden] ➔ [B, T, d_model]",
    math: "\\\\text{MoE}(x) = \\\\sum_{i=1}^K w_i \\\\cdot ( \\\\text{SiLU}(x W_{g,i}) \\\\odot x W_{u,i} ) W_{d,i}",
    code: "def moe_ffn(x, router, experts):\\n    routing_weights, selected_experts = router(x).topk(2, dim=-1)\\n    routing_weights = F.softmax(routing_weights, dim=-1)\\n    final_output = torch.zeros_like(x)\\n    for i, expert in enumerate(experts):\\n        # SwiGLU: w_down(silu(w_gate(x)) * w_up(x))\\n        expert_out = expert(x)\\n        final_output += expert_out * routing_weights[:, i:i+1]\\n    return final_output",
    desc_zh: "采用带有门控单元的 SwiGLU 替代传统的 ReLU FFN。搭配路由网络仅激活 Top-K 的专家网络，极大降低计算资源消耗。",
    desc_en: "Uses SwiGLU instead of traditional FFN. Paired with a routing network to only activate Top-K experts, drastically reducing constraints.",
    complexity: "𝒪(T · d_model · d_hidden) per expert"
  },
  logits: {
    title: "Logits Projection & Nucleus Sampling",
    shapes: "𝒳: [B, T, d_model] ➔ Logits: [B, T, |V|]",
    math: "\\\\hat{P}(x_t|x_{<t}) = \\\\frac{\\\\exp(l_i / \\\\tau)}{\\\\sum_j \\\\exp(l_j / \\\\tau)}",
    code: "logits = linear(x, weight=vocab_weights)\\nprobs = F.softmax(logits / temperature, dim=-1)\\n\\n# Nucleus (Top-p) Sampling\\nsorted_probs, sorted_indices = torch.sort(probs, descending=True)\\ncumulative_probs = torch.cumsum(sorted_probs, dim=-1)\\nprobs_to_remove = cumulative_probs > top_p\\nprobs[probs_to_remove] = 0.0\\nprobs = probs / probs.sum()\\n\\nnext_token = torch.multinomial(probs, num_samples=1)",
    desc_zh: "无偏线性映射至浩如烟海的词表空间，结合 Temperature 与 Top-p/Min-p 截断并修正后，进行多项式采样抽取最终 Token。",
    desc_en: "Unbiased linear mapping to the vocabulary space. Temperature and Top-p truncate and shift the distribution, sampling yields the next Token.",
    complexity: "𝒪(T · d_model · |V|)"
  }
};

function GeekPerspectiveView() {
  const { lang } = useLanguage();
  const [activeNode, setActiveNode] = useState('tok');
  
  const NodeBox = ({ id, label, isLayer = false }: { id: keyof typeof geekData, label: string, isLayer?: boolean }) => {
    const isActive = activeNode === id;
    return (
      <button 
        onClick={() => setActiveNode(id)}
        className={\`w-full text-left p-3 my-2 rounded font-mono text-sm border-l-4 transition-all \${
          isActive 
            ? 'bg-cyan-900/40 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.2)]' 
            : 'bg-slate-800/40 border-slate-600 text-slate-400 hover:bg-slate-700/50 hover:text-slate-300'
        }\`}
      >
         <span className="font-bold">{isLayer ? '↳ ' : ''}{label}</span>
      </button>
    );
  };

  const data = geekData[activeNode as keyof typeof geekData];

  return (
    <div className="w-full relative z-10 py-8 px-4 flex flex-col xl:flex-row gap-6 min-h-[900px] max-w-7xl mx-auto items-stretch">
       {/* Left Panel: Architecture Graph */}
       <div className="flex-none w-full xl:w-80 bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiIGZpbGw9Im5vbmUiLz4KPHBhdGggZD0iTTAgMGgwLjV2NDBIMHoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMSkiLz4KPHBhdGggZD0iTTAgMGg0MHYwLjVIMHoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMSkiLz4KPC9zdmc+')] pointer-events-none opacity-50"></div>
          
          <h3 className="text-lg font-bold font-mono text-slate-200 mb-6 flex items-center gap-2 border-b border-slate-800 pb-4">
            <Network className="w-5 h-5 text-cyan-500" />
            {lang === 'zh' ? '拓扑结构' : 'Compute Graph'}
          </h3>

          <div className="flex-1 flex flex-col w-full relative z-10">
             <div className="text-center text-xs font-mono text-slate-500 mb-2 border border-slate-700 rounded py-1 px-2 border-dashed mx-auto">Input Tokens (𝒳)</div>
             
             <div className="w-0.5 h-6 bg-slate-700 mx-auto"></div>
             <NodeBox id="tok" label="Token Embedding" />
             <div className="w-0.5 h-6 bg-slate-700 mx-auto"></div>
             
             <div className="border border-cyan-800/50 bg-cyan-950/10 rounded-xl p-4 my-2 relative max-w-full">
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 text-cyan-800 text-[10px] font-mono font-bold tracking-widest uppercase" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg) translateY(50%)' }}>N Layers</div>
                
                <NodeBox id="pos" label="RoPE Positional" isLayer />
                <div className="w-0.5 h-4 bg-slate-700 mx-auto"></div>
                <NodeBox id="attn" label="Causal Paged Attn" isLayer />
                <div className="w-0.5 h-4 bg-slate-700 mx-auto"></div>
                <NodeBox id="ffn" label="SwiGLU / MoE FFN" isLayer />
             </div>
             
             <div className="w-0.5 h-6 bg-slate-700 mx-auto"></div>
             <NodeBox id="logits" label="Logits & Softmax" />

             <div className="w-0.5 h-6 bg-slate-700 mx-auto"></div>
             <div className="text-center text-xs font-mono text-emerald-600 dark:text-emerald-500 mb-2 border border-emerald-900 rounded py-1 px-2 border-dashed mx-auto bg-emerald-950/30">Target Tokens (𝒴)</div>
          </div>
       </div>

       {/* Right Panel: Deep Dive Inspector */}
       <div className="flex-1 flex flex-col gap-6">
           <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                 <h3 className="text-2xl font-bold font-serif text-cyan-400 tracking-wide">{data.title}</h3>
                 <Code2 className="w-6 h-6 text-slate-700" />
              </div>
              <p className="text-slate-400 text-sm mb-6 leading-loose bg-slate-900/50 p-4 rounded-xl border border-slate-800/50">
                 {lang === 'zh' ? data.desc_zh : data.desc_en}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                 <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-center">
                    <div className="text-xs text-slate-500 font-mono mb-2 uppercase tracking-wide flex items-center gap-2">
                       <Database className="w-3 h-3 text-cyan-500" /> Tensor Shapes
                    </div>
                    <div className="text-blue-300 font-mono text-[11px] md:text-sm font-semibold">{data.shapes}</div>
                 </div>
                 <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-center">
                    <div className="text-xs text-slate-500 font-mono mb-2 uppercase tracking-wide flex items-center gap-2">
                       <Activity className="w-3 h-3 text-emerald-500" /> Time Complexity
                    </div>
                    <div className="text-emerald-400 font-mono text-xs md:text-sm font-semibold">{data.complexity}</div>
                 </div>
              </div>

              <div className="mb-6 bg-slate-900 border border-slate-800 p-5 rounded-xl text-yellow-300 overflow-x-auto shadow-inner relative">
                 <div className="absolute top-0 right-0 bg-yellow-500/10 px-2 py-1 rounded-bl-lg border-b border-l border-yellow-500/20 text-yellow-600/50 text-[10px] font-mono uppercase">Formula</div>
                 <div className="font-serif text-lg tracking-wide whitespace-nowrap pt-2">{data.math}</div>
              </div>

              <div className="flex-1 bg-[#0d1117] border border-slate-800 rounded-xl overflow-hidden relative shadow-inner flex flex-col min-h-[300px]">
                 <div className="bg-[#161b22] px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-slate-400" />
                      <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">pytorch_impl.py</span>
                    </div>
                    <div className="flex gap-2">
                       <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                       <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                       <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                    </div>
                 </div>
                 <div className="p-4 overflow-x-auto text-sm leading-relaxed font-mono text-slate-300 flex-1">
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
    </div>
  );
}
`

let app = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /(const blockData = \{)[\s\S]*?(function AppContent\(\) \{)/;
app = app.replace(regex, geekCode + '\n$2');

fs.writeFileSync('src/App.tsx', app);
console.log('Geek patched!');
