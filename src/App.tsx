import React, { useState, useEffect, createContext, useContext } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { 
  Brain, ChevronRight, Activity, ArrowRight, BookOpen, 
  Fingerprint, Layers, Cpu, Sparkles, ChevronDown, 
  Network, Database, MessageSquare, Zap, Github, 
  Moon, Sun, Monitor, ScanLine, Type, Languages, Binary, Eye
, Globe, GraduationCap, GitMerge, Waves, Aperture, Clock, Terminal, Code2 } from 'lucide-react';


const content = {
  zh: {
    hero: {
      badge: "硬核解析 · 沉浸式图解",
      title1: "大模型内部运行原理",
      title2: "奇妙之旅",
      subtitle: {
        basic: "你只是随手点开了一个对话框，没想到下一秒，一阵眩晕，你整个人被吸入了模型内部……",
        expert: "深入剖析并重构 Transformer 前向传播路径 (Forward Pass)。研究规模：从 𝒳 ∈ ℝ^{B×T} 到 𝒴 ∈ ℝ^{B×T×V}，解构多头自注意力与混合专家系统的底层张量操作。",
        geek: "全局架构交互网络层级视图：自由缩放、悬停、观察数据流如何在网络节点之间传递与计算。"
      }
    },
    sections: {
      basic: [
        {
          title: "1. 分词系统 (Tokenizer)",
          desc: "你的问题不再是普通的文字。它们在这里被无情地拆解，变成了一个个被称为 'Token' 的独立词块，这是大模型理解你的第一步。",
        },
        {
          title: "2. 嵌入层 (Embedding)",
          desc: "巨大的投影装置从天而降。文字词块在这里被转化为了计算机能够识别的 '向量' (Vector)。它们化作一列数字列车，向网络深处驶去。",
        },
        {
          title: "3. 位置编码 (Positional Encoding)",
          desc: "进入网络前，词块只是无序的集合。我们通过不同频率的正弦波为它们注入时空坐标，让模型不仅知道'是什么'，还知道'在哪里'，还原语言的时空秩序。",
        },
        {
          title: "4. 多头掩码注意力 (Masked Attention)",
          desc: "迎面而来的是核心区域。在这里，每个 Token 幻化出三个属性：Q (查询)、K (键)、V (值)。它们在多头视角的矩阵中飞速匹配。最关键的是'因果掩码'的加入，蒙住未来的视线，确保模型只能基于过去的记忆进行推演。",
        },
        {
          title: "5. 残差连接与归一化 (Add & Norm)",
          desc: "为了防止深度网络中的信号衰减，巧夺天工的'残差连接'让初始信号能跨越复杂层级直接传递，配合'层归一化'稳定数值，确保巨量信息的平稳穿梭，不崩溃不失真。",
        },
        {
          title: "6. 前馈神经网络 (FFN & SwiGLU)",
          desc: "注意力的计算让文字找准了上下文的关系，但真正的'理解'发生在接下来的全连接前馈层。如同大脑的皮层网络，高维投射解开了复杂的非线性特征。最新一代架构抛弃了传统的 ReLU 激活，改用更丝滑的 Swish 门控 (SwiGLU)，激活了更强的表达能力。",
        },
        {
          title: "7. 混合专家 (MoE)",
          desc: "穿过发光的迷宫，一座由无数子舱组成的混合专家模型映入门帘。门控网络瞬间完成计算，精准点亮对应的几位 '专家' 接管任务。在保留海量知识的同时，节约了巨量算力。",
        },
        {
          title: "8. 回归与生成 (Softmax)",
          desc: "旅程接近终点。线性投影层结合 Softmax 算法，将无形的繁复向量映射回人类能够理解的词汇概率表。高悬的系统锁定概率最高的那颗完美词汇，至此，循环开启。",
        },
        {
          title: "9. 推理内存墙 (KV Cache)",
          desc: "每次生成新词时，大模型都需要回顾之前所有的话。为了避免重复思考，它会将过去的记忆缓存成小切片（KV 缓存）。如今聪明的调度系统分页管理这些碎片，像虚拟内存一样装进显卡极大地压榨了极限算力。",
        }
      ],
      expert: [
        {
          title: "1. 符号化表示 (Tokenization)",
          desc: "基于 BPE (Byte Pair Encoding) 将明文映射为 Token ID 序列序列 𝒳 ∈ ℤ^{B×T}。算法通过贪心合并频率最高的字节对，在此阶段完成 OOV (Out of Vocabulary) 的字符级兜底处理。",
          history: "源自 1994 年的数据压缩算法 BPE。2015 年在神经机器翻译中首次被引入以解决罕见词问题。随后通过 Google 的 SentencePiece (2018) 实现跨语种统一，以及 OpenAI 的 Tiktoken (2022) 面向代码和多语言的提速优化，成为当前 LLM 的绝对标配。",
          code: `def tokenize(text: str) -> Tensor:
    # 𝒳 ∈ ℤ^{B×T}
    tokens = bpe.encode(text)
    return torch.tensor(tokens).unsqueeze(0)`
        },
        {
          title: "2. 词向量投影 (Embedding Lookup)",
          desc: "通过查表操作获取离散符号的连续表示，应用参数矩阵 𝑊ₑ ∈ ℝ^{V×d_model} 将 Token ID 序列转化为初始稠密张量 𝐻₀ ∈ ℝ^{B×T×d_model}。实现中通常等价于 One-Hot 乘法的高效实现。",
          history: "词向量思想可追溯至 2003 年的 NNLM 与 2013 年现象级的 Word2Vec (Mikolov et al.)。Transformer (2017) 将其作为基础投影层，奠定了后续所有 LLM 将语义映射到高维稠密空间的底层范式。",
          code: `class Embedding(nn.Module):
    def forward(self, x: Tensor) -> Tensor:
        # x: [B, T] -> [B, T, d_model]
        return F.embedding(x, self.weight)`
        },
        {
          title: "3. 旋转位置编码 (RoPE)",
          desc: "摒弃了绝对和相对位置嵌入，采用 Rotary Position Embedding。通过与依赖绝对位置的旋转矩阵 ℝ_Θ 逐项相乘，在复数域中实现自注意力计算 〈𝑞_𝑚, 𝑘_𝑛〉 ∝ cos((𝑚-𝑛)𝜃)，优雅地将相对位置信息注入注意力机制。",
          history: "绝对位置编码由 2017 年 Attention is All You Need 提出。但为了更好处理长度外推性与相对位置，清华大学与华为诺亚团队在 2021 年发掘了旋转位置编码 (RoPE)，随后被 LLaMA、Qwen 等开源模型广泛采用，成为当代绝对主流。",
          code: `def apply_rope(q: Tensor, k: Tensor, pos: Tensor):
    # RoPE: q_m * e^{im\theta}
    freqs = compute_freqs(pos)
    q_out = q * cos(freqs) + rotate_half(q) * sin(freqs)
    k_out = k * cos(freqs) + rotate_half(k) * sin(freqs)
    return q_out, k_out`
        },
        {
          title: "4. GQA、KV缓存与原生注意力",
          desc: "𝐻' = 𝐻 + Attention(LayerNorm(𝐻))。推理时应用 KV Cache 缓存历史键值，使时序阶跃复杂度降至 𝒪(1)。采用分组查询注意力 (Grouped-Query Attention, GQA) 共享头权重以极大降低显存读取带宽瓶颈 (Memory Wall)。底层通常依托 FlashAttention 基于 SRAM 显存切块 (Tiling) 实现 IO 感知的无损加速计算。",
          history: "多头自注意力 (MHA) 生于 2017。为应对 LLM 庞大上下文带来的显存墙瓶颈，2019 年 MQA 提出共享 KV 头。2023 年 LLaMA-2 等全网引入介于二者折中的分组查询注意力 (GQA)。同年 Dao 等推出的 FlashAttention 彻底重构了算子的硬件级执行层。",
          code: `def attention(q, k, v, mask=None):
    # q,k,v: [B, num_heads, T, d_k]
    scores = torch.matmul(q, k.transpose(-2, -1)) / math.sqrt(d_k)
    if mask is not None:
        scores = scores.masked_fill(mask == 0, -1e9)
    attn = F.softmax(scores, dim=-1)
    return torch.matmul(attn, v)`
        },
        {
          title: "5. RMSNorm 与 残差流 (Residual Stream)",
          desc: "抛弃均值平移，采用 Root Mean Square Normalization 降低计算开销并提升训练稳定性。张量维度保持 ℝ^{B×T×d_model} 不变。恒等映射 (Identity Mapping) 构成网络骨干残差流，缓解梯度消失 (Gradient Vanishing) 并解决深层退化。",
          history: "传统 LayerNorm (2016) 需要计算均值带来额外开销。Zhang 等人在 2019 年发明的 RMSNorm 提出可以直接无视均值平移，由此大幅提升模型训练吞吐量，目前几乎被各大顶级开源架构奉为基准配置。",
          code: `class RMSNorm(nn.Module):
    def forward(self, x: Tensor) -> Tensor:
        variance = x.pow(2).mean(-1, keepdim=True)
        x_normed = x * torch.rsqrt(variance + self.eps)
        return self.weight * x_normed`
        },
        {
          title: "6. 全连接前馈网络 (SwiGLU FFN)",
          desc: "注意力层完成空间维度的信息聚合后，点式前馈网络 (Position-wise FFN) 进行特征维度上的非线性升维映射。现代多数大语言模型 (如 LLaMA, Qwen) 已全面淘汰 ReLU/GELU，转而采用 Shazeer (2020) 提出的门控线性单元变体 SwiGLU (Swish(xW) ⊙ xV)，有效提升模型表征容量与训练收敛速度。",
          history: "传统的 FFN 通常采用两个线性层并夹带 ReLU 激活函数将维度扩展再缩回。2020 年，Noam Shazeer 在提出 GLU 变体时详细测试了不同激活函数的表现，实验表明 SwiGLU 拥有最佳性能。目前它已是开源百亿、千亿参数大模型的标配组件。",
          code: `class SwiGLUFFN(nn.Module):
    def forward(self, x: Tensor) -> Tensor:
        # x: [B, T, d_model]
        gate = F.silu(self.wGate(x))
        up = self.wUp(x)
        return self.wDown(gate * up)`
        },
        {
          title: "7. 稀疏混合专家 (Sparse MoE)",
          desc: "𝐻'' = 𝐻' + Σ_{i=1}^{k} g_i(x)·SwiGLU_i(LayerNorm(𝐻'))。在前馈层的基础上，采用 Top-2/K Routing 策略，Router通过引入负载均衡损失防止表征塌陷，达成算力-参数量的极致压缩解耦。",
          history: "专家网络理论的起源早在 90 年代。大模型时代的复兴始于 Google 2021 的 Switch Transformer。此后 Mixtral (2024) 彻底引爆了开源界沿用 MoE 的狂热。",
          code: `def moe_forward(x: Tensor, experts: List[nn.Module], router: nn.Module):
    # routing_weights: [B*T, num_experts]
    routing_weights, selected = router(x).topk(k=2, dim=-1)
    routing_weights = F.softmax(routing_weights, dim=-1)
    out = torch.zeros_like(x)
    for idx, expert in enumerate(experts):
        # Sparse dispatch and SwiGLU gating
        ...
    return out`
        },
        {
          title: "8. Logits 与 解码采样 (Decoding)",
          desc: "通过无偏线性投影分类头 𝑊_u ∈ ℝ^{d_model×V} 计算 𝐿 = 𝐻_𝐿 𝑊_uᵀ 获取 Logits。此时往往通过重复惩罚 (Repetition Penalty) 截断，再应用 Softmax 算子得到离散概率分布 𝑃，最后基于 Top-p (Nucleus) 或 Min-P 结合 Temperature 策略执行随机采样 (Stochastic Sampling)。",
          history: "自回归解码一直伴随模型发展。最早常由于 Softmax 过于尖锐引入 Temperature 控制。解决机器生成枯燥甚至死循环问题的里程碑是 2019 年的 Top-p (Nucleus Sampling)。2024 年能更灵敏面对概率断崖的 Min-P 策略开始逐渐普及。",
          code: `def generate(logits: Tensor, temp=1.0, top_p=0.9):
    probs = F.softmax(logits[:, -1, :] / temp, dim=-1)
    sorted_probs, indices = torch.sort(probs, descending=True)
    cum_probs = torch.cumsum(sorted_probs, dim=-1)
    # Nucleus filtering
    sorted_probs[cum_probs > top_p] = 0.0
    return torch.multinomial(sorted_probs, 1)`
        },
        {
          title: "9. 显存管理机制 (PagedAttention)",
          desc: "大规模并发生成时，长文本推理主要受制于访存带宽（Memory-bound）。变长序列导致传统 KV Cache 出现极大的显存碎片。主流方案引入连续虚拟内存映射到离散物理显存的分页管理策略（Paged Attention），将显存利用率极大提升。",
          history: "2023 年 UC Berkeley 团队发布了 vLLM/PagedAttention，在业内引起巨大反响，一举突破长文本和高并发推理瓶颈，随后迅速被整合至顶流推理框架（如 TensorRT-LLM, TGI, LMDeploy）之中，成为系统优化的标杆。",
          code: `def paged_attention(query, key_cache, value_cache, block_tables):
    # block_tables: [B, max_num_blocks] mapping logic-to-physical
    for seq_idx in range(num_seqs):
        for block_idx in block_tables[seq_idx]:
            k_block = key_cache[block_idx]  # Gather physically non-contiguous blocks
            v_block = value_cache[block_idx]
    return attn_out`
        }
      ]
    },
    visuals: {
      tokenSentence: "大模型的原理是什么？",
      tokens: ["大", "模型", "的", "原理", "是", "什么", "？"],
      embedTokens: ["大", "模型", "的"],
      tokenA: "Token A",
      tokenB: "Token B",
      expert: "专家",
      generate: "生成",
      footer: "致敬 Transformer 架构灵感 · 添加前沿专业知识增强版与深层剖析图解",
      wMatrix: "多头矩阵计算",
      inputX: "输入数据 (x)",
      sublayer: "注意/前馈层",
      layerNorm: "层归一化 (Norm)",
      tokenVector: "词汇向量",
      position: "时空波纹",
      fused: "位置融合"
    }
  },
  en: {
    hero: {
      badge: "In-Depth Analysis · Hardcore Visuals",
      title1: "Inner Workings of LLMs",
      title2: "A Wondrous Journey",
      subtitle: {
        basic: "You casually clicked a dialog box, and unexpectedly in the next second, a wave of dizziness hit, and you were sucked into the model...",
        expert: "A rigorous dissection of the Transformer forward pass. Analysis scale: from 𝒳 ∈ ℝ^{B×T} to 𝒴 ∈ ℝ^{B×T×V}, deconstructing the underlying tensor operations of multi-head self-attention and sparse MoE architectures.",
        geek: "Global Interactive Architecture View: Zoom, hover, and observe how data representations compute and flow between network nodes."
      }
    },
    sections: {
      basic: [
        {
          title: "1. Tokenization System",
          desc: "Your questions are no longer ordinary text. They are ruthlessly dismantled here, turning into independent word blocks called 'Tokens', which is the first step for the large model to understand you.",
        },
        {
          title: "2. Embedding Layer",
          desc: "A huge projection device drops from the sky. Here, text blocks are transformed into dense mathematical 'Vectors' recognizable by computers. They turn into a train of numbers.",
        },
        {
          title: "3. Positional Encoding",
          desc: "Before entering the network, tokens are just unordered bags. We inject spatiotemporal coordinates using multiple sine wave frequencies, so the model knows not just 'what', but 'where' they are.",
        },
        {
          title: "4. Masked Multi-Head Attention",
          desc: "Coming up is the core processing area. Each Token forms three dimensions: Q (Query), K (Key), V (Value). They match rapidly across multiple 'heads'. A crucial 'Causal Mask' blocks future sight, strictly forcing predictions based only on the past.",
        },
        {
          title: "5. Residuals & Layer Norm",
          desc: "To prevent signal loss across insanely deep networks, ingenious 'Residual Connections' let raw input bypass math-heavy layers, while 'Layer Normalization' stabilizes the output variance, ensuring smooth data flow.",
        },
        {
          title: "6. Feed-Forward Network (SwiGLU)",
          desc: "While Attention figures out relationships between words, the actual 'understanding' and knowledge recall happens in the Feed-Forward Layer. Acting like a massive cortical memory, high-dimensional projections unlock complex non-linear features, now supercharged by modern Swish gating mechanisms.",
        },
        {
          title: "7. Mixture of Experts (MoE)",
          desc: "Through the glowing maze, an MoE model consisting of countless sub-cabins appears. The Gating Network calculates instantly, accurately lighting up only the necessary 'experts'. It holds massive scale while saving compute.",
        },
        {
          title: "8. Softmax & Generation",
          desc: "The journey nears its end. A linear projection combined with the Softmax algorithm maps invisible vectors back to a vocabulary probability curve. The system locks onto the highest probability word, and thus, the cycle begins.",
        },
        {
          title: "9. Memory Wall (KV Cache)",
          desc: "When generating words, the model needs to remember previous context. To avoid redundant computation, it caches historical data in chunks (KV Cache). Like an OS managing RAM, smart schedulers map these memory blocks tightly into the GPU cache, pushing hardware limits to their absolute peak.",
        }
      ],
      expert: [
        {
          title: "1. Symbolic Tokenization",
          desc: "Maps raw sequential text to discrete Token ID sequences 𝒳 ∈ ℤ^{B×T} using Byte Pair Encoding (BPE) or SentencePiece. Aggressively merges frequent n-grams and executes character-level fallback for Out-Of-Vocabulary (OOV) edge cases.",
          history: "Originating as a general data compression algorithm (BPE) in 1994, it was first applied to neural machine translation to mitigate the out-of-vocabulary issue (Sennrich et al., 2015). Google's SentencePiece (2018) unified it across languages, and OpenAI's Tiktoken (2022) optimized it for code, making it the de facto standard.",
          code: `def tokenize(text: str) -> Tensor:
    # 𝒳 ∈ ℤ^{B×T}
    tokens = bpe.encode(text)
    return torch.tensor(tokens).unsqueeze(0)`
        },
        {
          title: "2. Embedding Lookup Matrix",
          desc: "Projects discrete integers to continuous high-dimensional space via weight matrix 𝑊ₑ ∈ ℝ^{V×d_model}, extracting spatial latent representations. Initializes the base tensor field 𝐻₀ ∈ ℝ^{B×T×d_model}.",
          history: "The concept of word vectors dates back to the NLP revolution and the phenomenal Word2Vec (Mikolov et al., 2013). The Transformer paper (2017) formalized embedding projection, cementing the paradigm of mapping discrete tokens to dense continuous spaces.",
          code: `class Embedding(nn.Module):
    def forward(self, x: Tensor) -> Tensor:
        # x: [B, T] -> [B, T, d_model]
        return F.embedding(x, self.weight)`
        },
        {
          title: "3. Rotary Position Embedding (RoPE)",
          desc: "Injects relative shift invariance dynamically by multiplying embeddings with an orthogonal rotation matrix ℝ_Θ in the complex plane, yielding 〈𝑞_𝑚, 𝑘_𝑛〉 ∝ cos((𝑚-𝑛)𝜃). Subsumes early absolute sine/cosine additive encodings.",
          history: "While the original Attention is All You Need (2017) relied on absolute sinusoidal embeddings, the pursuit for better extrapolation length led to Rotary Position Embedding (RoPE) by Su et al. (2021). It eleganty intertwines absolute and relative cues and now powers modern giants like LLaMA.",
          code: `def apply_rope(q: Tensor, k: Tensor, pos: Tensor):
    # RoPE: q_m * e^{im\theta}
    freqs = compute_freqs(pos)
    q_out = q * cos(freqs) + rotate_half(q) * sin(freqs)
    k_out = k * cos(freqs) + rotate_half(k) * sin(freqs)
    return q_out, k_out`
        },
        {
          title: "4. Grouped-Query Attention & KV Cache",
          desc: "𝐻' = 𝐻 + Attention(LayerNorm(𝐻)). Inference aggressively employs KV Cache (holding historic Key/Value states) to collapse autoregressive temporal complexity to 𝒪(1). Leverages Grouped-Query Attention (GQA) sharing K/V heads to overcome memory bandwidth bottlenecks, often accelerated by IO-aware SRAM tiling algorithms like FlashAttention.",
          history: "Multi-Head Attention (MHA) was born in 2017. To cure the immense KV Cache memory wall during inference, MQA (2019) proposed sharing KV heads. By 2023, models like LLaMA-2 adopted Grouped-Query Attention (Ainslie et al.) as a sweet spot. Concurrently, FlashAttention (2022) drastically reshaped GPU tensor IO algorithms.",
          code: `def attention(q, k, v, mask=None):
    # q,k,v: [B, num_heads, T, d_k]
    scores = torch.matmul(q, k.transpose(-2, -1)) / math.sqrt(d_k)
    if mask is not None:
        scores = scores.masked_fill(mask == 0, -1e9)
    attn = F.softmax(scores, dim=-1)
    return torch.matmul(attn, v)`
        },
        {
          title: "5. RMSNorm & Residual Streams",
          desc: "Utilizes Root Mean Square Normalization (RMSNorm) over LayerNorm to omit mean-centering overhead, achieving higher throughput. Identity mapping forms a robust residual backbone to negate vanishing gradients over 100+ layer regimes.",
          history: "Traditional LayerNorm (2016) entails mean-centering overhead. Realizing the mean shift was dispensable, Zhang & Sennrich (2019) introduced RMSNorm. By drastically accelerating training with mathematical simplicity, it became the ubiquitous standard in modern open-weight models.",
          code: `class RMSNorm(nn.Module):
    def forward(self, x: Tensor) -> Tensor:
        variance = x.pow(2).mean(-1, keepdim=True)
        x_normed = x * torch.rsqrt(variance + self.eps)
        return self.weight * x_normed`
        },
        {
          title: "6. Position-wise FFN (SwiGLU)",
          desc: "After attention mixes contextual embeddings over time, the position-wise Feed-Forward Network operates independently on each token's feature dimension. Modern architectures largely abandoned ReLU, adopting SwiGLU gating (Swish(xW) ⊙ xV) to inject profound non-linearity and scale up representational capacity significantly.",
          history: "Classic FFN layers (2017) utilized a simple two-layer projection with ReLU activation. In 2020, Shazeer benchmarked Gated Linear Units variants, discovering that SwiGLU empirically surpasses others in perplexity. It has since saturated almost all frontier open-weight models (e.g. LLaMA, Mistral).",
          code: `class SwiGLUFFN(nn.Module):
    def forward(self, x: Tensor) -> Tensor:
        # x: [B, T, d_model]
        gate = F.silu(self.wGate(x))
        up = self.wUp(x)
        return self.wDown(gate * up)`
        },
        {
          title: "7. Sparse MoE & SwiGLU Gating",
          desc: "𝐻'' = 𝐻' + Σ_{i=1}^{k} g_i(x)·SwiGLU_i(LayerNorm(𝐻')). Enforces Top-K capacity bounds via an affine Router 𝑊_g, injecting load balancing losses to exponentially scale parameters while capping FLOPs.",
          history: "Expert networks root back to the late 90s, but Google's Switch Transformer (2021) catalyzed their massive resurgence. Open-source exploded with MoE fervor following Mixtral 8x7B (2024).",
          code: `def moe_forward(x: Tensor, experts: List[nn.Module], router: nn.Module):
    # routing_weights: [B*T, num_experts]
    routing_weights, selected = router(x).topk(k=2, dim=-1)
    routing_weights = F.softmax(routing_weights, dim=-1)
    out = torch.zeros_like(x)
    for idx, expert in enumerate(experts):
        # Sparse dispatch and SwiGLU gating
        ...
    return out`
        },
        {
          title: "8. Logit Projection & Decoding",
          desc: "Completes the pass via an unbiased linear decoder 𝑊_u ∈ ℝ^{d_model×V}, computing 𝐿 = 𝐻_𝐿 𝑊_uᵀ. Before transforming raw Logits to a categorical distribution 𝑃 via Softmax, typically applies repetition penalties. Next, shifts to stochastic sequence generation using adaptive cutoffs like Min-P or Top-p (Nucleus) coupled with Temperature scaling.",
          history: "Autoregressive decoding evolved alongside language modeling. While Temperature smoothing is classic, Holtzman et al. introduced the milestone Nucleus Sampling (Top-p) in 2019 to suppress bland generations. The recent shift in 2024 spotlighted the Min-P strategy to adaptively truncate unlikely tokens.",
          code: `def generate(logits: Tensor, temp=1.0, top_p=0.9):
    probs = F.softmax(logits[:, -1, :] / temp, dim=-1)
    sorted_probs, indices = torch.sort(probs, descending=True)
    cum_probs = torch.cumsum(sorted_probs, dim=-1)
    # Nucleus filtering
    sorted_probs[cum_probs > top_p] = 0.0
    return torch.multinomial(sorted_probs, 1)`
        },
        {
          title: "9. VRAM Management (PagedAttention)",
          desc: "During batched autoregressive decoding, Inference becomes heavily Memory-bound. Variable sequence lengths cause immense memory fragmentation in standard KV Cache. PagedAttention solves this by fetching non-contiguous physical blocks mapping to contiguous logical tokens, boosting VRAM utilization.",
          history: "Introduced by UC Berkeley in 2023 via vLLM, PagedAttention triggered an industry-wide overhaul of inference servers. By solving the multi-user high-throughput bottleneck, it rapidly became the undisputed standard underlying frameworks like TensorRT-LLM, TGI, and LMDeploy.",
          code: `def paged_attention(query, key_cache, value_cache, block_tables):
    # block_tables: [B, max_num_blocks] mapping logic-to-physical
    for seq_idx in range(num_seqs):
        for block_idx in block_tables[seq_idx]:
            k_block = key_cache[block_idx]  # Gather physically non-contiguous blocks
            v_block = value_cache[block_idx]
    return attn_out`
        }
      ]
    },
    visuals: {
      tokenSentence: "What is the principle of large models?",
      tokens: ["What", " is", " the", " principle", " of", " large", " models", "?"],
      embedTokens: ["principle", "of", "models"],
      tokenA: "Token A",
      tokenB: "Token B",
      expert: "Expert",
      generate: "Generate",
      footer: "Inspired by Transformer architecture · Enhanced with state-of-the-art expert knowledge and diagrams",
      wMatrix: "Multi-Head Calc",
      inputX: "Input Data (x)",
      sublayer: "Attention/FFN",
      layerNorm: "Layer Norm",
      tokenVector: "Token Vectors",
      position: "Spatiotemporal",
      fused: "Fused Output"
    }
  }
};

