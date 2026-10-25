// Hand-written OpenUI Lang 1.0 programs that exercise every component and the
// main interactions. Rendered by the dev-only /gallery page.

export type Program = { id: string; title: string; note: string; code: string };

const bridge = "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Golden_Gate_Bridge_as_seen_from_Battery_East.jpg/960px-Golden_Gate_Bridge_as_seen_from_Battery_East.jpg";

// A small canvas game for HtmlView: catch the dot before the time runs out.
const game = `<style>body{display:flex;flex-direction:column;gap:10px;padding:14px}canvas{width:100%;height:220px;border-radius:12px;background:light-dark(#f7f7f8,#2a2a2a);touch-action:none;cursor:crosshair}.bar{display:flex;justify-content:space-between;font-size:13px}button{font:inherit;font-weight:500;padding:7px 14px;border-radius:999px;border:0;background:light-dark(#0d0d0d,#ececec);color:light-dark(#fff,#171717);cursor:pointer}</style>
<div class="bar"><span id="score">得分 0</span><span id="time">点击开始</span></div>
<canvas id="c"></canvas>
<div><button id="go">开始</button></div>
<script>
const c=document.getElementById('c'),g=c.getContext('2d'),dpr=devicePixelRatio||1;
let dot={x:.5,y:.5,vx:.004,vy:.003},score=0,end=0,raf;
function fit(){c.width=c.clientWidth*dpr;c.height=c.clientHeight*dpr}
function draw(){fit();g.clearRect(0,0,c.width,c.height);g.fillStyle='#0285ff';g.beginPath();g.arc(dot.x*c.width,dot.y*c.height,16*dpr,0,7);g.fill()}
function tick(){const left=Math.max(0,end-Date.now());document.getElementById('time').textContent=(left/1000).toFixed(1)+' 秒';
dot.x+=dot.vx;dot.y+=dot.vy;if(dot.x<.05||dot.x>.95)dot.vx*=-1;if(dot.y<.08||dot.y>.92)dot.vy*=-1;draw();
if(left>0)raf=requestAnimationFrame(tick);else document.getElementById('time').textContent='时间到！最终得分：'+score}
c.addEventListener('pointerdown',e=>{if(Date.now()>end)return;const r=c.getBoundingClientRect(),dx=(e.clientX-r.left)/r.width-dot.x,dy=(e.clientY-r.top)/r.height-dot.y;
if(Math.hypot(dx*r.width,dy*r.height)<26){score++;document.getElementById('score').textContent='得分 '+score;dot.vx=(Math.random()-.5)*.02;dot.vy=(Math.random()-.5)*.02;dot.x=.1+Math.random()*.8;dot.y=.15+Math.random()*.7}});
document.getElementById('go').onclick=()=>{score=0;document.getElementById('score').textContent='得分 0';end=Date.now()+15000;cancelAnimationFrame(raf);tick()};
draw();
</script>`;

