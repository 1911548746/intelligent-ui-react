// 为 Image/SearchImage 组件按关键词查找真实图片：先查 Wikipedia 匹配页面，再查 Wikimedia Commons 文件。
// 搜索由服务端代发，浏览器只访问本站接口；结果会缓存在当前服务进程中。

const cache = new Map<string, string[]>();
const HEADERS = { "User-Agent": "open-intelligent-ui (https://github.com/thesysdev/open-intelligent-ui)" };
const SKIP = /\.svg|icon|logo|map|flag|seal|coat_of_arms|signature|diagram/i;
const WIDTH = 960;

type Page = { index?: number; thumbnail?: { source?: string }; imageinfo?: { thumburl?: string; url?: string; mime?: string }[] };

async function query(host: string, params: Record<string, string>): Promise<Page[]> {
  // 统一构造 Wikimedia API 查询，并设置 User-Agent 和 8 秒超时。
  const url = `https://${host}/w/api.php?${new URLSearchParams({ action: "query", format: "json", formatversion: "2", ...params })}`;
  const response = await fetch(url, { headers: HEADERS, signal: AbortSignal.timeout(8000) });
  if (!response.ok) throw new Error(`${host} ${response.status}`);
  const data: { error?: unknown; query?: { pages?: Page[] } } = await response.json();
  // Wikimedia 可能以 HTTP 200 返回 API 错误（例如限流）；此时抛错，
  // 避免把暂时失败误当成“没有图片”并缓存起来。
  if (data.error) throw new Error(`${host} error`);
  return (data.query?.pages ?? []).sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
}

// 提取长度大于 3 的关键词；Wikipedia 候选页面标题至少要与查询共享一个关键词。
const words = (text: string) => text.toLowerCase().split(/[^\p{L}\p{N}]+/u).filter((w) => w.length > 3);

type TitledPage = Page & { title?: string };

async function search(q: string): Promise<string[]> {
  const images: string[] = [];
  const add = (url: string | undefined) => {
    if (url && url.startsWith("https://") && !SKIP.test(url) && !images.includes(url)) images.push(url);
  };
  const wanted = new Set(words(q));
  // 先搜索 Wikipedia 文章，只接纳标题确实与查询相关的候选；
  // 例如搜索菜名时，不应仅因词语重合就返回餐饮连锁店的门面照片。
  const articles = (await query("en.wikipedia.org", { generator: "search", gsrsearch: q, gsrlimit: "6", prop: "pageimages", piprop: "thumbnail", pithumbsize: String(WIDTH) })) as TitledPage[];
  articles.filter((page) => words(page.title ?? "").some((w) => wanted.has(w))).forEach((page) => add(page.thumbnail?.source));
  // 再搜索 Commons 图片文件；长查询没有足够结果时，逐步去掉末尾词语以放宽搜索。
  const terms = q.split(/\s+/);
  const tries = [...new Set([terms.join(" "), terms.slice(0, 3).join(" "), terms.slice(0, 2).join(" ")])];
  for (const t of tries) {
    if (images.length >= 3) break;
    const files = await query("commons.wikimedia.org", { generator: "search", gsrsearch: `${t} filetype:bitmap`, gsrnamespace: "6", gsrlimit: "6", prop: "imageinfo", iiprop: "url|mime", iiurlwidth: String(WIDTH) });
    files.forEach((page) => {
      const info = page.imageinfo?.[0];
      if (info?.mime?.startsWith("image/")) add(info.thumburl ?? info.url);
    });
  }
  return images.slice(0, 4);
}

export async function GET(req: Request) {
  // q 是图片主题关键词；合并多余空白后再用于缓存和外部搜索。
  const q = new URL(req.url).searchParams.get("q")?.replace(/\s+/g, " ").trim();
  // 至少两个字符且不超过 200 个字符，避免无意义或过大的搜索请求。
  if (!q || q.length < 2 || q.length > 200) return Response.json({ error: { message: "q 必须包含 2 至 200 个字符。" } }, { status: 400 });
  // 缓存命中时跳过所有外部搜索。
  let images = cache.get(q);
  if (!images) {
    try {
      images = await search(q);
    } catch {
      // 搜索过程中任何外部服务失败都返回 502；失败结果不写入缓存，后续可重试。
      return Response.json({ error: { message: "图片搜索暂不可用。" } }, { status: 502 });
    }
    // 缓存达到上限时移除最早的一项，控制进程内存使用。
    if (cache.size >= 500) cache.delete(cache.keys().next().value!);
    cache.set(q, images);
  }
  // 返回候选 URL（不是图片二进制文件）；浏览器稍后再从 URL 加载图片。
  // 浏览器缓存 1 小时；支持共享缓存的代理/CDN 可缓存 1 天。
  return Response.json({ images }, { headers: { "Cache-Control": "public, max-age=3600, s-maxage=86400" } });
}
