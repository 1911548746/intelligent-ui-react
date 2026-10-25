// Hand-written programs that show composition: small primitives the model
// positions itself (rows of bars from Box, a retention grid from @MixColor,
// photos in a Carousel, cards that flip). Rendered by the dev-only /gallery page.

import type { Program } from "./programs";

const analytics = `root = Col([head, kpis, trend, Grid([sources, pages], 2, 300, 4), Grid([funnel, retention], 2, 300, 4)], 4)
$range = "30d"
$metric = "Visitors"
days = $range == "7d" ? 7 : $range == "30d" ? 30 : 90
traffic = @Each(@Range(0, days), "i", {day: @FormatDate(@AddDays(@Today(), i - days + 1), "short"), Visitors: 1700 + 380 * ((i * 7) % 5) + i * 9 + (((i + 2) % 7) < 2 ? -520 : 0), Pageviews: 4200 + 820 * ((i * 3) % 4) + i * 21 + (((i + 2) % 7) < 2 ? -1300 : 0)})
visitors = @Sum(traffic.Visitors)
views = @Sum(traffic.Pageviews)
head = Row([Col([Title("网页分析", "xl"), Caption("yoursite.com · 示例数据")], 1), Spacer(), SegmentedControl($range, [{value: "7d", label: "7 天"}, {value: "30d", label: "30 天"}, {value: "90d", label: "90 天"}])], 3, null, null, true)
kpiRows = [{label: "访客数", value: @Format(visitors, "compact", 1), change: 12.4, good: true}, {label: "页面浏览量", value: @Format(views, "compact", 1), change: 8.1, good: true}, {label: "会话时长", value: "3m 12s", change: -4.2, good: true}, {label: "跳出率", value: "41%", change: -2.6, good: false}]
kpis = Grid(@Each(kpiRows, "k", Card([Caption(k.label), Title(k.value, "2xl"), Badge((k.change > 0 ? "+" : "") + k.change + "%", (k.change > 0) == k.good ? "success" : "danger")], null, 4, 1)), 4, 150, 3)
trend = Card([Row([Title("流量", "sm"), Spacer(), SegmentedControl($metric, [{value: "Visitors", label: "访客数"}, {value: "Pageviews", label: "页面浏览量"}])], 2), Chart("area", traffic, "day", [$metric], "number", null, false, 220)], null, 5, 3)
shares = [{name: "Google", icon: "search", share: 41}, {name: "直接访问", icon: "mouse-pointer-click", share: 24}, {name: "Hacker News", icon: "newspaper", share: 15}, {name: "Twitter / X", icon: "at-sign", share: 11}, {name: "电子邮件简报", icon: "mail", share: 9}]
sources = Card([Title("主要来源", "sm"), Col(@Each(shares, "s", Col([Row([Icon(s.icon, "sm", "muted"), Text(s.name, "sm"), Spacer(), Text(@Format(visitors * s.share / 100, "compact", 1), "sm", null, "medium", false, false, true)], 2), Box([Box([], null, null, null, "chart1", "full", null, (s.share / 41 * 100) + "%", 6)], null, null, null, "surface", "full", null, "100%", 6)], 1)), 3)], null, 5, 3)
pageRows = [{path: "/", share: 31, time: "0:48"}, {path: "/pricing", share: 18, time: "1:52"}, {path: "/blog/launch-week", share: 14, time: "4:05"}, {path: "/docs/quickstart", share: 11, time: "3:31"}, {path: "/signup", share: 6, time: "1:10"}]
pages = Card([Title("热门页面", "sm"), Table(["页面", "浏览量", "平均停留时间"], @Each(pageRows, "p", [p.path, @Format(views * p.share / 100, "compact", 1), p.time]))], null, 5, 3)
steps = [{step: "访问网站", rate: 100}, {step: "查看价格", rate: 38}, {step: "开始注册", rate: 12.5}, {step: "完成激活", rate: 7.4}]
funnel = Card([Title("注册漏斗", "sm"), Col(@Each(steps, "f", Col([Row([Text(f.step, "sm"), Spacer(), Text(@Format(visitors * f.rate / 100, "compact", 1) + " · " + f.rate + "%", "sm", "muted", null, false, false, true)], 2), Box([], null, null, null, "chart3", "sm", null, f.rate + "%", 22)], 1)), 3)], null, 5, 3)
cohorts = [{week: "9 月 7 日", users: 1840, r: [100, 41, 30, 26, 23]}, {week: "9 月 14 日", users: 2015, r: [100, 44, 33, 27]}, {week: "9 月 21 日", users: 1922, r: [100, 39, 29]}, {week: "9 月 28 日", users: 2210, r: [100, 46]}, {week: "10 月 5 日", users: 2390, r: [100]}]
retention = Card([Title("每周留存率", "sm"), Row([Box([Caption("用户群组")], null, null, null, null, null, null, 64), Box([Row(@Each(["第 0 周", "第 1 周", "第 2 周", "第 3 周", "第 4 周"], "w", Box([Caption(w)], null, null, null, null, null, null, null, null, 1, "center")), 1)], null, null, null, null, null, null, null, null, 1)], 2), Col(@Each(cohorts, "c", Row([Box([Text(c.week, "xs", null, "medium"), Caption(@Format(c.users))], null, null, null, null, null, null, 64), Box([Row(@Each(@Range(0, 5), "i", i < @Count(c.r) ? Box([Text(c.r[i] + "%", "xs", null, "medium", false, false, true)], null, null, 1, @MixColor("#EDF5FF", "#0068BC", c.r[i] / 100), "sm", null, null, 32, 1, "center", "center") : Box([], null, null, null, "surface", "sm", null, null, 32, 1)), 1)], null, null, null, null, null, null, null, null, 1)], 2)), 1)], null, 5, 3)`;

