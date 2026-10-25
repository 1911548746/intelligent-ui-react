import { notFound } from "next/navigation";
import { Gallery } from "./gallery";

// 开发页面：展示覆盖全部组件的手写程序。
export default async function GalleryPage({ searchParams }: { searchParams: Promise<{ theme?: string }> }) {
  if (process.env.NODE_ENV === "production") notFound();
  const { theme } = await searchParams;
  return <Gallery theme={theme === "dark" ? "dark" : "light"} />;
}
