import fs from 'fs';

let appContent = fs.readFileSync('src/App.tsx', 'utf8');

const newContentDef = `const content = {
  zh: {
    hero: {
      badge: "硬核解析 · 沉浸式图解",
      title1: "大模型内部运行原理",
      title2: "奇妙之旅",
      subtitle: {
        basic: "你只是随手点开了一个对话框，没想到下一秒，一阵眩晕，你整个人被吸入了模型内部……",
        expert: "深入剖析基于 Transformer 的现代大语言模型架构，从 Token 映射到高维张量计算的完整前向传播路径提取。"
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
          title: "6. 混合专家 (MoE)",
          desc: "穿过发光的迷宫，一座由无数子舱组成的混合专家模型映入门帘。门控网络瞬间完成计算，精准点亮对应的几位 '专家' 接管任务。在保留海量知识的同时，节约了巨量算力。",
        },
        {
          title: "7. 回归与生成 (Softmax)",
          desc: "旅程接近终点。线性投影层结合 Softmax 算法，将无形的繁复向量映射回人类能够理解的词汇概率表。高悬的系统锁定概率最高的那颗完美词汇，至此，循环开启。",
        }
      ],
      expert: [
        {
          title: "1. 分词系统 (Tokenizer)",
          desc: "采用 BPE 或 WordPiece 算法将输入文本分割为离散符号序列，作为进入高维模型网络前的最小特征表示。",
        },
        {
          title: "2. 嵌入层 (Embedding)",
          desc: "通过词嵌入矩阵 (Embedding Matrix) 将离散 Token 映射为连续高维隐空间中的稠密向量，赋予词汇初始的语义距离表征。",
        },
        {
          title: "3. 位置编码 (Positional Encoding)",
          desc: "利用不同频率的正弦和余弦函数 (或 RoPE 旋转位置编码) 注入绝对或相对位置特征，打破自注意力机制的排列不变性缺陷。",
        },
        {
          title: "4. 多头掩码注意力 (Masked Attention)",
          desc: "将输入线性投影为 Q, K, V 张量通过缩放点积计算交互权重。下三角掩码矩阵 (Causal Mask) 限制自回归模型的信息泄露，多头机制从不同子空间解耦特征。",
        },
        {
          title: "5. 残差连接与归一化 (Add & Norm)",
          desc: "使用残差路径缓解深层网络梯度消失问题，通过层归一化 (LayerNorm 或 RMSNorm) 收敛特征方差，维持激活值分布稳定性。",
        },
        {
          title: "6. 混合专家 (MoE)",
          desc: "采用稀疏前馈网络架构 (Sparse FFN)，通过 Router 门控机制计算当前态的路由概率，仅激活对应的 Top-K 专家网络处理特征。",
        },
        {
          title: "7. 回归与生成 (Softmax)",
          desc: "尾部的语言模型头 (LM Head) 投影出 Logits 分布，利用 Softmax 函数转化为归一化概率，再依据特定的解码策略采样输出下一个词块分布。",
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
      badge: "In-Depth Analysis · Pro Visuals",
      title1: "Inner Workings of LLMs",
      title2: "A Wondrous Journey",
      subtitle: {
        basic: "You casually clicked a dialog box, and unexpectedly in the next second, a wave of dizziness hit, and you were sucked into the model...",
        expert: "A deep dive into the modern transformer-based Large Language Model architecture, extracting the complete forward propagation path from token mapping to high-dimensional tensor computations."
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
          title: "6. Mixture of Experts (MoE)",
          desc: "Through the glowing maze, an MoE model consisting of countless sub-cabins appears. The Gating Network calculates instantly, accurately lighting up only the necessary 'experts'. It holds massive scale while saving compute.",
        },
        {
          title: "7. Softmax & Generation",
          desc: "The journey nears its end. A linear projection combined with the Softmax algorithm maps invisible vectors back to a vocabulary probability curve. The system locks onto the highest probability word, and thus, the cycle begins.",
        }
      ],
      expert: [
        {
          title: "1. Tokenization System",
          desc: "Byte Pair Encoding (BPE) or WordPiece algorithm segments input text into a sequence of discrete symbols, acting as the minimal feature representations before entering the high-dimensional neural network.",
        },
        {
          title: "2. Embedding Layer",
          desc: "Maps discrete tokens into dense vectors in continuous high-dimensional latent space through an Embedding Matrix, imparting initial semantic distance representations.",
        },
        {
          title: "3. Positional Encoding",
          desc: "Applies combinations of varying frequency sine and cosine functions (or RoPE) to inject absolute or relative position signals, resolving the permutation invariance flaw of self-attention.",
        },
        {
          title: "4. Masked Multi-Head Attention",
          desc: "Inputs are linearly projected into Query, Key, and Value tensors, scaled dot-product attention computes interaction weights. Causal masking enforces autoregressive flow.",
        },
        {
          title: "5. Residuals & Layer Norm",
          desc: "Residual pathways circumvent vanishing gradients in exceptionally deep layers, followed by Layer Normalization (or RMSNorm) which bounds feature variance, stabilizing activation distributions.",
        },
        {
          title: "6. Mixture of Experts (MoE)",
          desc: "Employs a Sparse Feed-Forward Network architecture. A gating network routes computations to activate only specific Top-K generic 'experts' based on routing probabilities.",
        },
        {
          title: "7. Softmax & Generation",
          desc: "The final LM Head projects latent states into vocabulary logits. A Softmax function converts them into a normalized categorical probability distribution for decoding strategies.",
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
      footer: "Tribute to DeepSeek & Transformer Architecture · Pro Grade Visual Analysis Edition",
      wMatrix: "Multi-Head Matrix",
      inputX: "Input (x)",
      sublayer: "Attn / FFN Box",
      layerNorm: "Layer Norm",
      tokenVector: "Token Matrix",
      position: "Sine Wave",
      fused: "Fused Value"
    }
  }
};`;

