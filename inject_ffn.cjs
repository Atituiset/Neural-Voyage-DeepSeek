const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const zhBasicFFN = `{
          title: "6. 前馈神经网络 (FFN & SwiGLU)",
          desc: "注意力的计算让文字找准了上下文的关系，但真正的'理解'发生在接下来的全连接前馈层。如同大脑的皮层网络，高维投射解开了复杂的非线性特征。最新一代架构抛弃了传统的 ReLU 激活，改用更丝滑的 Swish 门控 (SwiGLU)，激活了更强的表达能力。",
        }`;

const zhExpertFFN = `{
          title: "6. 全连接前馈网络 (SwiGLU FFN)",
          desc: "注意力层完成空间维度的信息聚合后，点式前馈网络 (Position-wise FFN) 进行特征维度上的非线性升维映射。现代多数大语言模型 (如 LLaMA, Qwen) 已全面淘汰 ReLU/GELU，转而采用 Shazeer (2020) 提出的门控线性单元变体 SwiGLU (Swish(xW) ⊙ xV)，有效提升模型表征容量与训练收敛速度。",
          history: "传统的 FFN 通常采用两个线性层并夹带 ReLU 激活函数将维度扩展再缩回。2020 年，Noam Shazeer 在提出 GLU 变体时详细测试了不同激活函数的表现，实验表明 SwiGLU 拥有最佳性能。目前它已是开源百亿、千亿参数大模型的标配组件。",
          code: \`class SwiGLUFFN(nn.Module):
    def forward(self, x: Tensor) -> Tensor:
        # x: [B, T, d_model]
        gate = F.silu(self.wGate(x))
        up = self.wUp(x)
        return self.wDown(gate * up)\`
        }`;

const enBasicFFN = `{
          title: "6. Feed-Forward Network (SwiGLU)",
          desc: "While Attention figures out relationships between words, the actual 'understanding' and knowledge recall happens in the Feed-Forward Layer. Acting like a massive cortical memory, high-dimensional projections unlock complex non-linear features, now supercharged by modern Swish gating mechanisms.",
        }`;

const enExpertFFN = `{
          title: "6. Position-wise FFN (SwiGLU)",
          desc: "After attention mixes contextual embeddings over time, the position-wise Feed-Forward Network operates independently on each token's feature dimension. Modern architectures largely abandoned ReLU, adopting SwiGLU gating (Swish(xW) ⊙ xV) to inject profound non-linearity and scale up representational capacity significantly.",
          history: "Classic FFN layers (2017) utilized a simple two-layer projection with ReLU activation. In 2020, Shazeer benchmarked Gated Linear Units variants, discovering that SwiGLU empirically surpasses others in perplexity. It has since saturated almost all frontier open-weight models (e.g. LLaMA, Mistral).",
          code: \`class SwiGLUFFN(nn.Module):
    def forward(self, x: Tensor) -> Tensor:
        # x: [B, T, d_model]
        gate = F.silu(self.wGate(x))
        up = self.wUp(x)
        return self.wDown(gate * up)\`
        }`;