type Language = 'zh' | 'en';
type Theme = 'light' | 'dark';
type Perspective = 'basic' | 'expert' | 'geek';

type AppContextType = {
  lang: Language;
  setLang: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  perspective: Perspective;
  setPerspective: (perspective: Perspective) => void;
  t: typeof content['zh'];
};

const AppContext = createContext<AppContextType>({
  lang: 'zh',
  setLang: () => {},
  theme: 'dark',
  setTheme: () => {},
  perspective: 'basic',
  setPerspective: () => {},
  t: content.zh,
});

function AppProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>('zh');
  const [theme, setTheme] = useState<Theme>('dark');
  const [perspective, setPerspective] = useState<Perspective>('basic');
  
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);
  
  return (
    <AppContext.Provider value={{ lang, setLang, theme, setTheme, perspective, setPerspective, t: content[lang] }}>
      {children}
    </AppContext.Provider>
  );
}

function useLanguage() {
  return useContext(AppContext);
}

function Section({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={`min-h-[80vh] flex items-center justify-center relative px-6 md:px-12 py-24 ${className}`}>
      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {children}
      </div>
    </section>
  );
}

function SectionContent({ title, description, history, code, icon: Icon }: { title: string; description: string; history?: string; code?: string; icon: React.ElementType }) {
  const [showHistory, setShowHistory] = useState(false);
  const { lang, perspective } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      viewport={{ once: false, margin: "-100px" }}
      className="space-y-6"
    >
      <div className="inline-flex items-center justify-center p-4 bg-blue-900/30 border border-blue-500/50 rounded-2xl mb-4">
        <Icon className="w-10 h-10 text-cyan-600 dark:text-cyan-400" />
      </div>
      <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-600">
        {title}
      </h2>
      
      {perspective === 'expert' && code && (
        <div className="bg-slate-950 rounded-xl overflow-hidden shadow-2xl border border-slate-800 my-6">
          <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            <div className="text-[10px] text-slate-500 font-mono tracking-widest">PyTorch / Pseudocode</div>
          </div>
          <div className="p-4 md:p-6 text-sm md:text-base text-green-400 font-mono leading-relaxed overflow-x-auto">
            <pre>
              {code}
            </pre>
          </div>
        </div>
      )}

      <p className="text-lg md:text-xl text-slate-700 dark:text-slate-300 leading-relaxed font-light">
        {description}
      </p>

      {/* 专家模式且带有 history 的情况下展示 */}
      {perspective === 'expert' && history && (
        <div className="pt-4 border-t border-slate-200/50 dark:border-slate-800/50 mt-4">
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-sm text-blue-600 dark:text-cyan-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors font-medium border border-slate-200 dark:border-slate-700"
          >
             <Clock className="w-4 h-4" />
             {lang === 'zh' ? '探索技术演进史' : 'Explore Evolution History'}
             <ChevronDown className={`w-4 h-4 transition-transform ${showHistory ? 'rotate-180' : ''}`} />
          </button>
          
          <AnimatePresence>
            {showHistory && (
              <motion.div
                 initial={{ opacity: 0, height: 0, marginTop: 0 }}
                 animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                 exit={{ opacity: 0, height: 0, marginTop: 0 }}
                 className="overflow-hidden"
              >
                 <div className="p-4 md:p-5 bg-blue-50/50 dark:bg-blue-950/20 rounded-xl text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-serif italic border border-blue-100 dark:border-blue-900/50 relative">
                   <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 rounded-l-xl"></div>
                   {history}
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}

function TokenizationVisual() {
  const { t, perspective, lang } = useLanguage();
  return (
    <div className="relative h-96 bg-slate-100/80 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center overflow-hidden">
      <motion.h3 
        initial={{ opacity: 1 }}
        whileInView={{ opacity: 0 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-12 absolute top-1/3 text-center"
      >
        {perspective === 'expert' ? (lang === 'zh' ? 'T : 𝒱^* → ℤ^{B×T}' : 'T : 𝒱^* → ℤ^{B×T}') : t.visuals.tokenSentence}
      </motion.h3>
      
      <div className="flex flex-wrap gap-3 justify-center mt-auto z-10 w-full">
        {t.visuals.tokens.map((token, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 1.5 + (i * 0.1), type: 'spring' }}
            style={{ boxShadow: perspective === 'expert' ? 'none' : '0 0 20px rgba(6, 182, 212, 0.4)' }}
            className={`flex flex-col items-center px-4 py-3 md:px-6 md:py-4 ${
              perspective === 'expert' 
                ? 'bg-slate-200 dark:bg-slate-800/80 border border-slate-400 dark:border-slate-600 rounded-sm font-mono' 
                : 'bg-white dark:bg-slate-800 border border-cyan-500/50 rounded-xl'
            }`}
          >
            <span className={`text-lg md:text-2xl font-semibold ${perspective==='expert'?'text-slate-800 dark:text-slate-200':'text-cyan-700 dark:text-cyan-300'}`}>{token}</span>
            {perspective === 'expert' && (
              <span className="text-xs text-slate-500 dark:text-slate-400 mt-2">ID: {1000 + (token.length * 42) + i * 17}</span>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function EmbeddingVisual() {
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
              className={`px-3 py-2 bg-white dark:bg-slate-800 border ${perspective==='expert'?'border-slate-500 font-mono rounded-none':'border-purple-500/50 rounded-lg text-lg font-semibold'} text-purple-700 dark:text-purple-300 whitespace-nowrap`}
            >
              {perspective === 'expert' ? `v_{iD${i}}` : token}
            </motion.div>
            <div className={`flex flex-col ${perspective==='expert'?'gap-0 mt-2':'gap-1'}`}>
              {perspective === 'expert' && <div className="text-[10px] text-slate-500 font-mono mb-1 text-center">W_E · hot</div>}
              {[...Array(6)].map((_, j) => (
                <motion.div
                  key={j}
                  initial={{ rotateX: 90, opacity: 0 }}
                  whileInView={{ rotateX: 0, opacity: 1 }}
                  transition={{ delay: 0.5 + (i * 0.2) + (j * 0.1) }}
                  className={`w-12 h-4 md:h-6 ${perspective==='expert'?'bg-emerald-900/10 dark:bg-emerald-900/40 border border-emerald-500/50 text-emerald-600 dark:text-emerald-400':'bg-purple-900/10 dark:bg-purple-900/40 border border-purple-700/50 text-purple-600 dark:text-purple-400 rounded'} flex items-center justify-center text-[8px] md:text-[10px] font-mono`}
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
}

function PositionalEncodingVisual() {
  const { t, perspective } = useLanguage();
  return (
    <div className="relative h-96 bg-slate-100/80 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 md:p-8 flex flex-col items-center justify-center overflow-hidden">
      <div className="flex items-center gap-2 md:gap-8 w-full justify-center">

        {/* Token Vector */}
        <div className="flex flex-col items-center">
            <span className="text-xs md:text-sm text-slate-500 font-bold mb-4">{t.visuals.tokenVector}</span>
            <div className="w-10 md:w-16 h-32 bg-slate-200 dark:bg-slate-800 rounded md:rounded-xl border border-slate-300 dark:border-slate-700 flex flex-col overflow-hidden shadow-inner">
               {[...Array(8)].map((_, i) => (
                 <div key={i} className={`w-full h-full flex items-center justify-center ${i % 2 === 0 ? 'bg-cyan-500/20' : 'bg-transparent'}`}>
                   {perspective === 'expert' && <span className="text-[6px] md:text-[8px] font-mono opacity-60">val</span>}
                 </div>
               ))}
            </div>
        </div>

        <span className="text-2xl font-bold text-slate-600 dark:text-slate-400">+</span>

        {/* Positional Wave */}
        <div className="flex flex-col items-center">
            <span className="text-xs md:text-sm text-slate-500 font-bold mb-4">{perspective === 'expert' ? 'RoPE / ℝ_Θ' : t.visuals.position}</span>
            <div className="w-20 md:w-32 h-32 relative flex items-center justify-center">
               {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ scale: [1, 1.5, 1], opacity: [0.8, 0, 0.8] }}
                    transition={{ duration: 2, delay: i * 0.4, repeat: Infinity }}
                    className={`absolute w-full h-full border rounded-full ${perspective === 'expert' ? 'border-orange-500/80' : 'border-blue-500/60'}`}
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
                 className={`absolute inset-0 ${perspective === 'expert' ? 'bg-gradient-to-b from-orange-400/30 to-cyan-400/30' : 'bg-gradient-to-b from-blue-400/40 to-cyan-400/40'} mix-blend-overlay`} 
               />
               {[...Array(8)].map((_, i) => (
                 <div key={i} className={`w-full h-full flex items-center justify-center ${i % 2 === 0 ? 'bg-cyan-500/20' : 'bg-transparent'} relative z-10`}>
                   {perspective === 'expert' && <span className="text-[6px] md:text-[8px] font-mono opacity-80 text-slate-700 dark:text-white">{((Math.sin(i)*0.5+0.5)).toFixed(2)}</span>}
                 </div>
               ))}
            </div>
        </div>
      </div>
    </div>
  );
}

function AttentionVisual() {
  const { t, perspective } = useLanguage();
  return (
    <div className="relative h-[25rem] bg-slate-100/80 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 flex items-center justify-center overflow-hidden">
      
      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 w-full justify-center relative z-10 w-full max-w-5xl px-4">
        {/* Input */}
        <div className={`flex flex-col items-center gap-2 w-1/4 ${perspective==='expert'?'':'opacity-90'}`}>
           <div className={`w-16 h-16 md:w-20 md:h-20 bg-slate-200 dark:bg-slate-700 flex items-center justify-center border-2 ${perspective==='expert'?'border-slate-600 rounded':'border-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]'}`}>
             <span className={`font-bold text-center leading-tight ${perspective==='expert'?'font-mono text-sm':'text-sm md:text-lg'}`}>{perspective === 'expert' ? 'X_m' : t.visuals.tokenA}</span>
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
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 w-full">
              <span className="text-xl md:text-2xl text-slate-800 dark:text-slate-200 font-serif border-b border-slate-400 pb-2 w-full text-center tracking-wider mb-4 flex items-center justify-center whitespace-nowrap">
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
              
              <div className="flex items-center justify-center gap-4 text-[10px] md:text-xs font-mono text-slate-500 dark:text-slate-400 opacity-90 mt-2 w-full">
                 <div className="flex flex-col gap-1 items-center">
                    <span className="text-blue-500 font-bold tracking-tight">Q•K^T</span>
                    <div className="grid grid-cols-4 grid-rows-4 gap-[2px]">
                       {[...Array(16)].map((_, i) => <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1+Math.random(), repeat: Infinity }} key={i} className={`w-4 h-4 rounded-sm ${i%5===0 ? 'bg-blue-500' : 'bg-blue-300 dark:bg-blue-900'}`}></motion.div>)}
                    </div>
                 </div>
                 <span className="text-lg md:text-xl text-slate-400 font-thin">÷√d_k</span>
                 <div className="flex flex-col gap-1 items-center">
                    <span className="text-pink-400 font-bold tracking-tight">Mask</span>
                    <div className="grid grid-cols-4 grid-rows-4 gap-[2px]">
                       {[...Array(16)].map((_, i) => <div key={i} className={`w-4 h-4 rounded-sm ${(i%4) <= Math.floor(i/4) ? 'bg-pink-500/80' : 'bg-slate-200 dark:bg-slate-800'}`}></div>)}
                    </div>
                 </div>
                 <span className="text-lg md:text-xl text-green-500 font-thin">× V</span>
                 <div className="flex flex-col gap-1 items-center">
                    <span className="text-green-500 font-bold tracking-tight">Z</span>
                    <div className="grid grid-cols-4 grid-rows-4 gap-[2px]">
                       {[...Array(16)].map((_, i) => <div key={i} className={`w-4 h-4 rounded-sm ${i%2===0 ? 'bg-green-400/80' : 'bg-green-700'}`}></div>)}
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
        <div className={`flex flex-col items-center gap-2 w-1/4 ${perspective==='expert'?'':'opacity-90'}`}>
           <div className={`w-16 h-16 md:w-20 md:h-20 bg-slate-200 dark:bg-slate-700 flex items-center justify-center border-2 ${perspective==='expert'?'border-slate-600 rounded':'border-green-500 rounded-full shadow-[0_0_15px_rgba(34,197,94,0.5)]'}`}>
             <span className={`font-bold text-center leading-tight ${perspective==='expert'?'font-mono text-sm':'text-sm md:text-lg'}`}>{perspective === 'expert' ? 'Z_m' : t.visuals.fused}</span>
           </div>
           {perspective === 'expert' && <span className="text-[10px] text-slate-500 font-mono mt-2 text-center w-full block">Concat & W_o</span>}
        </div>
      </div>

    </div>
  );
}

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
}

function ResidualNormVisual() {
  const { t, perspective } = useLanguage();
  return (
    <div className="relative h-96 bg-slate-100/80 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center overflow-hidden">
      <div className="relative w-full max-w-lg flex flex-col items-center">
        
        {/* Input */}
        <div className={`z-10 bg-slate-200 dark:bg-slate-800 ${perspective==='expert'?'rounded-none border-blue-500':'rounded px-6 py-2 shadow border-slate-300 dark:border-slate-700'} border flex items-center justify-center font-bold px-4 py-2`}>
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
          className={`w-48 py-4 ${perspective==='expert'?'bg-blue-900/20 border-2 border-blue-500 rounded-none':'bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700'} flex flex-col items-center justify-center relative z-10`}
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
        <div className={`z-10 ${perspective==='expert'?'bg-emerald-900/40 border-[3px] border-emerald-500 rounded-none w-56':'bg-slate-800 px-8 py-3 rounded-full border-2 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]'} flex items-center justify-center py-3`}>
          {perspective === 'expert' ? (
             <span className="font-mono text-emerald-400 font-bold whitespace-nowrap text-sm">LayerNorm(x + Sublayer(x))</span>
          ) : (
             <span className="font-bold text-emerald-400">{t.visuals.layerNorm}</span>
          )}
        </div>

      </div>
    </div>
  );
}

function MoEVisual() {
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
          className={`z-20 px-6 py-3 ${perspective==='expert'?'bg-slate-800 rounded-none border border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]':'bg-white dark:bg-slate-800 rounded-2xl shadow-xl border-t border-slate-100 dark:border-slate-700/50'} mb-12 flex items-center justify-center`}
        >
           {perspective === 'expert' ? (
             <div className="font-mono text-cyan-400 font-bold text-lg">G(x) = Softmax(TopK(x·W_g))</div>
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
                className={`${perspective==='expert'?'rounded-sm':'rounded-lg'} border flex flex-col items-center justify-center transition-all min-h-[60px] md:min-h-[80px] ${
                  activeExperts.includes(i) 
                    ? (perspective === 'expert' ? 'bg-cyan-900/80 border-cyan-400 text-cyan-100' : 'bg-cyan-900/60 border-cyan-700/50 text-cyan-800 dark:text-cyan-200') 
                    : 'bg-slate-200/40 dark:bg-slate-800/40 border-transparent text-slate-500 dark:text-slate-400'
                }`}
              >
                 {perspective === 'expert' ? (
                   <span className="font-mono text-xs md:text-sm font-bold opacity-80">SwiGLU_{i+1}(x)</span>
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
                x2={`${16.6 + col*33.3}%`}
                y2={`${7.5 + row*4}rem`}
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
}

function SoftmaxVisual() {
  const { t, perspective, lang } = useLanguage();
  const [streamIdx, setStreamIdx] = useState(0);

  const expertTokensZh = ["[BOS]", " 大", "型", "语", "言", "模", "型", "的", "核", "心", "原", "理", "基", "于", " Trans", "former", " 架", "构", "，", "通", "过", "自", "回", "归", "预", "测", "下", "一", "个", " T", "oken", "。", " [EOS]"];
  const expertTokensEn = ["<s>", " The", " core", " principle", " of", " large", " language", " models", " relies", " on", " the", " Transformer", " architecture", ",", " performing", " autoregressive", " next", "-", "token", " prediction", ".", " </s>"];
  const basicTokensZh = ["大", "模", "型", "的", "原", "理", "其", "实", "就", "是", "一", "场", "高", "度", "复", "杂", "的", "“", "文", "字", "接", "龙", "”", "游", "戏", "。", " ✨"];
  const basicTokensEn = ["The", " principle", " of", " large", " models", " is", " essentially", " a", " highly", " complex", " game", " of", " '", "word", " solitaire", "'", ".", " ✨"];
  
  const sequence = perspective === 'expert' 
    ? (lang === 'zh' ? expertTokensZh : expertTokensEn)
    : (lang === 'zh' ? basicTokensZh : basicTokensEn);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStreamIdx(prev => {
        if (prev >= sequence.length) {
          setTimeout(() => setStreamIdx(0), 3000);
          return prev;
        }
        return prev + 1;
      });
    }, 150);
    return () => clearTimeout(timer);
  }, [streamIdx, sequence.length]);
  
  const streamedText = sequence.slice(0, streamIdx).join('');

  return (
    <div className="relative h-96 bg-slate-100/80 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center overflow-hidden">
      
      {perspective === 'expert' && (
        <div className="absolute top-8 w-full flex justify-center">
            <div className="bg-slate-800/80 px-4 py-2 border border-slate-600 rounded text-center">
               <span className="font-mono text-sm text-yellow-400 font-bold tracking-widest block mb-1">P(x<sub>t</sub>|x<sub>&lt;t</sub>) = Softmax(H<sub>L</sub> W<sub>U</sub><sup>T</sup>)<sub>i</sub> = e<sup>z<sub>i</sub>/τ</sup> / Σ e<sup>z<sub>j</sub>/τ</sup></span>
            </div>
        </div>
      )}

      <div className="flex gap-2 md:gap-5 px-4 md:px-12 pb-4 border-b border-slate-300 dark:border-slate-700 z-10 w-full justify-between items-end h-40 transform -translate-y-4">
         {[0.02, 0.05, 0.01, 0.82, 0.03, 0.07].map((val, i) => (
           <div key={i} className="flex flex-col items-center justify-end h-full">
             {perspective === 'expert' && (
               <motion.span 
                 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.5 + i*0.1 }}
                 className={`text-[10px] font-mono mb-2 ${val > 0.5 ? 'text-green-400 font-bold' : 'text-slate-500'}`}
               >
                 {val.toFixed(2)}
               </motion.span>
             )}
             <motion.div 
               initial={{ height: 0, opacity: 0 }}
               whileInView={{ height: val * 100 + "%", opacity: 1 }}
               transition={{ delay: 0.5 + (i * 0.1), duration: 1 }}
               className={`w-8 md:w-12 rounded-t-sm flex items-end justify-center pb-2 text-[10px] md:text-sm font-bold shadow-lg ${
                 val > 0.5 ? 'bg-gradient-to-t from-green-600 to-green-400 text-slate-900 dark:text-white drop-shadow-[0_0_15px_rgba(34,197,94,0.8)]' : 'bg-slate-700 text-slate-600 dark:text-slate-400'
               }`}
             >
               {perspective !== 'expert' && (val > 0.5 ? "99%" : "")}
             </motion.div>
           </div>
         ))}
      </div>
      
      <div className={`mt-auto w-full max-w-2xl px-6 py-4 ${perspective==='expert'?'bg-slate-950 border border-green-500/30 rounded text-green-400 font-mono relative overflow-hidden shadow-[0_0_30px_rgba(34,197,94,0.1)]':'bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl text-slate-800 dark:text-slate-200 shadow-[0_0_30px_rgba(59,130,246,0.15)]'} min-h-[5.5rem] flex items-center justify-start text-sm md:text-lg z-10 transition-all duration-300`}>
        {perspective === 'expert' && <div className="absolute top-0 left-0 bg-green-900/50 text-green-400 text-[10px] font-bold px-2 py-0.5 rounded-br tracking-widest">sys.stdout</div>}
        {perspective === 'expert' && <div className="absolute top-0 right-0 w-8 h-full bg-gradient-to-l from-slate-950 to-transparent pointer-events-none"></div>}
        <span className="leading-relaxed mt-1">
          {perspective === 'expert' ? <span className="opacity-50 mr-2 text-green-500">{'>'}</span> : null}
          {streamedText}
          <motion.span 
             animate={{ opacity: [1, 0, 1] }} 
             transition={{ duration: 0.8, repeat: Infinity }}
             className={`inline-block w-2 ${perspective==='expert'?'h-4 bg-green-400':'h-5 w-1.5 bg-blue-500 rounded-full'} ml-1 align-middle`}
          />
        </span>
      </div>

    </div>
  );
}

function KVCacheVisual() {
  const { perspective } = useLanguage();
  return (
    <div className="relative h-96 bg-slate-100/80 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute top-4 left-6 right-6">
        <div className="flex items-center space-x-2 mb-2 text-xs font-mono text-slate-500">
           <Database className="w-4 h-4 text-purple-400" />
           <span>{perspective === 'expert' ? 'Physical VRAM (Paged Blocks)' : 'Memory Cache (KV)'}</span>
        </div>
      </div>
      
      {/* 这是一个简易的显存分配模拟 */}
      <div className="w-full flex-1 mt-6 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700/50 p-2 flex flex-col gap-2 relative shadow-inner">
          {perspective === 'expert' && <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiIGZpbGw9Im5vbmUiLz4KPHBhdGggZD0iTTAgMGgwLjV2NDBIMHoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMSkiLz4KPHBhdGggZD0iTTAgMGg0MHYwLjVIMHoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMSkiLz4KPC9zdmc+')] pointer-events-none opacity-50 z-0"/>}
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 flex-1 w-full z-10">
              {[...Array(24)].map((_, i) => {
                 let active = false;
                 let seqColor = '';
                 if ([0, 3, 5, 12, 17, 21].includes(i)) { active = true; seqColor = 'bg-indigo-400 dark:bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]'; }
                 if ([1, 2, 7, 10, 14, 23].includes(i)) { active = true; seqColor = 'bg-fuchsia-400 dark:bg-fuchsia-500 shadow-[0_0_15px_rgba(217,70,239,0.5)]'; }
                 if ([4, 8, 11, 15, 18, 19, 20].includes(i)) { active = true; seqColor = 'bg-teal-400 dark:bg-teal-500 shadow-[0_0_15px_rgba(20,184,166,0.5)]'; }
                 
                 return (
                   <motion.div 
                      key={i} 
                      className={`rounded md:rounded-lg border ${active ? 'border-transparent' : 'border-slate-300 dark:border-slate-800 bg-slate-200/50 dark:bg-slate-800/20'}`}
                      initial={{ scale: 0.8, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      transition={{ delay: i * 0.02, type: 'spring' }}
                   >
                     {active ? (
                        <motion.div 
                          className={`w-full h-full rounded md:rounded-lg ${seqColor} relative overflow-hidden`}
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: [0, 1, 0.8, 1] }}
                          transition={{ duration: 2, repeat: Infinity, delay: Math.random() * 2 }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-tr from-black/10 to-transparent dark:from-black/20"></div>
                          {perspective === 'expert' && <div className="absolute inset-0 flex items-center justify-center opacity-40 dark:opacity-30 text-[8px] font-mono font-bold text-slate-900 dark:text-white">BL_{i.toString(16).toUpperCase()}</div>}
                        </motion.div>
                     ) : null}
                   </motion.div>
                 )
              })}
          </div>
      </div>
      
      {/* 箭头指向和说明 */}
      <div className="mt-8 flex items-center justify-around w-full px-4 gap-6 text-sm">
         <motion.div className="flex items-center space-x-2" animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 2.5 }}>
            <div className="w-3 h-3 rounded-sm bg-indigo-500"></div>
            <span className="text-slate-600 dark:text-slate-400 font-mono text-xs font-bold">Seq 0 (Logic)</span>
         </motion.div>
         <motion.div className="flex items-center space-x-2" animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 2.2, delay: 0.2 }}>
            <div className="w-3 h-3 rounded-sm bg-fuchsia-500"></div>
            <span className="text-slate-600 dark:text-slate-400 font-mono text-xs font-bold">Seq 1 (Logic)</span>
         </motion.div>
         <motion.div className="flex items-center space-x-2" animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 2.7, delay: 0.5 }}>
            <div className="w-3 h-3 rounded-sm bg-teal-500"></div>
            <span className="text-slate-600 dark:text-slate-400 font-mono text-xs font-bold">Seq 2 (Logic)</span>
         </motion.div>
      </div>
    </div>
  );
}

function Hero({ theme, perspective }: { theme: Theme; perspective: Perspective }) {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);
  const { t } = useLanguage();
  return (
    <motion.div 
      style={{ y: y1, opacity }}
      className="h-screen flex flex-col items-center justify-center relative text-center px-4"
    >
      <div className={`absolute inset-0 bg-[url('https://images.unsplash.com/photo-1620121692029-d088224ddc74?q=80&w=2832&auto=format&fit=crop')] bg-cover bg-center ${theme === 'dark' ? 'opacity-[0.08] mix-blend-screen' : 'opacity-[0.05] mix-blend-multiply'}`}></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#f8fafc] dark:to-[#020617] via-[#f8fafc]/80 dark:via-[#020617]/80"></div>
      
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="z-10 relative mt-16"
      >
        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-cyan-900/20 border border-cyan-800/50 text-cyan-700 dark:text-cyan-300 mb-8 backdrop-blur-md shadow-[0_0_30px_rgba(34,211,238,0.15)]">
          <Aperture className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
           <span className="font-medium tracking-wide">{t.hero.badge}</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-6 leading-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400 drop-shadow-sm">
            {t.hero.title1}
          </span>
          <br/>
          <span className="text-slate-800 dark:text-slate-100">{t.hero.title2}</span>
        </h1>
        
        <p className="text-lg md:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto font-light leading-relaxed mb-16">
          {t.hero.subtitle[perspective]}
        </p>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-[1px] h-24 bg-gradient-to-b from-cyan-400 to-transparent mx-auto opacity-60"></div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}




const geekData = {
  tok: {
    title: "Token Embedding",
    title_zh: "Token 嵌入",
    shapes: "𝒳_in: [B, T]  ➔  𝒳_out: [B, T, d_model]",
    math: "E(x_i) = W_e[t_i] \cdot \sqrt{d_{model}}",
    code: "def embed(tokens, W_e):\n    return W_e[tokens] * math.sqrt(d_model)",
    desc_zh: "查表操作，将离散的整数索引映射为稠密连续的浮点特征向量。",
    desc_en: "Lookup operation mapping discrete integer indices to dense continuous floating-point feature vectors.",
    complexity: "𝒪(1) per token",
    color: "from-purple-500 to-fuchsia-600"
  },
  pos: {
    title: "Rotary Positional Embedding (RoPE)",
    title_zh: "位置编码",
    shapes: "𝒳: [B, T, n_heads, d_k]  ➔  𝒳': [B, T, n_heads, d_k]",
    math: "R_{\Theta, m} x = (\cos m\theta) x + (\sin m\theta) x_\perp",
    code: "def apply_rotary_emb(xq, xk, freqs_cis):\n    xq_ = torch.view_as_complex(xq.float().reshape(*xq.shape[:-1], -1, 2))\n    xk_ = torch.view_as_complex(xk.float().reshape(*xk.shape[:-1], -1, 2))\n    xq_out = torch.view_as_real(xq_ * freqs_cis).flatten(3)\n    xk_out = torch.view_as_real(xk_ * freqs_cis).flatten(3)\n    return xq_out.type_as(xq), xk_out.type_as(xk)",
    desc_zh: "通过对 Q、K 特征切片进行复数范围内的旋转变换，在不改变绝对大小的前提下，巧妙地注入相对位置信息。",
    desc_en: "Explicitly encodes relative position information by applying complex rotations to the query and key representations.",
    complexity: "𝒪(T · d_model)",
    color: "from-blue-500 to-indigo-600"
  },
  ln1: {
    title: "Layer Normalization (RMSNorm)",
    title_zh: "层归一化",
    shapes: "𝒳: [B, T, d_model] ➔ [B, T, d_model]",
    math: "\\text{RMSNorm}(x) = \\frac{x}{\\sqrt{\\frac{1}{d}\\sum_{i=1}^d x_i^2 + \\epsilon}} \\odot \\gamma",
    code: "def rms_norm(x, weight, eps=1e-6):\n    variance = x.pow(2).mean(-1, keepdim=True)\n    return x * torch.rsqrt(variance + eps) * weight",
    desc_zh: "稳定前向梯度与激活分布，现多采用无均值漂移的 RMSNorm。",
    desc_en: "Stabilizes gradients and activations. Modern models often use mean-free RMSNorm.",
    complexity: "𝒪(T · d_model)",
    color: "from-emerald-500 to-teal-600"
  },
  attn: {
    title: "Paged Causal Multi-Head Attention",
    title_zh: "多头自注意力",
    shapes: "Q,K,V: [B, T, d_model] ➔ [B, n_heads, T, d_k] ➔ [B, T, d_model]",
    math: "\\text{Attention}(Q,K,V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}} \\odot M\\right)V",
    code: "def paged_attention(query, key_cache, value_cache, block_tables):\n    attn_weights = []\n    for block_idx in block_tables:\n       k_block = key_cache[block_idx]\n       score = query @ k_block.T / math.sqrt(d_k)\n       attn_weights.append(score)\n    probs = F.softmax(torch.cat(attn_weights), dim=-1)\n    return probs @ v_blocks",
    desc_zh: "大模型推理的核心。基于 PagedAttention 分页对 KV Cache 寻址执行缩放点积。",
    desc_en: "The core of LLM scaling. Executes scaled dot-product attention utilizing PagedAttention for KV memory management.",
    complexity: "𝒪(T² · d_model)",
    color: "from-sky-400 to-blue-500"
  },
  add1: {
    title: "Residual Add",
    title_zh: "残差相加",
    shapes: "𝒳_new = 𝒳_old + 𝒳_attn",
    math: "x^{(l)} = x^{(l-1)} + \\text{Attn}(\\text{LN}(x^{(l-1)}))",
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
    math: "\\text{RMSNorm}(x) = \\dots",
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
    math: "\\text{MoE}(x) = \\sum w_i \\cdot ( \\text{SiLU}(x W_{g,i}) \\odot x W_{u,i} ) W_{d,i}",
    code: "def moe_ffn(x, router, experts):\n    routing_weights, selected_experts = router(x).topk(2, dim=-1)\n    routing_weights = F.softmax(routing_weights, dim=-1)\n    final_output = torch.zeros_like(x)\n    for i, expert in enumerate(experts):\n        expert_out = expert(x) # SwiGLU\n        final_output += expert_out * routing_weights[:, i:i+1]\n    return final_output",
    desc_zh: "采用门控单元的 SwiGLU。搭配路由网络仅激活 Top-K 专家，在不增加计算的前提下扩大模型容量。",
    desc_en: "SwiGLU FFN gating. Often paired with a routing network to only activate Top-K experts.",
    complexity: "𝒪(T · d_model · d_hidden) per expert",
    color: "from-orange-500 to-pink-600"
  },
  add2: {
    title: "Residual Add",
    title_zh: "残差相加",
    shapes: "𝒳_new = 𝒳_old + 𝒳_ffn",
    math: "x^{(l+1)} = x^{(l)} + \\text{FFN}(\\text{LN}(x^{(l)}))",
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
    math: "\\text{RMSNorm}(x_{final})",
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
    math: "\\text{Logits} = x \\cdot W_{vocab}^T",
    code: "logits = linear(x, weight=vocab_weights)\n# shape: (B, T, vocab_size)",
    desc_zh: "无偏线性映射至浩如烟海的词表空间。",
    desc_en: "Unbiased linear mapping to the vocabulary space, outputting log-odds for every token.",
    complexity: "𝒪(T · d_model · |V|)",
    color: "from-rose-500 to-red-600"
  },
  softmax: {
    title: "Softmax & Nucleus Sampling",
    title_zh: "采样机制",
    shapes: "Logits: [B, T, |V|] ➔ ℤ",
    math: "\\hat{P}(x) = \\text{softmax}(\\text{Logits} / \\tau)",
    code: "probs = F.softmax(logits / temperature, dim=-1)\n\n# Nucleus (Top-p) Sampling\nsorted_probs, sorted_indices = torch.sort(probs, descending=True)\ncumulative_probs = torch.cumsum(sorted_probs, dim=-1)\nprobs_to_remove = cumulative_probs > top_p\nprobs[probs_to_remove] = 0.0\nprobs = probs / probs.sum()\n\nnext_token = torch.multinomial(probs, num_samples=1)",
    desc_zh: "转化为概率并根据 Top-P, Temperature 截断与缩放后采样最终 Token。",
    desc_en: "Temperature and Top-p truncate and shift the distribution, sampling yields the next Token.",
    complexity: "𝒪(|V| \\log |V|)",
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
         <div className={`flex flex-col items-center justify-center ${w} ${h} rounded-lg shadow-lg ${isActive ? 'scale-[1.03] ring-4 ring-offset-2 ring-offset-slate-950 ring-cyan-400 z-20 shadow-[0_0_20px_rgba(34,211,238,0.5)]' : 'opacity-80 hover:opacity-100 ring-1 ring-white/10'} bg-gradient-to-r ${color} transition-all duration-300`}>
            <span className={`font-bold text-white tracking-wide px-4 leading-tight ${center?'text-center':''}`}>{lang === 'zh' ? data.title_zh : data.title}</span>
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
                          .replace(/(def |return |for |in |if |else )/g, '<span class="text-pink-400 font-bold">const geekData = {</span>')
                          .replace(/(import )/g, '<span class="text-pink-400 font-bold">const geekData = {</span>')
                          .replace(/(torch|math|F)/g, '<span class="text-cyan-400 font-semibold">const geekData = {</span>')
                          .replace(/(self)/g, '<span class="text-purple-400">const geekData = {</span>')
                          .replace(/(#.*)/g, '<span class="text-slate-500 italic">const geekData = {</span>')
                   }} />
                </pre>
             </div>
          </div>

       </div>
    </div>
  );
}

function AppContent() {
  const { t, lang, setLang, theme, setTheme, perspective, setPerspective } = useLanguage();
  return (
    <div className="bg-[#f8fafc] dark:bg-[#020617] min-h-screen text-slate-900 dark:text-slate-50 font-sans selection:bg-cyan-500 selection:text-slate-900 overflow-x-hidden">
      
      {/* Dynamic Background Pattern */}
      <div className="fixed inset-0 z-0 pointer-events-none" style={{
        backgroundImage: theme === 'dark' 
          ? `linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)`
          : `linear-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.03) 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
      }}></div>

      <div className="fixed top-6 right-6 md:top-8 md:right-8 z-50 flex items-center gap-3">
        <button 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="flex items-center justify-center w-10 h-10 bg-white/80 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-700/90 border border-slate-300 dark:border-slate-700 rounded-full text-slate-700 dark:text-slate-300 transition-all backdrop-blur-md shadow-xl"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>
        <button 
          onClick={() => setPerspective(perspective === 'basic' ? 'expert' : (perspective === 'expert' ? 'geek' : 'basic'))}
          className="flex items-center gap-2 px-5 py-2.5 bg-white/80 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-700/90 border border-slate-300 dark:border-slate-700 rounded-full text-slate-700 dark:text-slate-300 transition-all backdrop-blur-md shadow-xl"
        >
          {perspective === 'basic' ? <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : (perspective === 'expert' ? <GraduationCap className="w-4 h-4 text-purple-600 dark:text-purple-400" /> : <Cpu className="w-4 h-4 text-orange-600 dark:text-orange-400" />)}
          <span className="text-sm font-semibold tracking-wide hidden sm:inline">{perspective === 'basic' ? (lang === 'zh' ? '科普视角' : 'Basic') : (perspective === 'expert' ? (lang === 'zh' ? '专家视角' : 'Expert') : (lang === 'zh' ? '极客交互' : 'Geek'))}</span>
        </button>
        <button 
          onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
          className="flex items-center gap-2 px-5 py-2.5 bg-white/80 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-700/90 border border-slate-300 dark:border-slate-700 rounded-full text-slate-700 dark:text-slate-300 transition-all backdrop-blur-md shadow-xl"
        >
          <Globe className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          <span className="text-sm font-semibold tracking-wide">{lang === 'zh' ? 'EN' : '中'}</span>
        </button>
      </div>

      <Hero theme={theme} perspective={perspective} />

      <main className="relative z-10 pb-32">
        {perspective === "geek" ? <GeekPerspectiveView /> : (
          <>

        {/* Tokenizer */}
        <Section>
           <SectionContent 
             title={t.sections[perspective][0].title} 
             description={t.sections[perspective][0].desc} 
             history={(t.sections[perspective][0] as any).history}
             code={(t.sections[perspective][0] as any).code}
             icon={ScanLine} 
           />
           <TokenizationVisual />
        </Section>

        {/* Embedding Layer */}
        <Section className="bg-slate-50/50 dark:bg-slate-900/30 border-y border-slate-200 dark:border-slate-200/60 dark:border-slate-800/60 backdrop-blur-sm">
           <EmbeddingVisual />
           <SectionContent 
             title={t.sections[perspective][1].title} 
             description={t.sections[perspective][1].desc} 
             history={(t.sections[perspective][1] as any).history}
             code={(t.sections[perspective][1] as any).code}
             icon={Layers} 
           />
        </Section>

        {/* Positional Encoding (NEW) */}
        <Section>
           <SectionContent 
             title={t.sections[perspective][2].title} 
             description={t.sections[perspective][2].desc} 
             history={(t.sections[perspective][2] as any).history}
             code={(t.sections[perspective][2] as any).code}
             icon={Waves} 
           />
           <PositionalEncodingVisual />
        </Section>

        {/* Masked Multi-Head Attention (UPDATED) */}
        <Section className="bg-slate-50/50 dark:bg-slate-900/30 border-y border-slate-200 dark:border-slate-200/60 dark:border-slate-800/60 backdrop-blur-sm">
           <AttentionVisual />
           <SectionContent 
             title={t.sections[perspective][3].title} 
             description={t.sections[perspective][3].desc} 
             history={(t.sections[perspective][3] as any).history}
             code={(t.sections[perspective][3] as any).code}
             icon={Brain} 
           />
        </Section>
        
        {/* Residuals & Layer Norm (NEW) */}
        <Section>
           <SectionContent 
             title={t.sections[perspective][4].title} 
             description={t.sections[perspective][4].desc} 
             history={(t.sections[perspective][4] as any).history}
             code={(t.sections[perspective][4] as any).code}
             icon={GitMerge} 
           />
           <ResidualNormVisual />
        </Section>

        {/* FFN Layer (NEW) */}
        <Section className="bg-slate-50/50 dark:bg-slate-900/30 border-y border-slate-200 dark:border-slate-800/60 backdrop-blur-sm">
           <FFNVisual />
           <SectionContent 
             title={t.sections[perspective][5].title} 
             description={t.sections[perspective][5].desc} 
             history={(t.sections[perspective][5] as any).history}
             code={(t.sections[perspective][5] as any).code}
             icon={Layers} 
           />
        </Section>

        {/* Mixture of Experts */}
        <Section>
           <SectionContent 
             title={t.sections[perspective][6].title} 
             description={t.sections[perspective][6].desc} 
             history={(t.sections[perspective][6] as any).history}
             code={(t.sections[perspective][6] as any).code}
             icon={Network} 
           />
           <MoEVisual />
        </Section>

        {/* Softmax */}
        <Section className="bg-slate-50/50 dark:bg-slate-900/30 border-y border-slate-200 dark:border-slate-800/60 backdrop-blur-sm">
           <SoftmaxVisual />
           <SectionContent 
             title={t.sections[perspective][7].title} 
             description={t.sections[perspective][7].desc} 
             history={(t.sections[perspective][7] as any).history}
             code={(t.sections[perspective][7] as any).code}
             icon={Zap} 
           />
        </Section>
      
        {/* KV Cache / PagedAttention (NEW) */}
        <Section>
           <SectionContent 
             title={t.sections[perspective][8].title} 
             description={t.sections[perspective][8].desc} 
             history={(t.sections[perspective][8] as any).history}
             code={(t.sections[perspective][8] as any).code}
             icon={Database} 
           />
           <KVCacheVisual />
        </Section>
      
          </>
        )}
</main>


      {/* Footer */}
      <footer className="relative z-10 py-16 text-center bg-[#f8fafc] dark:bg-[#020617] border-t border-slate-200 dark:border-slate-800">
        <p className="text-slate-500 dark:text-slate-400 font-medium tracking-wide flex items-center justify-center gap-2">
          <Brain className="w-4 h-4" /> {t.visuals.footer}
        </p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