const regexContent = /const content = \{[\s\S]*?\n\};\n/m;
appContent = appContent.replace(regexContent, newContentDef + '\n');


appContent = appContent.replace("import { Brain, Database, Network, Zap, ScanLine, Layers, Aperture, Globe, Waves, Activity, GitMerge, Sun, Moon } from 'lucide-react';", "import { Brain, Database, Network, Zap, ScanLine, Layers, Aperture, Globe, Waves, Activity, GitMerge, Sun, Moon, BookOpen, GraduationCap } from 'lucide-react';");


const oldContextDef = `type Language = keyof typeof content;

type Theme = 'light' | 'dark';

const AppContext = createContext<{
  lang: Language;
  setLang: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  t: typeof content['zh'];
}>({
  lang: 'zh',
  setLang: () => {},
  theme: 'dark',
  setTheme: () => {},
  t: content['zh']
});

function AppProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>('zh');
  const [theme, setTheme] = useState<Theme>('dark');`;

const newContextDef = `type Language = keyof typeof content;

type Theme = 'light' | 'dark';
type Perspective = 'basic' | 'expert';

const AppContext = createContext<{
  lang: Language;
  setLang: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  perspective: Perspective;
  setPerspective: (perspective: Perspective) => void;
  t: typeof content['zh'];
}>({
  lang: 'zh',
  setLang: () => {},
  theme: 'dark',
  setTheme: () => {},
  perspective: 'basic',
  setPerspective: () => {},
  t: content['zh']
});

function AppProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>('zh');
  const [theme, setTheme] = useState<Theme>('dark');
  const [perspective, setPerspective] = useState<Perspective>('basic');`;

appContent = appContent.replace(oldContextDef, newContextDef);

const oldProviderRet = `  return (
    <AppContext.Provider value={{ lang, setLang, theme, setTheme, t: content[lang] }}>
      {children}
    </AppContext.Provider>
  );`;

