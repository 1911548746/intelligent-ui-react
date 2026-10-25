import { notFound } from "next/navigation";
import { Preview } from "./preview";

// 开发页面：渲染评测脚本通过 window.__OPENUI_PROGRAM__ 传入的一段 OpenUI Lang 程序，供截图使用。
export default async function PreviewPage({ searchParams }: { searchParams: Promise<{ theme?: string }> }) {
  if (process.env.NODE_ENV === "production") notFound();
  const { theme } = await searchParams;
  return <Preview theme={theme === "dark" ? "dark" : "light"} />;
}
