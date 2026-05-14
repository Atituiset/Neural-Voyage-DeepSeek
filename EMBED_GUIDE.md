# 嵌入到技术博客的指南 / Guide to Embed in a Tech Blog

如果你想将这个图解大模型内部原理的应用嵌入到你的技术博客中，有以下几种常见且优雅的方式：

## 1. 使用 iframe 嵌入 (最简单快捷)
你可以将当前应用发布后，通过 `iframe` 标签直接嵌入到你的博客文章中。无论你的博客是基于 Hexo、Hugo、Ghost 还是 WordPress，这种方式都适用。

**HTML 代码示例：**
```html
<iframe 
  src="你的应用发布地址 (例如: https://ais-pre-xxx.run.app)" 
  width="100%" 
  height="800px" 
  style="border: none; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);" 
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
  allowfullscreen>
</iframe>
```
*提示：通过加上 `border-radius` 和 `box-shadow`，可以让嵌入的页面看起来更像是一个原生的卡片组件。*

## 2. 作为 React / MDX 组件引入 (适合前端博客)
如果你的博客是使用 **Next.js**, **Gatsby**, 或是支持 **MDX** 的框架 (如 Astro, Docusaurus) 构建的，你可以直接将这里的代码作为组件引入。

**步骤：**
1. 将本项目导出。
2. 将 `src/App.tsx` 和相关组件 (包括依赖的 `lucide-react`, `framer-motion`, `tailwindcss`) 复制到你的博客项目中。
3. 在你的 MDX 文件或 React 页面中直接渲染：
```mdx
# 大模型原理剖析

下面是我们交互式的图解：

import AppContent from '../components/LLMVisualizer/AppContent';

<div className="my-8 rounded-2xl overflow-hidden border border-slate-200">
  <AppContent />
</div>
```

## 3. 部署在子域名或子目录中集成
如果你希望用户有一个全屏的沉浸式体验，且不想受到博客原有样式的影响：
1. 通过右上角的菜单将项目导出到 GitHub。
2. 通过 Vercel, Netlify 或 GitHub Pages 将其部署为一个独立的站点（例如：`https://llm-visual.yourblog.com`）。
3. 在你的技术博客文章中，创建一个精美的“点击启动互动演示”的按钮或封面图，点击后在新标签页全屏打开该应用。

**按钮示例代码：**
```html
<a href="https://llm-visual.yourblog.com" target="_blank" style="display: inline-block; padding: 12px 24px; background: linear-gradient(to right, #06b6d4, #3b82f6); color: white; border-radius: 8px; text-decoration: none; font-weight: bold;">
  🚀 启动沉浸式交互演示
</a>
```

## 结论
- 如果追求**快速集成**，推荐使用 **iframe**。
- 如果追求**代码级的高级定制**，推荐导出为 **React 组件**。
- 如果追求**最佳体验**，推荐**独立部署并通过按钮跳转**。