const ffnVisualComponent = \`
function FFNVisual() {
  const { t, perspective } = useLanguage();
  return (
    <div className="relative h-[25rem] bg-slate-100/80 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-grid-slate-200 dark:bg-grid-slate-800/30 bg-[length:20px_20px] pointer-events-none opacity-20"></div>

      <div className="relative z-10 w-full max-w-lg flex flex-col items-center">
        {/* Input */}
        <div className="flex gap-2">
           {[...Array(6)].map((_, i) => (
             <motion.div key={'in'+i} animate={{ y: [0, -3, 0] }} transition={{ delay: i*0.1, duration: 2, repeat: Infinity }} className="w-8 h-8 rounded border border-slate-400 dark:border-slate-600 bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-[10px] font-mono text-slate-500 shadow-inner">
               x_{i}
             </motion.div>
           ))}
        </div>
        
        <div className="flex items-center gap-2 my-2 text-xs text-slate-500 font-mono">
           <svg width="2" height="20" className="mx-auto"><rect width="2" height="20" fill="currentColor" /></svg>
           {perspective === 'expert' && <span>W_gate, W_up</span>}
        </div>

        {/* Hidden Layer (Expanded) */}
        <div className="relative bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 shadow-xl rounded-2xl p-4 w-full flex flex-col gap-3">
          <div className="flex items-center justify-between gap-1 w-full">
            <div className="flex-1 flex flex-col items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-blue-500 tracking-wider">Gate (SiLU)</span>
              <div className="flex justify-between w-full h-12">
                 {[...Array(8)].map((_, i) => (
                    <motion.div key={'g'+i} animate={{ opacity: [0.3, 1, 0.3], height: ['30%', '100%', '30%'] }} transition={{ duration: 1.5, delay: Math.random(), repeat: Infinity }} className="w-4 bg-blue-300 dark:bg-blue-600 rounded-sm shadow-sm origin-bottom" />
                 ))}
              </div>
            </div>
            
            <div className="text-2xl text-slate-400 font-light flex items-center justify-center">×</div>
            
            <div className="flex-1 flex flex-col items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-amber-500 tracking-wider">Up (Linear)</span>
              <div className="flex justify-between w-full h-12">
                 {[...Array(8)].map((_, i) => (
                    <motion.div key={'u'+i} animate={{ opacity: [0.3, 1, 0.3], height: ['40%', '90%', '40%'] }} transition={{ duration: 2, delay: Math.random(), repeat: Infinity }} className="w-4 bg-amber-300 dark:bg-amber-600 rounded-sm shadow-sm origin-bottom" />
                 ))}
              </div>
            </div>
          </div>
          
          <div className="w-full bg-slate-50 dark:bg-slate-800 rounded-lg p-2 text-center border text-xs font-mono border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">
             {perspective === 'expert' ? 'H_hidden = SiLU(XW_g) ⊙ XW_u' : 'SwiGLU Gating & Expansion'}
          </div>
        </div>

        <div className="flex items-center gap-2 my-2 text-xs text-slate-500 font-mono">
           <svg width="2" height="20" className="mx-auto"><rect width="2" height="20" fill="currentColor" /></svg>
           {perspective === 'expert' && <span>W_down</span>}
        </div>

        {/* Output */}
        <div className="flex gap-2">
           {[...Array(6)].map((_, i) => (
             <motion.div key={'out'+i} animate={{ y: [0, 3, 0] }} transition={{ delay: i*0.1, duration: 2, repeat: Infinity }} className="w-8 h-8 rounded border-2 border-emerald-400 dark:border-emerald-500 bg-emerald-50 dark:bg-emerald-900/40 flex items-center justify-center text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.3)]">
               z_{i}
             </motion.div>
           ))}
        </div>
      </div>
    </div>
  );
}\n\n\`;

// Helper for regex replace with verification
function replaceCode(searchRegex, replaceStr) {
  if (searchRegex.test(code)) {
    code = code.replace(searchRegex, replaceStr);
  }
}

replaceCode(/"6\. 混合专家 \(MoE\)"/g, '"7. 混合专家 (MoE)"');
replaceCode(/"7\. 回归与生成 \(Softmax\)"/g, '"8. 回归与生成 (Softmax)"');
replaceCode(/"8\. 推理内存墙 \(KV Cache\)"/g, '"9. 推理内存墙 (KV Cache)"');

replaceCode(/"6\. Mixture of Experts \(MoE\)"/g, '"7. Mixture of Experts (MoE)"');
replaceCode(/"7\. Softmax \& Generation"/g, '"8. Softmax & Generation"');
replaceCode(/"8\. Memory Wall \(KV Cache\)"/g, '"9. Memory Wall (KV Cache)"');

replaceCode(/"6\. 稀疏混合专家与 SwiGLU \(Sparse MoE\)"/g, '"7. 稀疏混合专家 (Sparse MoE)"');
replaceCode(/摒弃传统 ReLU，采用变体门控线性单元 SwiGLU \\(Swish\\(xW\\) ⊙ xV\\) 以提升信号传播与表征容量。采用 Top-2\\/K Routing 策略/g, '采用 Top-2/K Routing 策略');
replaceCode(/核心的激活层 SwiGLU 则是 Shazeer 在 2020 年提出，淘汰了经典的经典 ReLU\\/GELU 门控。/g, '');

replaceCode(/"7\. Logits 与 解码采样 \(Decoding\)"/g, '"8. Logits 与 解码采样 (Decoding)"');
replaceCode(/"8\. 显存管理机制 \(PagedAttention\)"/g, '"9. 显存管理机制 (PagedAttention)"');

replaceCode(/\{\s*title:\s*"7\. 混合专家 \(MoE\)"/, zhBasicFFN + ',\n        { title: "7. 混合专家 (MoE)"');
replaceCode(/\{\s*title:\s*"7\. 稀疏混合专家 \(Sparse MoE\)"/, zhExpertFFN + ',\n        { title: "7. 稀疏混合专家 (Sparse MoE)"');

replaceCode(/\{\s*title:\s*"7\. Mixture of Experts \(MoE\)"/, enBasicFFN + ',\n        { title: "7. Mixture of Experts (MoE)"');
// For english expert moe, I'll match the start of section 6
replaceCode(/\{\s*title:\s*"[67]\. (Sparse )?Mixture of Experts.*?\n/, enExpertFFN + ',\n        { title: "7. Mixture of Experts (Sparse)",\n');

// Make MoE array the 8th item (index 7)
code = code.replace(/function ResidualNormVisual\(\) \{[\s\S]*?\n\}/, (match) => {
  return match + '\n\n' + ffnVisualComponent;
});

// Update Softmax -> 8
let softmaxSectionRegex = /(<Section[^>]*>\s*<SoftmaxVisual \/>\s*<SectionContent\s*title=\{t\.sections\[perspective\]\[)6(\]\.title\})/g;
code = code.replace(softmaxSectionRegex, '$17$3');

// Update KV Cache -> 9
let kvSectionRegex = /(<Section[^>]*>\s*<KVCacheVisual \/>\s*<SectionContent\s*title=\{t\.sections\[perspective\]\[)7(\]\.title\})/g;
code = code.replace(kvSectionRegex, '$18$3');

// Update MoE -> 7
let moeSectionRegex = /(<Section[^>]*>\s*<MoEVisual \/>\s*<SectionContent\s*title=\{t\.sections\[perspective\]\[)5(\]\.title\})/g;
code = code.replace(moeSectionRegex, '$16$3');


// Inject the FFN visual
let residualSectionRegex = /(<Section[^>]*>\s*<ResidualNormVisual \/>\s*<SectionContent\s*title=\{t\.sections\[perspective\]\[)(4)(\]\.title\}[\s\S]*?<\/Section>)/;
let residualMatch = code.match(residualSectionRegex);
if (residualMatch) {
  let ffnSection = \`
        {/* FFN / SwiGLU */}
        <Section className="bg-white dark:bg-slate-950">
           <FFNVisual />
           <SectionContent 
             title={t.sections[perspective][5].title} 
             description={t.sections[perspective][5].desc} 
             history={(t.sections[perspective][5] as any).history}
             code={(t.sections[perspective][5] as any).code}
             icon={Waves} 
           />
        </Section>
  \`;
  code = code.replace(residualSectionRegex, residualMatch[0] + '\\n' + ffnSection);
}

fs.writeFileSync('src/App.tsx', code);