const phones = `root = Col([title, intro, Grid([iphone, pixel], 2, 240, 4), Title("并排对比", "md"), specs, Title("哪款更适合你？", "md"), picker, verdict])
$care = "Camera"
title = Title("iPhone 17 vs Pixel 11", "xl")
intro = Text("两款旗舰手机售价相同。iPhone 是更稳妥的全能选择；Pixel 在摄影和 AI 功能方面更出色。")
iphone = Col([Box([SearchImage("iPhone 17", 1, "xl", "contain")], null, null, 4, "surface", "xl"), Row([Title("iPhone 17", "md"), Spacer(), Badge("售价 $799 起")], 2), Text([Icon("cpu", "sm"), " A19 · 6.3 英寸 120 Hz"], "sm", "muted")], 2)
pixel = Col([Box([SearchImage("Pixel 11", 1, "xl", "contain")], null, null, 4, "surface", "xl"), Row([Title("Pixel 11", "md"), Spacer(), Badge("售价 $799 起")], 2), Text([Icon("cpu", "sm"), " Tensor G6 · 6.3 英寸 120 Hz"], "sm", "muted")], 2)
rows = [{f: "主摄像头", a: "4800 万像素", b: "5000 万像素", win: "b"}, {f: "续航时间", a: "视频播放最长 30 小时", b: "视频播放最长 31 小时", win: "b"}, {f: "系统更新", a: "约 6 年", b: "7 年", win: "b"}, {f: "充电方式", a: "40 W 有线 · MagSafe", b: "30 W 有线 · Qi2", win: "a"}, {f: "生态系统", a: "iMessage、Apple Watch、Mac", b: "Gemini、Android", win: ""}]
specs = Table(["", "iPhone 17", "Pixel 11"], @Each(rows, "r", [r.f, Text([r.win == "a" ? Icon("check-circle", "sm", "success") : "", " " + r.a], "sm"), Text([r.win == "b" ? Icon("check-circle", "sm", "success") : "", " " + r.b], "sm")]))
picker = RadioGroup($care, [{value: "Camera", label: "拍照", description: "夜景、变焦和编辑"}, {value: "Apps", label: "我的其他设备", description: "Mac、Apple Watch、iMessage"}, {value: "Battery", label: "续航", description: "长时间使用"}], null, "cards")
pick = $care == "Apps" ? "iPhone 17" : "Pixel 11"
verdict = Card([Row([Box([SearchImage(pick, 1, "lg", "contain")], null, null, 2, "canvas", "lg", null, 64, 64), Col([Caption("为你推荐"), Title(pick, "lg"), Text($care == "Camera" ? "5000 万像素传感器和图像编辑工具能拍出更好的夜景。" : $care == "Apps" ? "它与您已有的 Apple 设备搭配最方便。" : "屏幕使用时间更长，电池损耗也更慢。", "sm", "muted")], 1)], 4)], "soft")`;

