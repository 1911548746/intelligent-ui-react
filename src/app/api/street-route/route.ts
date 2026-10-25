// 使用公开 OSRM 演示服务获取多个地点之间的道路几何路径。请求由服务端代发，
// 浏览器只访问本站接口；结果缓存在当前服务进程中。
// 本接口使用 driving（驾车）配置，返回路线概览，不是步行或公共交通导航。

const cache = new Map<string, [number, number][]>();
const MAX_STOPS = 25;

export async function GET(req: Request) {
  // coords 格式为“经度,纬度;经度,纬度;...”，至少包含两个坐标点。
  const coords = new URL(req.url).searchParams.get("coords") ?? "";
  const points = coords.split(";").map((pair) => pair.split(",").map(Number));
  // 限制地点数量并校验经纬度范围，拒绝无效或过大的外部路由请求。
  const valid = points.length >= 2 && points.length <= MAX_STOPS
    && points.every(([lng, lat, ...rest]) => !rest.length && Math.abs(lng) <= 180 && Math.abs(lat) <= 90);
  if (!valid) return Response.json({ error: { message: `coords 必须包含 2–${MAX_STOPS} 个“经度,纬度”坐标对。` } }, { status: 400 });
  // 规范化后的坐标串同时作为缓存键和 OSRM 路径参数。
  const key = points.map((p) => p.join(",")).join(";");

  // 相同地点顺序的路线直接使用缓存结果。
  let route = cache.get(key);
  if (!route) {
    try {
      const response = await fetch(`https://router.project-osrm.org/route/v1/driving/${key}?overview=full&geometries=geojson&steps=false`, { headers: { "User-Agent": "open-intelligent-ui (https://github.com/thesysdev/open-intelligent-ui)" }, signal: AbortSignal.timeout(10000) });
      if (!response.ok) throw new Error(`OSRM ${response.status}`);
      const data: { code?: string; routes?: { geometry?: { coordinates?: [number, number][] } }[] } = await response.json();
      const coordinates = data.routes?.[0]?.geometry?.coordinates ?? [];
      if (data.code !== "Ok" || coordinates.length < 2) throw new Error("No street route");
      // MapLibre 组件使用 [纬度,经度]，因此在返回前交换 OSRM 的坐标顺序。
      route = coordinates.map(([lng, lat]) => [lat, lng]);
      // 缓存达到上限时移除最早加入的一项，避免缓存无限增长。
      if (cache.size >= 200) cache.delete(cache.keys().next().value!);
      cache.set(key, route);
    } catch {
      // OSRM 超时、网络错误或没有可行路线时统一返回 502。
      return Response.json({ error: { message: "道路路线服务暂不可用。" } }, { status: 502 });
    }
  }
  // 返回路线折线点；浏览器缓存 1 小时，共享缓存可缓存 1 天。
  return Response.json({ points: route }, { headers: { "Cache-Control": "public, max-age=3600, s-maxage=86400" } });
}