export const programs: Program[] = [
  {
    id: "answer",
    title: "组合式回答",
    note: "根 Col 不设置间距即可排成文章版式；示例包含 Title、Text、Markdown、Grid 和 Card。",
    code: `root = Col([title, intro, photos, h2, md, stats, closing])
title = Title("里斯本的悠闲周六", "lg")
intro = Text("从河畔出发，登上**阿尔法玛**享用午餐，最后在观景台俯瞰城市，为一天画上句号。")
photos = Grid([SearchImage("Belém Tower Lisbon"), SearchImage("Alfama Lisbon"), SearchImage("Miradouro da Senhora do Monte")], 3, 100, 2)
h2 = Title("出发前", "md")
md = Markdown("- 28 路和 12 路电车上午 10 点后会变得拥挤。\\n- 石板路很光滑，请穿防滑的鞋。\\n- 大多数博物馆**周一**闭馆。")
stats = Grid([s1, s2, s3], 3, 150, 3)
s1 = Card([Caption("步行"), Title("6.4 km", "xl")], null, 4, 1)
s2 = Card([Caption("一日通票"), Title("€6.80", "xl")], null, 4, 1)
s3 = Card([Caption("日落"), Title("19:42", "xl")], null, 4, 1)
closing = Text("时间为估算值，并非实时数据。", "xs", "muted")`,
  },
  {
    id: "text",
    title: "文本",
    note: "标题字号、行内格式、Caption、Label、Badge 颜色、Link，以及包含表格的 Markdown。",
    code: `root = Card([t, sub, body, sizes, badges, link, Divider(), md])
t = Title("表达清晰，事半功倍", "lg")
sub = Text("用清晰的文字层级，让内容更容易阅读。", "sm", "muted")
body = Text("好的界面会突出有用信息：**在关键处强调**、*以轻量方式补充说明*、展示\`行内代码\`和[链接](https://openui.com)。")
sizes = Grid([z1, z2, z3], 3, 150, 4)
z1 = Col([Caption("大号数字，2xl"), Title("$1.00T", "2xl")], 1)
z2 = Col([Caption("卡片标题，lg"), Title("GDP 由什么构成？", "lg")], 1)
z3 = Col([Caption("区块标题，sm"), Title("探索增长情景", "sm"), Text("删除线", "sm", "muted", null, false, true)], 1)
badges = Row([Badge("示意数据"), Badge("有货", "success"), Badge("进行中", "info"), Badge("待审核", "warning"), Badge("售罄", "danger"), Badge("新品", "purple"), Badge("热门", "pink")], 2, null, null, true)
link = Row([Label("来源"), Link("美国经济分析局", "https://www.bea.gov"), Link("不安全链接会以纯文本显示", "javascript:alert(1)")], 3, null, null, true)
md = Markdown("### Markdown 正文\\n一段包含**粗体**、*斜体*和~~删除线~~的文字。\\n\\n1. 按编号列出的步骤\\n2. 按顺序阅读\\n\\n> 引用内容以简洁方式呈现。\\n\\n| 套餐 | 席位数 | 价格 |\\n|---|---|---|\\n| 基础版 | 1 | $9 |\\n| 团队版 | 10 | $49 |")`,
  },
  {
    id: "lists",
    title: "列表与时间线",
    note: "列表支持项目符号、编号或无标记；ListItem 可显示文字标记，时间线可添加连接线。",
    code: `root = Card([Title("周日烹饪安排", "lg"), Text("假设你计划在**下午 2:00** 开餐。", "sm", "muted"), schedule, Divider(), Grid([packing, steps], 2, 240, 6)])
schedule = List([a, b, c, d], "none", true)
a = ListItem("准备食材", "给羊肉调味，削好土豆并择好豆角。", "10:45")
b = ListItem("开始烤制", "将羊肉放入 200°C 的烤箱，烤至内部温度达到 60°C。", "11:15")
c = ListItem("放入土豆", "先煮 10 分钟，划破表面后放入热油中烤制。", "12:00")
d = ListItem("静置后切片", "羊肉静置 20 分钟，同时小火熬制肉汁。", "13:30")
packing = Col([Title("行李清单", "sm"), List(["轻便雨衣", "舒适的鞋子", "可重复使用的水瓶"])], 2)
steps = Col([Title("步骤", "sm"), List(["选择方向", "探索答案", "继续对话"], "number")], 2)`,
  },
  {
    id: "buttons",
    title: "按钮",
    note: "按钮变体、颜色、尺寸、图标、禁用和整行显示；IconButton。未指定动作的按钮会发送其标签文本。",
    code: `root = Card([main, sizes, colors, icons, Button("加入我的路线", @ToAssistant("将兰兹角加入我的路线"), "solid", null, "lg", "plus", false, true)])
main = Row([Button("定制我的胶囊衣橱", @ToAssistant("定制我的胶囊衣橱"), "solid", null, null, "arrow-right"), Button("复制分账结果", null, "outline", null, null, "copy"), Button("重置", null, "ghost", null, null, "rotate-ccw"), Button("柔和样式", null, "soft")], 2, null, null, true)
sizes = Row([Button("小", null, "outline", null, "sm"), Button("中", null, "outline"), Button("大", null, "outline", null, "lg"), Button("已禁用", null, "solid", null, null, null, true)], 2, null, null, true)
colors = Row([Button("删除", null, "solid", "danger"), Button("确认", null, "solid", "success"), Button("移除", null, "outline", "danger", null, "trash-2"), Button("打开文档", @OpenUrl("https://openui.com"), "ghost", null, null, "external-link")], 2, null, null, true)
icons = Row([IconButton("heart", null, "保存"), IconButton("share", null, "分享", "ghost"), IconButton("plus", null, "添加", "solid"), IconButton("bookmark", null, "收藏")], 2)`,
  },
  {
    id: "layout",
    title: "布局",
    note: "Box 背景、圆角、边框、尺寸和弹性布局；设置 minChildWidth 的 Grid；描边和柔和样式的 Card；Spacer。",
    code: `root = Col([stats, swatches, tints, summary], 4)
stats = Grid([st1, st2], 2, 220, 4)
st1 = Card([Caption("摄影服务 · 示例估算"), Title("$617M", "xl"), Caption("2025 年，美国 · 狭义市场口径")], null, 4, 2)
st2 = Card([Caption("商用无人机 · 示例估算"), Title("$4.1B", "xl"), Caption("2024 年，美国 · 广义市场口径")], null, 4, 2)
swatches = Row([Box([], null, null, null, "#d9c9b0", "lg", null, 44, 44), Box([], null, null, null, "#9fb4a4", "lg", null, 44, 44), Box([], null, null, null, "#4f5d75", "lg", null, 44, 44), Box([], null, null, null, "#c96f53", "full", null, 44, 44), Spacer(), Badge("暖色中性色")], 2)
tints = Grid([Box([Text("信息提示底色", "sm", "info")], null, null, 3, "info", "lg"), Box([Text("成功提示底色", "sm", "success")], null, null, 3, "success", "lg"), Box([Text("警告提示底色", "sm", "warning")], null, null, 3, "warning", "lg"), Box([Text("十六进制颜色背景", "sm"), Caption("文字仍清晰易读")], null, 1, 3, "#f5e6c8", "lg")], 4, 130, 2)
summary = Card([Row([Text("小计"), Spacer(), Text("$156.00", null, null, null, null, null, true)]), Row([Text("税费 · 8.5%", "sm", "muted"), Spacer(), Text("$13.26", "sm", "muted", null, null, null, true)]), Divider(), Row([Text("总计"), Spacer(), Title("$169.26", "xl")])], "soft", null, 2)`,
  },
  {
    id: "gdp",
    title: "与状态绑定的滑块",
    note: "四个绑定到 $x 的 Slider；自动计算总量，按比例显示分段条，并通过 @Reset 恢复初始值。",
    code: `root = Card([head, Caption("总产出"), total, bar, sliders, reset, Text("GDP = C + I + G + (X − M)。拖动任一滑块，总量和分段条都会随之更新。", "sm", "muted")])
$c = 600
$i = 200
$g = 170
$x = 30
gdp = $c + $i + $g + $x
head = Row([Col([Title("GDP 由什么构成？", "lg"), Text("由四部分构成的经济体。", "sm", "muted")], 1), Spacer(), Badge("示意经济体")], 3, "start")
total = Title("$" + @Round(gdp / 1000, 2) + " 万亿美元", "2xl")
bar = Box([seg1, seg2, seg3, seg4], "row", 0.5, null, null, "md", null, "100%", 38)
seg1 = Box([Text("$" + $c + "B", "xs", "#ffffff", "medium")], null, null, null, "chart1", 0, null, null, "100%", $c, "center", "center")
seg2 = Box([Text("$" + $i + "B", "xs", "#ffffff", "medium")], null, null, null, "chart2", 0, null, null, "100%", $i, "center", "center")
seg3 = Box([Text("$" + $g + "B", "xs", "#ffffff", "medium")], null, null, null, "chart4", 0, null, null, "100%", $g, "center", "center")
seg4 = Box([], null, null, null, "chart3", 0, null, null, "100%", $x > 0 ? $x : 0)
sliders = Grid([Slider($c, 0, 1200, 10, "消费支出", "B"), Slider($i, 0, 600, 10, "企业投资", "B"), Slider($g, 0, 500, 10, "政府支出", "B"), Slider($x, -200, 300, 10, "净出口", "B")], 2, 240, 6)
reset = Button("重置经济指标", @Reset($c, $i, $g, $x), "ghost", null, "sm", "rotate-ccw")`,
  },
  {
    id: "segmented",
    title: "分段选择控件",
    note: "SegmentedControl($mode) 控制要显示的内容；数字 Input 和 Slider 用于计算人均金额。",
    code: `root = Card([head, body, summary])
$mode = "item"
$people = 4
$tip = 18
head = Row([Title("你想如何分账？", "md"), Spacer(), SegmentedControl($mode, [{value: "item", label: "按项目"}, {value: "equal", label: "平均分摊"}])], 3, null, null, true)
body = $mode == "item" ? items : equal
items = Col([Row([Text("布拉塔奶酪和酸面包"), Spacer(), Text("$18", null, null, "medium", null, null, true)]), Row([Text("主菜"), Spacer(), Text("$96", null, null, "medium", null, null, true)]), Row([Text("一瓶红酒"), Spacer(), Text("$42", null, null, "medium", null, null, true)])], 3)
equal = Grid([Input($people, "用餐人数", "number"), Slider($tip, 0, 30, 1, "小费", "%", [{value: 0, label: "不加小费"}, {value: 15, label: "15%"}, {value: 30, label: "30%"}])], 2, 220, 6)
summary = Card([Row([Text("含小费总额"), Spacer(), Title("$" + @Round(156 * (1 + $tip / 100), 2), "lg")]), Row([Text($people + " 人均分", "sm", "muted"), Spacer(), Text("$" + @Round(156 * (1 + $tip / 100) / ($people > 0 ? $people : 1), 2), "sm", null, "medium", null, null, true)])], "soft", null, 2)`,
  },
  {
    id: "checklist",
    title: "复选框清单",
    note: "六个 Checkbox 分别绑定到 $pN，并支持划线显示；@Count(@Filter(...)) 用于更新进度文字和进度条。",
    code: `root = Card([Row([Title("你的行李箱", "md"), Spacer(), Text(done + " / 6 件已收拾", "sm", "muted", null, null, null, true)]), bar, list, Button("清空", @Reset($p1, $p2, $p3, $p4, $p5, $p6), "outline", null, "sm")], "soft")
$p1 = true
$p2 = false
$p3 = true
$p4 = false
$p5 = false
$p6 = false
done = @Count(@Filter([$p1, $p2, $p3, $p4, $p5, $p6], "", "==", true))
bar = Box([Box([], null, null, null, "ink", "full", null, (done / 6 * 100) + "%", 4)], null, null, null, "border", "full", null, "100%", 4)
list = Grid([Checkbox($p1, "日常 T 恤", true), Checkbox($p2, "宽松牛津纺衬衫", true), Checkbox($p3, "无结构西装外套", true), Checkbox($p4, "直筒长裤", true), Checkbox($p5, "简约皮革运动鞋", true), Checkbox($p6, "日常托特包", true)], 2, 220, 2)`,
  },
  {
    id: "pressable",
    title: "可点击网格",
    note: "点击 Pressable 瓷砖后通过 @Set 更新 $bed，并显示选中状态；详情行会读取 $bed。",
    code: `root = Card([Title("你的 4 × 4 英尺花园规划", "lg"), Text("点击种植箱，查看其中种植的作物。", "sm", "muted"), grid, detail])
$bed = "生菜和萝卜"
grid = Grid([p1, p2, p3, p4], 2, null, 3)
p1 = Pressable([Col([Icon("leafy-green", "lg"), Text("生菜和萝卜", "sm", null, "medium"), Caption("24 英寸种植箱")], 1, "center")], @Set($bed, "生菜和萝卜"), $bed == "生菜和萝卜", 6, "#d6e8cf", "lg")
p2 = Pressable([Col([Icon("bean", "lg"), Text("甜豆", "sm", null, "medium"), Caption("花盆和支架")], 1, "center")], @Set($bed, "甜豆"), $bed == "甜豆", 6, "#d6e8cf", "lg")
p3 = Pressable([Col([Icon("leaf", "lg"), Text("羽衣甘蓝", "sm", null, "medium"), Caption("12 英寸花盆")], 1, "center")], @Set($bed, "羽衣甘蓝"), $bed == "羽衣甘蓝", 6, "#ecdfc3", "lg")
p4 = Pressable([Col([Icon("sprout", "lg"), Text("香草", "sm", null, "medium"), Caption("1 至 2 个小花盆")], 1, "center")], @Set($bed, "香草"), $bed == "香草", 6, "#ecdfc3", "lg")
detail = Row([Icon("sun", "sm", "warning"), Text("已选择：**" + $bed + "**。每天至少需要 6 小时日照。", "sm")], 2)`,
  },
  {
    id: "inputs",
    title: "输入控件与表单",
    note: "Form 中包含文本和数字 Input、DatePicker、Select、RadioGroup 和 TextArea；提交按钮会把表单值作为上下文发送。",
    code: `root = Card([Title("按需定制", "lg"), form])
$name = ""
$people = 4
$date = "2026-10-24"
$pace = "balanced"
$weather = "mild"
$notes = ""
form = Form([Grid([Input($name, "姓名", "text", "请输入姓名"), Input($people, "出行人数", "number")], 2, 200, 4), Grid([DatePicker($date, "开始日期"), Select($pace, [{value: "relaxed", label: "悠闲"}, {value: "balanced", label: "适中"}, {value: "active", label: "紧凑"}], "偏好的节奏")], 2, 200, 4), RadioGroup($weather, [{value: "hot", label: "炎热 / 热带"}, {value: "mild", label: "温和 / 多变"}, {value: "cold", label: "寒冷 / 多雨"}], "你将前往什么天气的目的地？"), TextArea($notes, "还有其他要求吗？", "请输入你想去的地方…", 3), submit])
submit = Button("定制我的行程", @ToAssistant("定制我的行程", {name: $name, people: $people, date: $date, pace: $pace, weather: $weather, notes: $notes}), "solid", null, null, "arrow-right")`,
  },
  {
    id: "svg",
    title: "由滑块驱动的 SVG 图形",
    note: "G 变换和 SvgText 会读取 $angle；示例涵盖所有形状组件。",
    code: `root = Card([Title("转动曲柄", "md"), Text("后飞轮转动圈数是前齿盘的 " + ratio + " 倍。", "sm", "muted"), drawing, Slider($angle, 0, 360, 5, "曲柄角度", "°"), shapes])
$angle = 40
ratio = 2.5
drawing = Svg([chain, front, rear, readout], "0 0 320 160")
chain = Path("M 90 40 L 240 62 A 18 18 0 0 1 240 98 L 90 120 A 40 40 0 0 1 90 40 Z", null, "faint", 2)
front = G([Circle(90, 80, 40, "surface", "ink", 3), Line(90, 80, 90, 44, "ink", 4), Circle(90, 80, 6, "ink")], "rotate(" + $angle + " 90 80)")
rear = G([Circle(240, 80, 18, "surface", "ink", 3), Line(240, 80, 240, 64, "info", 3), Circle(240, 80, 4, "ink")], "rotate(" + $angle * ratio + " 240 80)")
readout = SvgText("后轮 " + @Round($angle * ratio % 360, 0) + "°", 240, 132, 12, "muted", "middle")
shapes = Svg([Rect(10, 10, 60, 40, "info", null, null, 0.8, 8), Ellipse(120, 30, 34, 20, "success"), Polygon("180,50 205,10 230,50", "warning"), Polyline("250,45 265,15 280,40 295,12", "danger", 3), SvgText("矩形 · 椭圆 · 多边形 · 折线", 160, 72, 11, "muted", "middle")], "0 0 320 80", null, null)`,
  },
  {
    id: "chart",
    title: "图表",
    note: "通过 SegmentedControl 切换 Chart($type)；示例包含货币和百分比格式、堆叠柱状图、饼图和环形图。",
    code: `root = Card([head, chart, Grid([pie, donut], 2, 260, 6)])
$type = "bar"
head = Row([Col([Title("无人机服务收入", "md"), Caption("示意收入走势，并非预测")], 1), Spacer(), SegmentedControl($type, ["bar", "line", "area"])], 3, null, null, true)
chart = Chart($type, rows, "year", ["Photography", "Inspection"], "currency", null, $type != "line")
rows = [{year: "2025", Photography: 617000000, Inspection: 410000000}, {year: "2027", Photography: 820000000, Inspection: 690000000}, {year: "2030", Photography: 1240000000, Inspection: 1310000000}, {year: "2034", Photography: 1900000000, Inspection: 2350000000}]
pie = Col([Title("出行方式", "sm"), Chart("pie", modes, "mode", ["share"], "percent")], 2)
donut = Col([Title("预算", "sm"), Chart("donut", budget, "item", ["amount"], "currency", "EUR")], 2)
modes = [{mode: "步行", share: 52}, {mode: "公共交通", share: 31}, {mode: "骑行", share: 17}]
budget = [{item: "住宿", amount: 840}, {item: "餐饮", amount: 420}, {item: "交通", amount: 260}, {item: "博物馆", amount: 90}]`,
  },
  {
    id: "table",
    title: "表格",
    note: "单元格按列顺序排列；数字列右对齐；单元格也可以是组件。",
    code: `root = Card([Title("这个市场中哪些参与者能够盈利？", "md"), Table(["参与者", "商业模式", "典型利润率", "难度"], [["无人机制造商", "销售无人机、相机和配件", "38%", Badge("较难", "danger")], ["自由飞手", "按拍摄或项目收费", "55%", Badge("容易", "success")], ["测绘公司", "软件订阅和数据处理费用", "24%", Badge("中", "warning")], ["企业", "运营自有机队", "不适用", Badge("中", "warning")]]), Table(["月份", "拍摄次数", "收入"], [["一月", 8, "$2,000"], ["二月", 12, "$3,000"], ["三月", 15, "$3,750"]])])`,
  },
  {
    id: "images",
    title: "图片",
    note: "示例展示有效 src、根据替代文本搜索、加载失败后回退到搜索，以及搜索无结果时的静态占位图。",
    code: `root = Card([Title("旧金山的黄金时刻", "md"), Grid([i1, i2, i3, i4], 4, 150, 3)])
i1 = Col([Image("${bridge}", "Golden Gate Bridge from Battery East"), Text("有效的 src", "sm", null, "semibold"), Caption("加载指定 URL")], 2)
i2 = Col([SearchImage("Alcatraz Island"), Text("未提供 src", "sm", null, "semibold"), Caption("根据查询词搜索图片")], 2)
i3 = Col([Image("https://example.invalid/palace.jpg", "Palace of Fine Arts"), Text("无效的 src", "sm", null, "semibold"), Caption("失败时改为搜索")], 2)
i4 = Col([Image("https://example.invalid/none.jpg", "qzxv unfindable subject 0000", 1.5, "xl"), Text("没有找到图片", "sm", null, "semibold"), Caption("显示静态占位图")], 2)`,
  },
  {
    id: "map",
    title: "带路线的地图",
    note: "Map(markers, route, $stop)：通过 /api/street-route 获取步行路线，支持类别筛选、表情符号和编号标记；点击标记会更新 $stop。",
    code: `root = Col([Title("按你的方式游览旧金山", "md"), Text("点击地图标记，选择起点。", "sm", "muted"), map, Card([Row([Icon("map-pin", "sm"), Text("从**" + $stop + "**", "sm")], 2)], "soft", 3)])
$stop = "Ferry Building"
map = Map([m1, m2, m3, m4], true, $stop)
m1 = MapMarker("Ferry Building", 37.7955, -122.3937, "餐饮", "☕")
m2 = MapMarker("Coit Tower", 37.8024, -122.4058, "观景")
m3 = MapMarker("Palace of Fine Arts", 37.8029, -122.4484, "地标", "🏛️")
m4 = MapMarker("Golden Gate Bridge", 37.8199, -122.4783, "观景", "🌉")`,
  },
  {
    id: "html",
    title: "HtmlView 游戏",
    note: "在沙箱中运行的 Canvas 游戏，启用 allow-scripts、使用不透明来源和严格 CSP，并根据内容自动调整尺寸。",
    code: `root = Card([Title("休息一下", "md"), Text("在 15 秒内尽可能多地点击圆点。", "sm", "muted"), HtmlView(${JSON.stringify(game)}, null, "点击圆点")])`,
  },
  {
    id: "timer",
    title: "计时器",
    note: "Timer($left) 对绑定的秒数倒计时；预设按钮通过 @Set 修改时间，$left 到 0 后会显示完成状态。",
    code: `root = Card([Title("泡一杯茶", "md"), presets, Timer($left, "剩余时间"), done])
$left = 180
presets = Row([Button("绿茶 · 2 分钟", @Set($left, 120), "outline", null, "sm"), Button("红茶 · 4 分钟", @Set($left, 240), "outline", null, "sm"), Button("花草茶 · 6 分钟", @Set($left, 360), "outline", null, "sm")], 2, null, null, true)
done = $left == 0 ? Text("**时间到。** 现在可以取出茶叶了。", "sm", "success") : Caption("水温合适后即可启动计时器。")`,
  },
  {
    id: "heatmap",
    title: "颜色映射",
    note: "@MixColor 将一个值映射到两个十六进制颜色之间，可用于热力图和底色。",
    code: `root = Card([Title("咖啡馆最繁忙的时段", "md"), Caption("过去 4 周每小时平均客流"), Grid(@Each(days, "d", Caption(d)), 7, null, 1), Grid(@Each(visits, "v", Box([Text(v + "", "xs", null, "medium", false, false, true)], null, null, 1, @MixColor("#EEF6FF", "#0068BC", v / 60), "sm", null, null, 32, null, "center", "center")), 7, null, 1), Row([Caption("较少"), Row(@Each([0, 0.25, 0.5, 0.75, 1], "t", Box([], null, null, null, @MixColor("#EEF6FF", "#0068BC", t), "sm", null, 20, 10)), 1), Caption("较多")], 2)])
days = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
visits = [12, 14, 13, 15, 18, 34, 30, 28, 30, 29, 31, 36, 52, 47, 41, 44, 40, 45, 50, 58, 49, 22, 24, 23, 27, 38, 44, 35]`,
  },
  {
    id: "icons",
    title: "图标",
    note: "展示不同尺寸和颜色的 Lucide 图标；未知名称不会渲染任何内容。",
    code: `root = Card([Row([Icon("sparkles", "sm"), Icon("map-pin"), Icon("camera", "lg"), Icon("bike", "xl"), Icon("heart", "lg", "danger"), Icon("check-circle", "lg", "success"), Icon("info", "lg", "info"), Icon("alert-triangle", "lg", "warning"), Icon("no-such-icon", "lg")], 4, null, null, true)])`,
  },
];