const spanish = `root = Col([title, intro, cards, Title("快速测验", "md"), quiz, Celebration($score == 4)])
$score = 0
$q = 0
$picked = ""
title = Title("8 个厨房西班牙语单词", "xl")
intro = Text([Icon("hand", "sm"), " 点击卡片查看中文释义，然后完成测验。"], "md", "muted")
words = [{es: "la cuchara", en: "勺子", emoji: "🥄"}, {es: "el cuchillo", en: "刀", emoji: "🔪"}, {es: "el tenedor", en: "叉子", emoji: "🍴"}, {es: "la sartén", en: "平底锅", emoji: "🍳"}, {es: "la olla", en: "锅", emoji: "🍲"}, {es: "el horno", en: "烤箱", emoji: "🔥"}, {es: "la nevera", en: "冰箱", emoji: "🧊"}, {es: "el vaso", en: "玻璃杯", emoji: "🥛"}]
cards = Carousel(@Each(words, "w", Flashcard([Title(w.emoji, "2xl"), Title(w.es, "lg")], [Title(w.en, "md"), Caption(w.es)])), 180)
questions = [{es: "la sartén", options: ["锅", "平底锅", "烤箱"], answer: "平底锅"}, {es: "el tenedor", options: ["叉子", "刀", "勺子"], answer: "叉子"}, {es: "la nevera", options: ["玻璃杯", "烤箱", "冰箱"], answer: "冰箱"}, {es: "la olla", options: ["锅", "勺子", "叉子"], answer: "锅"}]
current = questions[$q]
quiz = $q < 4 ? Card([Row([Caption("第 " + ($q + 1) + " 题"), Spacer(), Badge("得分 " + $score, "info")], 2), Title("以下单词是什么意思：" + current.es + "?", "lg"), Row(@Each(current.options, "o", Button(o, Action([@Set($picked, o), @Set($score, o == current.answer ? $score + 1 : $score), @Set($q, $q + 1)]), "outline")), 2, null, null, true), $picked == "" ? null : Caption("上次选择：" + $picked)], null, 5, 3) : Card([Title($score == 4 ? "太棒了，答对 4 题！" : "你答对了 " + $score + " 题", "lg"), Text($score == 4 ? "¡Muy bien！你已经掌握了不少厨房相关的西班牙语。" : "再翻看一遍单词卡，然后重新挑战。"), Button("再试一次", Action([@Reset($score, $q, $picked)]), "solid", null, null, "rotate-ccw")], "soft", 5, 3)`;

const primitives = `root = Col([Title("新组件示例", "lg"), Text(["文本可混合显示", Badge("行内", "purple"), "组件、", Icon("sparkles", "sm"), "图标和", Math("\\\\sqrt{2}", true), "数学公式。"]), Carousel([SearchImage("Golden Gate Bridge", 1.4), SearchImage("Alcatraz Island", 1.4), SearchImage("Painted Ladies", 1.4), SearchImage("Lombard Street", 1.4)], 220), Row([Text("通货膨胀会影响名义 GDP"), Popover(Icon("info", "sm", "muted"), [Text("**实际 GDP**剔除了价格变化，因此能够衡量真实产出。", "sm"), Link("阅读更多", "https://www.bea.gov")])], 2), Quote("至繁归于至简。", "Leonardo da Vinci"), Math("\\\\bar{x} \\\\sim \\\\mathcal{N}\\\\left(\\\\mu, \\\\frac{\\\\sigma^2}{n}\\\\right)"), Code("const total = items.reduce((sum, i) => sum + i.price, 0)", "javascript"), RadioGroup($size, ["S", "M", "L", "XL"], "尺码", "pills"), Chart("scatter", [{car: "Civic", hp: 158, mpg: 36}, {car: "Model 3", hp: 271, mpg: 132}, {car: "F-150", hp: 400, mpg: 20}, {car: "Prius", hp: 194, mpg: 57}, {car: "Mustang", hp: 480, mpg: 19}], "hp", ["mpg"]), Grid([Flashcard("Bonjour", "你好"), Flashcard("Merci", "谢谢")], 2, 160, 3), YouTube("dQw4w9WgXcQ", "音乐视频")])
$size = "M"`;

export const compositionPrograms: Program[] = [
  {
    id: "web-analytics",
    title: "网页分析仪表盘",
    note: "日期范围会驱动全部数字。示例包含带变化标记的 KPI 卡片、可切换指标的面积趋势图、来源条形图、用 Box 宽度构建的漏斗、热门页面表格，以及通过 @MixColor 构建的留存网格。",
    code: analytics,
  },
  {
    id: "compare-phones",
    title: "两款手机对比",
    note: "根据查询词搜索图片，用包含组件单元格的表格展示规格；RadioGroup 卡片可切换下方的推荐结果。",
    code: phones,
  },
  {
    id: "flashcards",
    title: "西班牙语单词卡与测验",
    note: "在 Carousel 中浏览单词卡，再通过 @Set 累积分数；答对 4 题后触发 Celebration。",
    code: spanish,
  },
  {
    id: "primitives",
    title: "新组件示例",
    note: "展示 Text 行内组件、Carousel、Popover、Quote、Math、Code、RadioGroup 胶囊选项、散点图、Flashcard 和 YouTube。",
    code: primitives,
  },
];
