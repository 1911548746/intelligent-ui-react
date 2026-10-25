// 为图片组件提供 Wikipedia 图片候选和地点坐标。请求由服务端代发，
// 浏览器只访问本站接口；相同查询结果会缓存在当前服务进程中。

type WikiSummary = { thumbnail?: { source?: string }; coordinates?: { lat?: number; lon?: number } };
type WikiMedia = { items?: { type?: string; srcset?: { src: string }[] }[] };
type WikiInfo = { lat?: number; lng?: number; photos: string[] };

const cache = new Map<string, WikiInfo>();
const HEADERS = { "User-Agent": "open-intelligent-ui (https://github.com/thesysdev/open-intelligent-ui)" };

// Wikipedia 的 404 表示该标题没有页面，作为有效的空结果处理；其他失败抛出异常，
// 不写入缓存，使后续请求可以重试。
async function get(url: string) {
  const response = await fetch(url, { headers: HEADERS, signal: AbortSignal.timeout(8000) });
  if (response.status === 404) return {};
  if (!response.ok) throw new Error(`Wikipedia ${response.status}`);
  return response.json();
}

export async function GET(req: Request) {
  // title 是要精确查询的 Wikipedia 页面标题。
  const title = new URL(req.url).searchParams.get("title")?.trim();
  // 限制输入长度，拒绝缺失或异常长的标题。
  if (!title || title.length > 200) return Response.json({ error: { message: "title 为必填项，且不能超过 200 个字符。" } }, { status: 400 });
  // 命中进程内缓存时直接返回，避免重复访问 Wikipedia。
  let info = cache.get(title);
  if (!info) {
    // Wikipedia 页面标题以下划线表示空格，并进行 URL 编码。
    const t = encodeURIComponent(title.replace(/ /g, "_"));
    try {
      // 并行读取页面摘要（首图、坐标）和媒体列表，减少串行请求耗时。
      const [summary, media]: [WikiSummary, WikiMedia] = await Promise.all([
        get(`https://en.wikipedia.org/api/rest_v1/page/summary/${t}`),
        get(`https://en.wikipedia.org/api/rest_v1/page/media-list/${t}`),
      ]);
      // 首图优先取摘要缩略图，再从媒体列表补充图片；过滤地图、Logo、旗帜和 SVG，最多保留三张。
      const photos: string[] = [];
      // 比较图片文件名并忽略尺寸前缀，用来识别同一原图的不同缩略图。
      const key = (u: string) => decodeURIComponent(u.split("?")[0].split("/").slice(-1)[0]).replace(/^\d+px-/, "");
      if (summary?.thumbnail?.source) photos.push(summary.thumbnail.source);
      for (const item of media?.items ?? []) {
        if (item.type !== "image" || !item.srcset?.length) continue;
        const src = item.srcset[0].src;
        if (/\.svg|icon|logo|map|flag|seal/i.test(src)) continue;
        const url = src.startsWith("//") ? `https:${src}` : src;
        if (!photos.some((p) => key(p) === key(url))) photos.push(url);
        if (photos.length >= 3) break;
      }
      info = { lat: summary?.coordinates?.lat, lng: summary?.coordinates?.lon, photos };
      // 缓存达到上限时先移除最早加入的一项，避免缓存无限增长。
      if (cache.size >= 500) cache.delete(cache.keys().next().value!);
      cache.set(title, info);
    } catch {
      // 超时、网络错误或 Wikipedia 非 404 错误统一映射为 502。
      return Response.json({ error: { message: "Wikipedia 暂不可用。" } }, { status: 502 });
    }
  }
  // 浏览器缓存 1 小时；支持共享缓存的代理/CDN 可缓存 1 天。
  return Response.json(info, { headers: { "Cache-Control": "public, max-age=3600, s-maxage=86400" } });
}