const newProviderRet = `  return (
    <AppContext.Provider value={{ lang, setLang, theme, setTheme, perspective, setPerspective, t: content[lang] }}>
      {children}
    </AppContext.Provider>
  );`;
  
appContent = appContent.replace(oldProviderRet, newProviderRet);

appContent = appContent.replace(`function Hero({ theme }: { theme: Theme }) {`, `function Hero({ theme, perspective }: { theme: Theme; perspective: Perspective }) {`);

// replace {t.hero.subtitle} with {t.hero.subtitle[perspective]}
appContent = appContent.replace(`{t.hero.subtitle}`, `{t.hero.subtitle[perspective]}`);

appContent = appContent.replace(`const { t, lang, setLang, theme, setTheme } = useLanguage();`, `const { t, lang, setLang, theme, setTheme, perspective, setPerspective } = useLanguage();`);

// The Hero usage in AppContent
appContent = appContent.replace(/<Hero theme=\{theme\} \/>/g, `<Hero theme={theme} perspective={perspective} />`);

// Replace t.sections with t.sections[perspective] everywhere in AppContent
appContent = appContent.replace(/t\.sections\[0\]/g, 't.sections[perspective][0]');
appContent = appContent.replace(/t\.sections\[1\]/g, 't.sections[perspective][1]');
appContent = appContent.replace(/t\.sections\[2\]/g, 't.sections[perspective][2]');
appContent = appContent.replace(/t\.sections\[3\]/g, 't.sections[perspective][3]');
appContent = appContent.replace(/t\.sections\[4\]/g, 't.sections[perspective][4]');
appContent = appContent.replace(/t\.sections\[5\]/g, 't.sections[perspective][5]');
appContent = appContent.replace(/t\.sections\[6\]/g, 't.sections[perspective][6]');


// Add a button sequence to the header (just before language toggle)
const oldButtons = `<button 
          onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
          className="flex items-center gap-2 px-5 py-2.5 bg-white/80 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-700/90 border border-slate-300 dark:border-slate-700 rounded-full text-slate-700 dark:text-slate-300 transition-all backdrop-blur-md shadow-xl"
        >
          <Globe className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          <span className="text-sm font-semibold tracking-wide">{lang === 'zh' ? 'EN' : '中'}</span>
        </button>`;

const newButtons = `<button 
          onClick={() => setPerspective(perspective === 'basic' ? 'expert' : 'basic')}
          className="flex items-center gap-2 px-5 py-2.5 bg-white/80 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-700/90 border border-slate-300 dark:border-slate-700 rounded-full text-slate-700 dark:text-slate-300 transition-all backdrop-blur-md shadow-xl"
        >
          {perspective === 'basic' ? <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <GraduationCap className="w-4 h-4 text-purple-600 dark:text-purple-400" />}
          <span className="text-sm font-semibold tracking-wide hidden sm:inline">{perspective === 'basic' ? (lang === 'zh' ? '科普视角' : 'Basic') : (lang === 'zh' ? '专家视角' : 'Expert')}</span>
        </button>
        <button 
          onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
          className="flex items-center gap-2 px-5 py-2.5 bg-white/80 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-700/90 border border-slate-300 dark:border-slate-700 rounded-full text-slate-700 dark:text-slate-300 transition-all backdrop-blur-md shadow-xl"
        >
          <Globe className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          <span className="text-sm font-semibold tracking-wide">{lang === 'zh' ? 'EN' : '中'}</span>
        </button>`;

appContent = appContent.replace(oldButtons, newButtons);

// Make the text style distinct for expert mode in SectionContent
// We can modify SectionContent to accept perspective but it's easier to just leave it as is 
// or let it use the desc as passed. The user will style it later if wanted.

fs.writeFileSync('src/App.tsx', appContent);
console.log('Done!');
