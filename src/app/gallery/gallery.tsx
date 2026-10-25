"use client";

import "./gallery.css";

import { Renderer, type ActionEvent, type OpenUIError } from "@openuidev/react-lang";
import { Fragment, useCallback, useState } from "react";
import { runLibraryAction } from "@/lib/actions";
import { webUrl } from "@/lib/components/style";
import { demoTools } from "@/lib/demo-data";
import { library } from "@/lib/library";
import { exampleDashboard, exampleShoppingList, exampleSteps, exampleTrip } from "@/lib/prompt-options";
import { compositionPrograms } from "./composition-programs";
import { programs, type Program } from "./programs";
import { toolPrograms } from "./tool-programs";

// 将提示词中的完整示例渲染出来，确保示例在当前组件库中可运行。
const promptExamples: Program[] = [
  { id: "example-list", title: "提示词示例：购物清单", note: "可操作工具提示词示例 1。", code: exampleShoppingList },
  { id: "example-trip", title: "提示词示例：组合式旅行答案", note: "提示词示例 2：照片、行程行和表单组合。", code: exampleTrip },
  { id: "example-steps", title: "提示词示例：带示意图的步骤", note: "提示词示例 3：由 $step 驱动、每一步都配有示意图。", code: exampleSteps },
  { id: "example-dashboard", title: "提示词示例：仪表盘", note: "提示词示例 4：启用演示数据工具时使用。", code: exampleDashboard },
];

const sections = [
  { title: "组合布局", programs: compositionPrograms },
  { title: "可操作工具", programs: [...toolPrograms, ...promptExamples] },
  { title: "组件", programs },
];

function Example({ program, onAction }: { program: Program; onAction: (event: ActionEvent) => void }) {
  const [errors, setErrors] = useState<OpenUIError[]>([]);
  const onError = useCallback((list: OpenUIError[]) => {
    setErrors(list);
    if (list.length) console.error(`[gallery:${program.id}]`, list.map((e) => e.message).join("; "));
  }, [program.id]);
  return (
    <section className="gallery-example" id={program.id} aria-labelledby={`${program.id}-title`}>
      <header>
        <h2 id={`${program.id}-title`}>{program.title}</h2>
        <p>{program.note}</p>
      </header>
      <div className="gallery-preview">
        <Renderer response={program.code} library={library} isStreaming={false} onAction={onAction} onError={onError} toolProvider={demoTools} />
      </div>
      {errors.length > 0 && (
        <ul className="gallery-errors">
          {errors.map((e, i) => <li key={i}>{e.message}</li>)}
        </ul>
      )}
      <details className="gallery-source">
        <summary>OpenUI Lang 源码</summary>
        <pre>{program.code}</pre>
      </details>
    </section>
  );
}

export function Gallery({ theme }: { theme: "light" | "dark" }) {
  const [notice, setNotice] = useState("");
  const onAction = useCallback((event: ActionEvent) => {
    const custom = runLibraryAction(event);
    if (custom) {
      void custom.then((ok) => setNotice(ok ? "已复制到剪贴板" : "复制失败"));
      return;
    }
    if (event.type === "open_url") {
      const url = webUrl((event.params as { url?: unknown })?.url);
      if (url) window.open(url, "_blank", "noopener,noreferrer");
      return;
    }
    const context = (event.params as { context?: unknown })?.context;
    setNotice(`已发送给助手：“${event.humanFriendlyMessage}”${context ? `，附带 ${JSON.stringify(context)}` : ""}`);
  }, []);

  return (
    <div className="gallery" data-theme={theme}>
      <header className="gallery-top">
        <div>
          <span className="gallery-name">OpenUI</span>
          <span className="gallery-divider" />
          <span className="gallery-sub">组件展示</span>
        </div>
        <nav className="gallery-theme" aria-label="主题">
          <a href="?theme=light" aria-current={theme === "light" ? "page" : undefined}>浅色</a>
          <a href="?theme=dark" aria-current={theme === "dark" ? "page" : undefined}>深色</a>
        </nav>
      </header>
      <main className="gallery-content">
        <div className="gallery-intro">
          <h1>由模型组合的基础组件</h1>
          <p>使用 OpenUI Lang 1.0 手写程序，由 1.0 Renderer 和本应用的组件库渲染。共 {Object.keys(library.components).length} 个组件、{Object.keys(library.functions).length} 个函数。</p>
          {sections.map((section) => (
            <nav key={section.title} className="gallery-index" aria-label={section.title}>
              {section.programs.map((p) => <a key={p.id} href={`#${p.id}`}>{p.title}</a>)}
            </nav>
          ))}
        </div>
        {sections.map((section) => (
          <Fragment key={section.title}>
            <h2 className="gallery-section">{section.title}</h2>
            {section.programs.map((program) => <Example key={program.id} program={program} onAction={onAction} />)}
          </Fragment>
        ))}
      </main>
      {notice && (
        <div className="gallery-notice" role="status">
          <span>{notice}</span>
          <button type="button" aria-label="关闭" onClick={() => setNotice("")}>×</button>
        </div>
      )}
    </div>
  );
}
