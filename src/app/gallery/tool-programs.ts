// Hand-written OpenUI Lang 1.0 answers for the 16 Intelligent UI example
// prompts and two dashboards, built only from the library and its @functions.
// They work in the page with $variables and @Set; nothing goes back to the
// assistant. The benchmark harness also uses them as fake model outputs, so
// this file has no runtime imports.

import type { Program } from "./programs";

/** example: the prompt id in the benchmark (the Intelligent UI example ids, or dash-*). */
export type ToolProgram = Program & { example: string; prompt: string };

const roast = `root = Col([head, dishes, planner, Grid([shopping, schedule], 2, 300, 5)], 5)
$guests = 6
$got = []
$done = []
head = Col([Title("和朋友一起享用周日烤肉", "xl"), Text("迷迭香蒜香羊肉、金黄土豆和美味配菜。购物清单会随用餐人数自动调整。", "md", "muted")], 2)
dishes = Grid([d1, d2, d3], 3, 170, 3)
d1 = Col([SearchImage("烤羊肉晚餐", 1.4, "lg"), Text("迷迭香蒜香羊肉", "sm", null, "semibold"), Caption("主菜，搭配肉汁和薄荷酱")], 1)
d2 = Col([SearchImage("Roast potato", 1.4, "lg"), Text("外脆里软的土豆", "sm", null, "semibold"), Caption("内里松软，边缘金黄")], 1)
d3 = Col([SearchImage("Apple crumble", 1.4, "lg"), Text("布拉姆利苹果酥粒", "sm", null, "semibold"), Caption("趁热搭配蛋奶沙司或奶油")], 1)
planner = Card([Row([Col([Text("用餐人数", "sm", null, "semibold"), Caption("用量随人数变化")], 0), Spacer(), IconButton("minus", @Set($guests, @Clamp($guests - 1, 2, 16)), "减少人数"), Title($guests + "", "lg"), IconButton("plus", @Set($guests, @Clamp($guests + 1, 2, 16)), "增加人数")], 3)], "soft", 4)
lines = @Each(ingredients, "i", {name: i.name, amount: i.unit == "kg" ? @Format(i.qty * $guests / 6, "number", 1) + " kg" : i.unit == "g" ? @Format(@Round(i.qty * $guests / 300) * 50) + " g" : @Ceil(i.qty * $guests / 6) + ""})
shopping = Card([Row([Title("购物清单", "md"), Spacer(), Badge(@Count($got) + " / " + @Count(lines) + " 项已放入清单", @Count($got) == @Count(lines) ? "success" : "neutral")], 2), Col(@Each(lines, "l", Pressable([Row([Icon(@Includes($got, l.name) ? "check-circle" : "circle", "sm", @Includes($got, l.name) ? "success" : "faint"), Text(l.name, "sm", null, null, false, @Includes($got, l.name)), Spacer(), Text(l.amount, "sm", "muted", "medium", false, false, true)], 2)], @Set($got, @Toggle($got, l.name)), @Includes($got, l.name), 2)), 1), Button("复制购物清单", @CopyToClipboard("周日烤肉，用餐人数：" + $guests + "\\n" + @Join(@Each(lines, "l", "- " + l.amount + " " + l.name), "\\n")), "outline", null, "sm", "copy")], null, 4, 3)
schedule = Card([Row([Title("烹饪计划", "md"), Spacer(), Text(@Count($done) + " / " + @Count(steps) + " 项已完成", "sm", "muted")], 2), Col(@Each(steps, "s", Pressable([Row([Icon(@Includes($done, s.title) ? "check-circle" : "circle", "sm", @Includes($done, s.title) ? "success" : "faint"), Col([Text(s.time + " · " + s.title, "sm", null, "semibold", false, @Includes($done, s.title)), Caption(s.description)], 0)], 3, "start")], @Set($done, @Toggle($done, s.title)), @Includes($done, s.title), 2)), 1), Button("重新开始", @Reset($done, $got), "ghost", null, "sm", "rotate-ccw")], null, 4, 3)
ingredients = [{name: "带骨羊腿", qty: 2.4, unit: "kg"}, {name: "土豆", qty: 1800, unit: "g"}, {name: "胡萝卜", qty: 9, unit: ""}, {name: "欧洲防风草", qty: 6, unit: ""}, {name: "嫩茎西兰花", qty: 750, unit: "g"}, {name: "制作苹果酥所需的苹果", qty: 5, unit: ""}, {name: "束迷迭香", qty: 1, unit: ""}]
steps = [{time: "周六", title: "提前准备", description: "制作苹果酥、腌制羊肉并摆好餐桌。"}, {time: "12:30", title: "放入羊肉", description: "先以 200°C 烤 20 分钟，再以 180°C 按每 500 克约 25 分钟烤制。"}, {time: "13:15", title: "放入土豆", description: "先煮熟，划破表面后放入热油中烤制。"}, {time: "14:30", title: "静置后切片", description: "羊肉静置 20 分钟，同时完成蔬菜烹饪。"}, {time: "15:00", title: "上桌", description: "入座时将苹果酥放入烤箱。"}]`;

const bill = `root = Card([head, people, addPerson, Divider(), itemsHead, items, addItem, Divider(), rates, summary], null, 5, 4)
$mode = "item"
$people = ["我", "小 Alex", "小 Sam", "小 Jordan"]
$items = [{name: "布拉塔奶酪和酸面包", amount: 18, people: ["我", "小 Alex", "小 Sam", "小 Jordan"]}, {name: "主菜", amount: 96, people: ["我", "小 Alex", "小 Sam", "小 Jordan"]}, {name: "一瓶红酒", amount: 42, people: ["我", "小 Alex", "小 Jordan"]}]
$name = ""
$itemName = ""
$itemAmount = null
$tax = 8.5
$tip = 20
head = Row([Col([Title("请结账", "lg"), Text($mode == "item" ? "点击项目下方的姓名，选择共同分摊的人。" : "每个人支付相同份额。", "sm", "muted")], 1), Spacer(), SegmentedControl($mode, [{value: "item", label: "按项目"}, {value: "equal", label: "平均分摊"}])], 3, null, null, true)
people = Row(@Each($people, "p", Button(p, Action([@Set($people, @Remove($people, "", p)), @Set($items, @Each($items, "it", {name: it.name, amount: it.amount, people: @Remove(it.people, "", p)}))]), "soft", null, "sm", "x")), 2, null, null, true)
addPerson = Row([Input($name, null, "text", "添加用餐人"), Button("添加", Action([@Set($people, @Append($people, $name)), @Set($items, @Each($items, "it", {name: it.name, amount: it.amount, people: @Append(it.people, $name)})), @Reset($name)]), "outline", null, null, "user-plus", $name == "" || @Includes($people, $name))], 2)
itemsHead = Row([Title("项目", "md"), Spacer(), Text(@Format(subtotal, "currency"), "sm", "muted", "medium", false, false, true)])
items = Col(@Each($items, "it", Card([Row([Text(it.name, "sm", null, "semibold"), Spacer(), Text(@Format(it.amount, "currency"), "sm", null, "medium", false, false, true), IconButton("trash-2", @Set($items, @Remove($items, "name", it.name)), "移除 " + it.name, "ghost")], 2), $mode == "item" ? Row(@Each($people, "p", Button(p, @Set($items, @Update($items, "name", it.name, "people", @Toggle(it.people, p))), @Includes(it.people, p) ? "solid" : "outline", null, "sm", @Includes(it.people, p) ? "check" : null)), 1, null, null, true) : null], null, 3, 2)), 2)
addItem = Row([Input($itemName, null, "text", "项目"), Input($itemAmount, null, "number", "价格"), Button("添加项目", Action([@Set($items, @Append($items, {name: $itemName, amount: $itemAmount, people: $people})), @Reset($itemName, $itemAmount)]), "outline", null, null, "plus", $itemName == "" || $itemAmount <= 0)], 2)
rates = Grid([Slider($tax, 0, 15, 0.5, "税费", "%"), Slider($tip, 0, 30, 1, "小费", "%")], 2, 220, 6)
subtotal = @Sum($items.amount)
factor = 1 + ($tax + $tip) / 100
unassigned = $mode == "equal" ? 0 : @Sum(@Each($items, "it", @Count(it.people) == 0 ? it.amount : 0))
raw = @Each($people, "p", factor * ($mode == "equal" ? subtotal / @Max([@Count($people), 1]) : @Sum(@Each($items, "it", @Includes(it.people, p) ? it.amount / @Count(it.people) : 0))))
cents = @Sum(raw) > 0 ? @Allocate(@Round(@Sum(raw), 2), raw) : raw
shares = @Each(@Range(0, @Count($people)), "i", {name: $people[i], amount: cents[i]})
summary = Card([Col(@Each(shares, "s", Row([Text(s.name), Spacer(), Text(@Format(s.amount, "currency"), null, null, "semibold", false, false, true)])), 2), Divider(), Row([Text("含税费和小费总额", "sm", "muted"), Spacer(), Title(@Format(subtotal * factor, "currency"), "lg")]), unassigned > 0 ? Text(@Format(unassigned, "currency") + " 尚未分配给任何人。", "xs", "warning") : null, Button("复制分账结果", @CopyToClipboard(@Join(@Each(shares, "s", s.name + ": " + @Format(s.amount, "currency")), "\\n")), "solid", null, "sm", "copy")], "soft", 4, 3)`;

const monty = `root = Card([head, doors, status, actions, record, sim], null, 5, 4)
$choice = -1
$opened = -1
$final = -1
$prize = 0
$switched = 0
$switchWins = 0
$stayed = 0
$stayWins = 0
$simStay = 0
$simGames = 0
head = Col([Title("你应该换门吗？", "lg"), Text("一辆汽车，两只山羊。换门有一个出人意料的充分理由。", "sm", "muted")], 1)
doors = Grid(@Each(@Range(0, 3), "d", Pressable([Col([Text("第 " + (d + 1), "sm", "muted", "medium"), Title(d == $opened || $final >= 0 ? (d == $prize ? "🚗" : "🐐") : "🚪", "3xl"), Text(d == $choice ? "你的选择" : d == $opened ? "主持人打开的门" : "未打开", "xs", d == $choice ? "info" : "muted", "medium")], 1, "center")], $choice < 0 ? Action([@Set($choice, d), @Set($prize, @Random(0, 2, true)), @Set($opened, $prize == d ? (d + 1 + @Random(0, 1, true)) % 3 : 3 - d - $prize)]) : null, d == $choice, 5, d == $opened || $final >= 0 ? "surface" : "warning", "lg")), 3, null, 3)
status = Box([Title($final >= 0 ? ($final == $prize ? "你找到了汽车！" : "这次是山羊。") : $choice >= 0 ? "第 " + ($opened + 1) + " 后面是山羊。" : "请先选择一扇门。", "md"), Text($final >= 0 ? "如果第一次选到的是山羊，换门就能获胜，概率为 2/3。" : $choice >= 0 ? "当前这扇门仍有 1/3 的概率，另一扇未打开的门有 2/3。要换门还是坚持？" : "主持人知道汽车的位置，并会打开另一扇有山羊的门。", "sm", "muted")], null, 1, 4, "info", "lg")
actions = Row([$choice >= 0 && $final < 0 ? Button("换门", Action([@Set($final, 3 - $choice - $opened), @Set($switched, $switched + 1), @Set($switchWins, $switchWins + ($final == $prize ? 1 : 0))]), "solid", null, null, "shuffle") : null, $choice >= 0 && $final < 0 ? Button("坚持当前选择", Action([@Set($final, $choice), @Set($stayed, $stayed + 1), @Set($stayWins, $stayWins + ($final == $prize ? 1 : 0))]), "outline") : null, $final >= 0 ? Button("再玩一次", @Reset($choice, $opened, $final), "solid", null, null, "rotate-ccw") : null, Button("模拟 1,000 局", Action([@Set($simStay, $simStay + @Count(@Filter(@Each(@Range(0, 1000), "g", @Random(0, 2, true) == @Random(0, 2, true)), "", "==", true))), @Set($simGames, $simGames + 1000)]), "ghost", null, null, "dices")], 2, null, null, true)
record = $switched + $stayed > 0 ? Text("你的游戏：换门 " + $switched + " 局，赢了 " + $switchWins + "；坚持 " + $stayed + " 局，赢了 " + $stayWins + "。", "sm", "muted") : null
sim = $simGames > 0 ? Card([Row([Title("模拟游戏", "sm"), Spacer(), Caption(@Format($simGames) + " 局")]), Chart("bar", [{strategy: "坚持", wins: @Percent($simStay, $simGames)}, {strategy: "换门", wins: 100 - @Percent($simStay, $simGames)}], "strategy", ["wins"], "percent", null, false, 160)], "soft", 4, 2) : null`;

const savings = `root = Card([head, kpis, chart, milestone, controls, Text("假设按月复利，并在每月月底投入。收益并无保证；此内容仅作示意，不构成建议。", "xs", "muted")], null, 5, 4)
$initial = 10000
$monthly = 500
$years = 30
$rate = 5
head = Row([Col([Title("退休储蓄", "lg"), Text("把今天的投入变成明天的规划。", "sm", "muted")], 1), Spacer(), Button("重置", @Reset($initial, $monthly, $years, $rate), "ghost", null, "sm", "rotate-ccw")], 3, "start")
rows = @Each(@Range(0, $years + 1), "y", {year: "第 " + y, contributions: $initial + $monthly * 12 * y, balance: $rate == 0 ? $initial + $monthly * 12 * y : $initial * @Pow(1 + $rate / 1200, 12 * y) + $monthly * (@Pow(1 + $rate / 1200, 12 * y) - 1) / ($rate / 1200)})
final = @Last(rows)
million = @First(@Filter(rows, "balance", ">=", 1000000))
kpis = Grid([k1, k2, k3], 3, 150, 3)
k1 = Card([Caption("余额（" + $years + " 年）"), Title(@Format(final.balance, "currency", 0), "xl")], "soft", 3, 1)
k2 = Card([Caption("投入金额"), Title(@Format(final.contributions, "currency", 0), "xl")], "soft", 3, 1)
k3 = Card([Caption("增长"), Title(@Format(final.balance - final.contributions, "currency", 0), "xl", "success")], "soft", 3, 1)
chart = Chart("area", rows, "year", ["contributions", "balance"], "currency")
milestone = Row([Icon(million == null ? "hourglass" : "party-popper", "sm", million == null ? "muted" : "success"), Text(million == null ? "按当前节奏，余额不会达到 100 万美元。" : "你将在第 " + million.year + " 年达到 100 万美元，其中 " + @Format(@Percent(million.balance - million.contributions, million.balance), "percent", 0) + " 来自投资增长。", "sm")], 2)
controls = Grid([Slider($initial, 0, 200000, 1000, "起始余额", "$"), Slider($monthly, 0, 5000, 50, "每月投入", "$"), Slider($years, 1, 50, 1, "年数", " 年"), Slider($rate, 0, 12, 0.5, "年收益率", "%")], 2, 240, 6)`;

const gdp = `root = Card([head, Caption("总产出"), total, bar, legend, note, sliders, Row([Button("重置经济指标", @Reset($c, $i, $g, $x), "ghost", null, "sm", "rotate-ccw"), Spacer(), Badge("GDP = C + I + G + (X − M)", "purple")], 2, null, null, true), Text("GDP 统计一个国家境内生产的最终商品和服务价值。进口品在其他国家生产，因此需要扣除。", "sm", "muted"), quiz], null, 5, 4)
$c = 600
$i = 200
$g = 170
$x = 30
$answer = ""
gdp = $c + $i + $g + $x
parts = [{label: "消费支出", value: $c, color: "chart1"}, {label: "企业投资", value: $i, color: "chart2"}, {label: "政府支出", value: $g, color: "chart4"}, {label: "净出口", value: $x, color: "chart3"}]
head = Row([Col([Title("GDP 由什么构成？", "lg"), Text("由四部分构成的经济体。", "sm", "muted")], 1), Spacer(), Badge("示意经济体")], 3, "start")
total = Title("$" + @Format(gdp / 1000, "number", 2) + " 万亿美元", "2xl")
bar = Box(@Each(parts, "p", Box([p.value >= 80 ? Text("$" + p.value + "B", "xs", "#ffffff", "medium") : null], null, null, null, p.color, 0, null, null, "100%", @Max([p.value, 0]), "center", "center")), "row", 0.5, null, null, "md", null, "100%", 38)
legend = Grid(@Each(parts, "p", Row([Box([], null, null, null, p.color, "full", null, 10, 10), Text(p.label, "sm"), Spacer(), Text((p.value < 0 ? "-$" : "$") + @Format(@Abs(p.value)) + "B", "sm", "muted", "medium", false, false, true)], 2)), 2, 220, 2)
note = $x < 0 ? Text("正向贡献合计为 $" + ($c + $i + $g) + "B。净进口扣除 $" + @Abs($x) + "B，最终产出为 $" + gdp + "B。", "sm", "warning") : null
sliders = Grid([Slider($c, 0, 1200, 10, "消费支出（十亿美元）"), Slider($i, 0, 600, 10, "企业投资（十亿美元）"), Slider($g, 0, 500, 10, "政府支出（十亿美元）"), Slider($x, -200, 300, 10, "净出口（十亿美元）")], 2, 240, 6)
quiz = Card([RadioGroup($answer, [{value: "a", label: "实际 GDP 增长 10%"}, {value: "b", label: "名义 GDP 上升，实际 GDP 不变"}, {value: "c", label: "两个指标都不变"}], "同样的商品今年贵了 10%，什么会发生变化？"), $answer == "" ? null : Text(($answer == "b" ? "**回答正确。** " : "**还不完全正确。") + "实际 GDP 会剔除价格变化，因此单纯涨价只会提高名义 GDP，不会提高实际产出。", "sm")], "soft", 4, 2)`;

const clt = `root = Card([head, SegmentedControl($dist, ["偏态分布", "均匀分布", "双峰分布"]), Grid([popCard, meanCard], 2, 260, 4), Slider($n, 1, 50, 1, "每个样本的数值数量"), buttons, stats, Text("随着样本量增大，即使总体分布偏斜，各样本的平均值也会围绕总体均值聚成钟形。", "sm", "muted"), quiz], null, 5, 4)
$dist = "偏态分布"
$n = 5
$means = []
$answer = ""
head = Col([Title("中心极限定理", "lg"), Text("总体各不相同，钟形规律相同。", "sm", "muted")], 1)
pop = @Each(@Range(0.0025, 1, 0.005), "u", $dist == "偏态分布" ? @Pow(u, 3) : $dist == "均匀分布" ? u : (u < 0.5 ? 0.05 + 0.4 * u : 0.55 + 0.4 * u))
current = @Filter(@Filter($means, "dist", "==", $dist), "n", "==", $n).mean
draw = @Each(@Range(0, 100), "s", {dist: $dist, n: $n, mean: @Avg(@Each(@Each(@Range(0, $n), "k", @Random(0, 1)), "u", $dist == "偏态分布" ? @Pow(u, 3) : $dist == "均匀分布" ? u : (u < 0.5 ? 0.05 + 0.4 * u : 0.55 + 0.4 * u)))})
popCard = Col([Title("总体", "sm"), Caption("抽样来源的数值"), Chart("bar", @Histogram(pop, 20, 0, 1), "key", ["value"], null, null, false, 150)], 1)
meanCard = Col([Title("样本均值", "sm"), Caption("每个样本包含 " + $n), @Count(current) == 0 ? Box([Text("抽取样本以查看分布", "sm", "muted")], null, null, 6, "surface", "lg", true, "100%", 150, null, "center", "center") : Chart("bar", @Histogram(current, 20, 0, 1), "key", ["value"], null, null, false, 150)], 1)
buttons = Row([Button("抽取 100 个样本", @Set($means, @Take(@Concat($means, draw), -6000)), "solid", null, null, "dices"), Button("抽取 500 个样本", Action([@Set($means, @Take(@Concat($means, draw), -6000)), @Set($means, @Take(@Concat($means, draw), -6000)), @Set($means, @Take(@Concat($means, draw), -6000)), @Set($means, @Take(@Concat($means, draw), -6000)), @Set($means, @Take(@Concat($means, draw), -6000))]), "outline"), Button("重置", @Reset($means), "ghost", null, null, "rotate-ccw")], 2, null, null, true)
stats = Grid([s1, s2, s3], 3, 140, 3)
s1 = Card([Caption("样本数"), Title(@Format(@Count(current)), "xl")], "soft", 3, 1)
s2 = Card([Caption("样本均值的平均数"), Title(@Count(current) == 0 ? "-" : @Format(@Stats(current).mean, "number", 3), "xl"), Caption("总体：" + @Format(@Stats(pop).mean, "number", 3))], "soft", 3, 1)
s3 = Card([Caption("样本均值的离散程度"), Title(@Count(current) == 0 ? "-" : @Format(@Stats(current).stdev, "number", 3), "xl"), Caption("理论值，σ/√n：" + @Format(@Stats(pop).stdev / @Sqrt($n), "number", 3))], "soft", 3, 1)
quiz = Card([RadioGroup($answer, [{value: "a", label: "总体变为正态分布"}, {value: "b", label: "样本均值形成更窄的钟形分布"}, {value: "c", label: "每个均值完全相同"}], "样本量增大时会发生什么？"), $answer == "" ? null : Text(($answer == "b" ? "**回答正确。** " : "**还不完全正确。") + "总体保持不变。样本均值更接近正态分布，离散程度按 1/√n 缩小。", "sm")], "soft", 4, 2)`;

const sales = `root = Col([head, kpis, Grid([trend, mix], 2, 300, 4), Grid([regions, top], 2, 300, 4)], 4)
$days = "90"
$channel = "全部"
$view = "每周"
orders = Query("get_orders", {days: $days}, {rows: []}, 300)
rows = $channel == "全部" ? orders.rows : @Filter(orders.rows, "channel", "==", $channel)
weekly = @Bucket(rows, "date", "week", "amount")
daily = @Bucket(rows, "date", "day", "amount")
last7 = @Sum(@Take(daily, -7).value)
prev7 = @Sum(@Slice(daily, -14, -7).value)
change = @Change(last7, prev7)
head = Row([Col([Title("商店经营情况", "lg"), Caption("演示数据，每 5 分钟刷新")], 1), Spacer(), Box([Select($channel, [{value: "全部", label: "全部渠道"}, "网页", "移动端", "线下门店"])], null, null, null, null, null, null, 150), SegmentedControl($days, [{value: "30", label: "30d"}, {value: "90", label: "90d"}, {value: "365", label: "1y"}])], 3, null, null, true)
kpis = Grid([k1, k2, k3, k4], 4, 150, 3)
k1 = Card([Caption("销售额"), Title(@Format(@Sum(rows.amount), "compact", 1, "USD"), "xl")], null, 3, 1)
k2 = Card([Caption("订单数"), Title(@Format(@Count(rows)), "xl")], null, 3, 1)
k3 = Card([Caption("平均订单金额"), Title(@Format(@Avg(rows.amount), "currency"), "xl")], null, 3, 1)
k4 = Card([Caption("最近 7 天"), Row([Title(@Format(last7, "compact", 1, "USD"), "xl"), change == null ? null : Badge((change >= 0 ? "+" : "") + @Format(change, "percent", 1) + "，对比前 7 天", change >= 0 ? "success" : "danger")], 2, null, null, true)], null, 3, 1)
trend = Card([Row([Title("销售额", "sm"), Spacer(), SegmentedControl($view, ["每周", "累计"])], 2), Chart("area", $view == "每周" ? weekly : @Cumulative(weekly, "value"), "key", ["value"], "currency")], null, 4, 2)
mix = Card([Title("渠道构成", "sm"), Chart("donut", @GroupBy(orders.rows, "channel", "amount"), "key", ["value"], "currency")], null, 4, 2)
regions = Card([Title("按地区和品类的销售额", "sm"), Chart("bar", @Pivot(rows, "region", "category", "amount"), "key", null, "currency", null, true)], null, 4, 2)
top = Card([Title("热销商品", "sm"), Table(["商品", "数量", "销售额"], @Each(@Top(@GroupBy(rows, "product", "amount"), "value", 5), "p", [p.key, @Sum(@Filter(rows, "product", "==", p.key).units), @Format(p.value, "currency", 0)]))], null, 4, 2)`;

const support = `root = Col([head, kpis, Grid([weekly, teams], 2, 300, 4), Grid([spread, csat], 2, 300, 4), queue], 4)
$days = "60"
$team = "全部"
tickets = Query("get_tickets", {days: $days}, {rows: []})
rows = $team == "全部" ? tickets.rows : @Filter(tickets.rows, "team", "==", $team)
solved = @Filter(rows, "status", "==", "已解决")
waiting = @Filter(rows, "status", "!=", "已解决")
hours = @Stats(solved.hours)
weeks = @Each(@Bucket(rows, "opened", "week"), "w", {week: @FormatDate(w.key, "short"), 新建: w.value, 已解决: @Count(@Between(solved, "opened", w.key, @AddDays(w.key, 6)))})
head = Row([Col([Title("客服中心", "lg"), Caption("所选时间段内创建的工单")], 1), Spacer(), Box([Select($team, [{value: "全部", label: "全部团队"}, "账单", "技术", "账户", "物流"])], null, null, null, null, null, null, 150), SegmentedControl($days, [{value: "30", label: "30d"}, {value: "60", label: "60d"}, {value: "180", label: "6m"}])], 3, null, null, true)
kpis = Grid([k1, k2, k3, k4], 4, 150, 3)
k1 = Card([Caption("已创建"), Title(@Format(@Count(rows)), "xl")], null, 3, 1)
k2 = Card([Caption("待处理"), Title(@Format(@Count(waiting)), "xl", @Count(waiting) > 40 ? "danger" : null), Caption(@Count(@Filter(waiting, "priority", "==", "紧急")) + " 紧急")], null, 3, 1)
k3 = Card([Caption("解决时长中位数"), Title(@Format(hours.median, "number", 1) + " h", "xl"), Caption("最慢 " + @Format(hours.max, "number", 0) + " h")], null, 3, 1)
k4 = Card([Caption("满意度"), Title(@Format(@Avg(@Filter(solved, "csat", ">", 0).csat), "number", 2) + " / 5", "xl")], null, 3, 1)
weekly = Card([Title("每周创建与解决数", "sm"), Chart("bar", weeks, "week", ["新建", "已解决"])], null, 4, 2)
teams = Card([Title("各团队平均解决时长", "sm"), Chart("bar", @Sort(@GroupBy(solved, "team", "hours", "avg"), "value", "desc"), "key", ["value"])], null, 4, 2)
spread = Card([Title("工单处理时长（小时）", "sm"), Chart("bar", @Histogram(solved.hours, 12), "key", ["value"])], null, 4, 2)
csat = Card([Title("满意度（7 日平均）", "sm"), Chart("line", @MovingAvg(@Bucket(@Filter(solved, "csat", ">", 0), "opened", "day", "csat", "avg"), "value", 7), "key", ["value"])], null, 4, 2)
queue = Card([Title("等待时间最长", "sm"), Table(["工单", "团队", "优先级", "待处理"], @Each(@Top(@Each(waiting, "t", {id: t.id, team: t.team, priority: t.priority, age: @DaysBetween(t.opened, @Now())}), "age", 6), "t", [t.id, t.team, Badge(t.priority, t.priority == "紧急" ? "danger" : t.priority == "高" ? "warning" : "neutral"), @Plural(t.age, "天")]))], null, 4, 2)`;

const bicycle = `root = Col([head, photos, Title("主要部件", "md"), parts, Title("动力如何传到车轮", "md"), flow, explorer, Title("旋式飞轮还是卡式飞轮？", "md"), hubs, closing])
$gear = 3
$rpm = 80
head = Col([Title("7 速自行车的内部结构", "xl"), Text("前方有一个牙盘，后方有七个飞轮片，后拨会在它们之间移动链条。小飞轮让每次踩踏前进更远，大飞轮让爬坡更轻松。", "md", "muted")], 2)
photos = Grid([SearchImage("City bicycle", 1.3, "lg"), SearchImage("Derailleur", 1.3, "lg"), SearchImage("Bicycle shifter", 1.3, "lg")], 3, 150, 2)
parts = Table(["部件", "作用"], [["车架和前叉", "连接整车、控制方向并确定骑行姿势"], ["曲柄组和脚踏", "把腿部力量转成旋转"], ["牙盘", "前方唯一齿轮，本例为 40 齿"], ["链条", "将动力传到后轮"], ["7 个后飞轮片", "七种尺寸，对应七种齿比"], ["后拨", "在飞轮片之间移动链条"], ["变速器和线管", "拉紧或放松线管来选择档位"], ["刹车、车轮和轮胎", "负责制动、滚动和抓地"]])
flow = Card([Row(@Each(chain, "s", Row([Box([Text(s, "sm", null, "medium")], null, null, 2, "surface", "md"), s == "后轮" ? null : Icon("arrow-right", "sm", "faint")], 1)), 1, "center", "center", true), Caption("变速器拉动线管，后拨将链条引导到你选择的飞轮片上。")], "soft", 3, 2)
chain = ["脚踏", "牙盘", "链条", "后飞轮片", "后轮"]
teeth = [28, 24, 21, 18, 16, 14, 12]
tooth = teeth[$gear - 1]
ratio = 40 / tooth
speed = $rpm * ratio * 2.1 * 60 / 1000
mode = $gear <= 2 ? "轻松，适合爬坡" : $gear <= 5 ? "适中，适合巡航" : "费力，适合高速"
explorer = Card([exHead, cogs, Slider($gear, 1, 7, 1, "档位", null, [{value: 1, label: "1 · 轻松"}, {value: 4, label: "4"}, {value: 7, label: "7 · 快速"}]), stats, Slider($rpm, 50, 110, 5, "踩踏频率", " rpm"), Text(feel, "sm"), Caption("假设牙盘 40 齿、飞轮 12–28 齿、700c 车轮（周长 2.1 米）。实际自行车会有所不同。")], null, 4, 3)
exHead = Row([Col([Label("探索七个档位"), Title("第 " + $gear + " 档，共 7 档", "xl")], 1), Spacer(), Badge(mode, $gear <= 2 ? "success" : $gear <= 5 ? "info" : "warning")], 3, null, null, true)
cogs = Svg(@Each(@Range(0, 7), "i", G([Circle(26 + i * 45, 52, 6 + teeth[i] * 0.55, i == $gear - 1 ? "info" : "surface", i == $gear - 1 ? "info" : "faint", 2, i == $gear - 1 ? 0.85 : 1), Circle(26 + i * 45, 52, 4, "muted"), SvgText(teeth[i] + "T", 26 + i * 45, 104, 11, i == $gear - 1 ? "info" : "muted", "middle", i == $gear - 1 ? "semibold" : "normal")])), "0 0 320 112")
stats = Grid([s1, s2, s3], 3, 90, 2)
s1 = Card([Caption("后飞轮片"), Title(tooth + " 齿", "lg")], "soft", 3, 1)
s2 = Card([Caption("齿比"), Title(@Format(ratio, "number", 2) + " : 1", "lg")], "soft", 3, 1)
s3 = Card([Caption("速度（" + $rpm + " rpm"), Title(@Format(speed, "number", 1) + " km/h", "lg")], "soft", 3, 1)
feel = "每踩一圈，后轮转动 " + @Format(ratio, "number", 2) + " 圈。" + ($gear <= 2 ? "踩踏轻松，适合爬坡和起步。" : $gear <= 5 ? "力度均衡，适合平路和日常骑行。" : "踩踏较重但速度快，适合下坡和顺风。")
hubs = Col([SearchImage("自行车卡式飞轮", 2.4, "lg"), Grid([h1, h2], 2, 220, 3)], 3)
h1 = Card([Text("旋式飞轮", "sm", null, "semibold"), Caption("棘轮位于飞轮组内部，飞轮组旋入花鼓，常见于入门和青少年自行车。")], "soft", 3, 1)
h2 = Card([Text("卡式飞轮", "sm", null, "semibold"), Caption("飞轮片套在带棘轮的塔基上，轴承支撑更好，也更容易更换档位。")], "soft", 3, 1)
closing = Text("七速传动系统简单、轻便且易维护：一个变速器、一个后拨，无需考虑前方换档。", "sm", "muted")`;

const bikeRepair = `root = Col([head, meta, setup, tools, Title("组装步骤", "md"), progress, checklist, Title("图示参考", "md"), refs, fit, safety])
$done = []
$brakes = "轮圈刹车"
$inseam = 56
head = Col([Title("组装青少年自行车", "xl"), Text("大多数青少年自行车到货时已完成约 85% 的组装。安装车把、前轮、脚踏和坐垫，再调好刹车。每完成一步就点击勾选。", "md", "muted")], 2)
meta = Row([Badge("45 至 90 分钟", "info"), Badge("适合初学者", "success"), Badge("成人操作，孩子协助", "purple")], 2, null, null, true)
setup = Row([Label("刹车类型"), SegmentedControl($brakes, ["轮圈刹车", "碟刹", "脚刹"])], 3, null, null, true)
tools = Card([Label("所需工具"), List(["4、5、6 毫米内六角扳手", "15 毫米脚踏扳手", "十字螺丝刀", "带压力表的打气筒", "剪扎带用的剪刀"])], "soft", 3, 2)
stepList = [{title: "拆箱检查", detail: "剪开扎带并拆除包装，摆好前轮、标有 L 和 R 的脚踏、坐垫和反光片。"}, {title: "安装车把", detail: "装好把立，让车把与前轮对齐，再逐步均匀拧紧螺栓。"}, {title: "安装前轮", detail: "将车轴完全装入前叉，扣好快拆或拧紧两侧轴螺母。转动前轮，确认运转平直。"}, {title: "安装脚踏", detail: "右脚踏顺时针拧入，左脚踏逆时针拧入。先用手旋入，再用 15 毫米扳手拧紧。"}, {title: "设置坐垫高度", detail: "座管至少插到最低插入线，调整到下方计算的高度并拧紧夹具。"}, {title: brakeTitle, detail: brakeDetail}, {title: "给轮胎充气", detail: "充到胎侧标注的压力，并检查胎唇四周是否均匀就位。"}, {title: "最终安全检查", detail: "检查所有螺栓，装好反光片和车铃，并以步行速度测试刹车。"}]
brakeTitle = $brakes == "脚刹" ? "检查脚刹" : $brakes == "碟刹" ? "居中调整碟刹" : "设置轮圈刹车"
brakeDetail = $brakes == "轮圈刹车" ? "将线管弯头挂入 V 刹夹臂，让刹车皮对准轮圈而不是轮胎。刹车手柄碰到车把前，车轮应能锁止。" : $brakes == "碟刹" ? "转动车轮：碟片应能无摩擦地通过卡钳。如有摩擦，先松开卡钳螺栓，捏住刹车后再拧紧。" : "向后踩脚踏：后轮应锁止。确认刹车臂已固定在车架连接片上。"
progress = Col([Row([Text(@Count($done) + " / " + @Count(stepList) + " 步已完成", "sm", "muted"), Spacer(), @Count($done) == @Count(stepList) ? Badge("可以骑行", "success") : Button("重置", @Reset($done), "ghost", null, "sm", "rotate-ccw")], 2), Box([Box([], null, null, null, "chart2", "full", null, @Percent(@Count($done), @Count(stepList)) + "%", 6)], null, null, null, "border", "full", null, "100%", 6)], 2)
checklist = Col(@Each(@Range(0, @Count(stepList)), "i", Pressable([Row([Icon(@Includes($done, i) ? "check-circle" : "circle", "md", @Includes($done, i) ? "success" : "faint"), Col([Text((i + 1) + ". " + stepList[i].title, "sm", null, "semibold", false, @Includes($done, i)), Caption(stepList[i].detail)], 1)], 3, "start")], @Set($done, @Toggle($done, i)), @Includes($done, i), 3)), 1)
refs = Grid([r1, r2, r3, r4], 2, 160, 3)
r1 = Col([SearchImage("自行车轮快拆", 1.4, "lg"), Caption("前轮已装入前叉")], 1)
r2 = Col([SearchImage("Bicycle pedal", 1.4, "lg"), Caption("脚踏：右侧顺时针，左侧逆时针")], 1)
r3 = Col([SearchImage("V-brake", 1.4, "lg"), Caption("刹车皮与轮圈平行贴合")], 1)
r4 = Col([SearchImage("Seatpost", 1.4, "lg"), Caption("不得超过最低插入线")], 1)
fit = Card([Title("坐垫高度", "sm"), Input($inseam, "孩子的内侧腿长（厘米）", "number"), Text($inseam > 0 ? "先将坐垫顶部设在约 **" + @Round($inseam - 2) + " cm**，让双脚能平放在地面。熟练骑行后，再提高到约 **" + @Round($inseam + 3) + " cm**，此时只有前脚掌接触地面。" : "穿袜子背靠墙站立，从地面量到裆部。", "sm")], "soft", 4, 2)
safety = Box([Row([Icon("shield-check", "md", "success"), Text("首次骑行前：确认刹车能让自行车停下、两个车轮固定牢靠、车把不会相对前轮扭转，并且头盔贴合。", "sm")], 2, "start")], null, null, 3, "success", "lg")`;

const route = `root = Col([head, photos, badges, map, selected, Row([Title("逐站游览", "md"), Spacer(), SegmentedControl($pace, ["悠闲", "适中", "紧凑"])], 3, null, null, true), itinerary, closing])
$stop = "Ferry Building"
$pace = "适中"
head = Col([Title("旧金山一日游", "xl"), Text("从海滨到金门大桥的风景环线，留出用餐、步行和拍照时间。点击地图标记或站点查看详情。", "md", "muted")], 2)
photos = Grid([SearchImage("金门大桥", 1.4, "lg"), SearchImage("阿拉莫广场彩绘女士", 1.4, "lg"), SearchImage("旧金山缆车", 1.4, "lg")], 3, 140, 2)
badges = Row([Badge(@Plural(@Count(places), "个站点"), "info"), Badge("约 " + @Format(@Last(ends).mins / 60, "number", 1) + " 小时", "neutral"), Badge("步行、缆车和公交", "purple")], 2, null, null, true)
map = Map(@Each(places, "p", MapMarker(p.name, p.lat, p.lng, p.category)), true, $stop, 340)
factor = $pace == "悠闲" ? 1.3 : $pace == "紧凑" ? 0.75 : 1
plan = @Each(places, "p", {name: p.name, mins: @Round(p.minutes * factor / 5) * 5 + 20})
ends = @Cumulative(plan, "mins")
starts = @Each(@Range(0, @Count(places)), "i", 540 + ends[i].mins - plan[i].mins)
rows = @Each(@Range(0, @Count(places)), "i", {name: places[i].name, desc: places[i].desc, category: places[i].category, stay: @Round(places[i].minutes * factor / 5) * 5, time: (@Floor(starts[i] / 60) > 12 ? @Floor(starts[i] / 60) - 12 : @Floor(starts[i] / 60)) + ":" + @Pad(starts[i] % 60, 2) + (starts[i] >= 720 ? " PM" : " AM")})
sel = @Find(rows, "name", $stop)
selected = sel == null ? null : Card([Row([Icon("map-pin", "md", "info"), Col([Text(sel.name, "md", null, "semibold"), Caption(sel.time + " · " + sel.stay + " 分钟 · " + sel.category)], 0), Spacer(), Button("路线", @OpenUrl("https://www.google.com/maps/search/?api=1&query=" + sel.name + " 旧金山"), "outline", null, "sm", "navigation")], 3, null, null, true), Text(sel.desc, "sm")], "soft", 3, 2)
itinerary = Col(@Each(rows, "r", Pressable([Row([Box([SearchImage(r.name + " 旧金山", 1, "md")], null, null, null, null, "md", null, 64, 64), Col([Row([Text(r.time, "sm", "info", "semibold", false, false, true), Caption(r.stay + " 分钟")], 2), Text(r.name, "sm", null, "semibold"), Caption(r.desc)], 0)], 3)], @Set($stop, r.name), r.name == $stop, 2)), 1)
closing = Col([Text("时间为估算值，并包含前往下一站约 20 分钟。缆车约每 10 分钟一班，Muni 一日通票可乘坐缆车和公交。", "xs", "muted"), Row([Button("规划第二天", @ToAssistant("规划避开这些站点的旧金山第二天行程"), "outline", null, "sm", "calendar-plus")])], 2)
places = [{name: "Ferry Building", lat: 37.7955, lng: -122.3937, category: "餐饮", minutes: 45, desc: "在海湾边的 1898 年市场大厅享用咖啡和糕点。"}, {name: "Coit Tower", lat: 37.8024, lng: -122.4058, category: "景观", minutes: 45, desc: "登上电报山，欣赏大萧条时期壁画和 360° 全景。"}, {name: "Lombard Street", lat: 37.8021, lng: -122.4187, category: "地标", minutes: 30, desc: "沿着曲折的砖路漫步，欣赏绣球花。"}, {name: "渔人码头", lat: 37.808, lng: -122.4177, category: "餐饮", minutes: 60, desc: "在 39 号码头看海狮，在酸面包碗里品尝蛤蜊浓汤。"}, {name: "艺术宫", lat: 37.8029, lng: -122.4484, category: "地标", minutes: 40, desc: "罗马风格的圆形大厅倒映在宁静的泻湖中。"}, {name: "金门大桥", lat: 37.8077, lng: -122.4752, category: "景观", minutes: 75, desc: "走到第一座塔，回望城市经典景色。"}, {name: "金门公园", lat: 37.7694, lng: -122.4862, category: "公园", minutes: 60, desc: "日本茶园和花卉温室。"}, {name: "Alamo Square", lat: 37.7764, lng: -122.4346, category: "景观", minutes: 30, desc: "以彩绘女士和日落时分的城市天际线收尾。"}]`;

const roadtrip = `root = Col([head, photos, badges, map, Title("逐日行程", "md"), days, budget, before, ask])
$stop = "Seattle"
$tier = "舒适型"
$travelers = 2
head = Col([Title("太平洋西北地区十日自驾", "xl"), Text("从西雅图出发，环游雨林、野海滩、哥伦比亚河峡谷和火山。点击日期可在地图上查看站点。", "md", "muted")], 2)
photos = Grid([SearchImage("天堂区雷尼尔山", 1.4, "lg"), SearchImage("Hoh Rain Forest", 1.4, "lg"), SearchImage("坎农海滩干草堆岩", 1.4, "lg")], 3, 140, 2)
badges = Row([Badge("最佳出行时间：7 月至 9 月", "info"), Badge("约 1,150 英里", "neutral"), Badge("9 晚", "purple")], 2, null, null, true)
map = Map(@Each(stops, "s", MapMarker(s.name, s.lat, s.lng, s.kind)), true, $stop, 360)
stops = [{name: "Seattle", lat: 47.6062, lng: -122.3321, kind: "城市"}, {name: "Port Angeles", lat: 48.1181, lng: -123.4307, kind: "小镇"}, {name: "Hoh Rain Forest", lat: 47.8601, lng: -123.9348, kind: "自然景观"}, {name: "Ruby Beach", lat: 47.7107, lng: -124.4152, kind: "自然景观"}, {name: "Astoria", lat: 46.1879, lng: -123.8313, kind: "小镇"}, {name: "Cannon Beach", lat: 45.8918, lng: -123.9615, kind: "自然景观"}, {name: "Portland", lat: 45.5152, lng: -122.6784, kind: "城市"}, {name: "Multnomah Falls", lat: 45.5762, lng: -122.1158, kind: "自然景观"}, {name: "Mount Rainier", lat: 46.786, lng: -121.7353, kind: "自然景观"}]
plan = [{day: 1, title: "Seattle", place: "Seattle", drive: "抵达", night: "Seattle", text: "逛派克市场和海滨，黄昏时前往太空针塔。"}, {day: 2, title: "乘渡轮前往奥林匹克半岛", place: "Port Angeles", drive: "含渡轮约 2.5 小时", night: "Port Angeles", text: "乘坐埃德蒙兹渡轮，再开车前往飓风岭欣赏山景。"}, {day: 3, title: "Hoh Rain Forest", place: "Hoh Rain Forest", drive: "2 h", night: "Forks", text: "漫步苔藓厅，看枫树披满苔藓；途中停靠新月湖。"}, {day: 4, title: "荒野海岸", place: "Ruby Beach", drive: "1 h", night: "Kalaloch", text: "在红宝石海滩和里亚尔托海滩欣赏海蚀柱、漂流木和潮池。"}, {day: 5, title: "向南前往阿斯托里亚", place: "Astoria", drive: "3.5 h", night: "Astoria", text: "在哥伦比亚河入海口过河，再登上阿斯托里亚纪念柱。"}, {day: 6, title: "Cannon Beach", place: "Cannon Beach", drive: "40 min", night: "Cannon Beach", text: "退潮时看干草堆岩，再走一段埃科拉州立公园步道。"}, {day: 7, title: "Portland", place: "Portland", drive: "1.5 h", night: "Portland", text: "逛餐车、鲍威尔书店和日本花园。"}, {day: 8, title: "哥伦比亚河峡谷", place: "Multnomah Falls", drive: "1 h each way", night: "Portland", text: "游览马特诺玛瀑布和瀑布走廊；出发前确认是否需要预约时段。"}, {day: 9, title: "Mount Rainier", place: "Mount Rainier", drive: "3.5 h", night: "Ashford", text: "在天堂区的天际线步道欣赏野花草甸和冰川景色。"}, {day: 10, title: "Back to Seattle", place: "Seattle", drive: "2.5 h", night: "", text: "最后一个早晨安排徒步，然后回西雅图还车。"}]
days = Col(@Each(plan, "d", Pressable([Row([Box([Title(d.day + "", "md")], null, null, 2, d.place == $stop ? "info" : "surface", "md", null, 44, 44, null, "center", "center"), Col([Text(d.title, "sm", null, "semibold"), Caption(d.night == "" ? d.drive : d.drive + " · 夜宿 " + d.night), Text(d.text, "sm", "muted")], 0)], 3, "start")], @Set($stop, d.place), d.place == $stop, 2)), 1)
tiers = [{name: "经济型", lodging: 115, car: 45, food: 40}, {name: "舒适型", lodging: 190, car: 60, food: 65}, {name: "豪华型", lodging: 320, car: 90, food: 110}]
t = @Find(tiers, "name", $tier)
rooms = @Ceil($travelers / 2)
costs = [{item: "住宿", amount: t.lodging * 9 * rooms}, {item: "租车", amount: t.car * 10}, {item: "汽油", amount: @Round(1150 / 27 * 4.6)}, {item: "餐饮", amount: t.food * 10 * $travelers}, {item: "公园通票", amount: 80}, {item: "渡轮及其他", amount: 250}]
total = @Sum(costs.amount)
budget = Card([Row([Title("预算估算", "md"), Spacer(), SegmentedControl($tier, ["经济型", "舒适型", "豪华型"])], 3, null, null, true), Row([Text("出行人数", "sm"), Spacer(), IconButton("minus", @Set($travelers, @Clamp($travelers - 1, 1, 6)), "减少出行人数"), Text($travelers + "", "md", null, "semibold", false, false, true), IconButton("plus", @Set($travelers, @Clamp($travelers + 1, 1, 6)), "增加出行人数")], 2), Grid([k1, k2], 2, 150, 3), Chart("bar", costs, "item", ["amount"], "currency", null, false, 200), Caption("9 晚夏季价格，" + @Plural(rooms, "间房") + "，含一辆租车。此预算仅供参考。")], null, 4, 3)
k1 = Card([Caption("行程总计"), Title(@Format(total, "currency", 0), "xl")], "soft", 3, 1)
k2 = Card([Caption("人均费用"), Title(@Format(total / $travelers, "currency", 0), "xl")], "soft", 3, 1)
before = Card([Title("出发前", "sm"), List(["夏季出行，建议提前数月预订奥林匹克和雷尼尔山附近的旅馆。", "旅游旺季游览马特诺玛瀑布可能需要预约入场时段。", "出发前一周查看野火封闭信息和空气质量。", "购买 America the Beautiful 通票可覆盖这两座国家公园。"])], "soft", 4, 2)
ask = Row([Button("用一天行程换成圣胡安群岛", @ToAssistant("将这趟太平洋西北自驾中的一天改为游览圣胡安群岛"), "outline", null, "sm", "ship")])`;

const room = `root = Col([head, preview, Title("介绍一下你的房间", "md"), quiz, Title("最适合你的颜色", "md"), matches, Title("全部六种颜色", "md"), swatches, tip])
$mood = "平静"
$light = "北向"
$sofa = "灰色"
$pick = "暖象牙白"
head = Col([Title("为客厅挑选颜色", "xl"), Text("回答三个问题后，推荐结果会自动更新。点击任意颜色，预览房间效果。", "md", "muted")], 2)
colors = [{name: "暖象牙白", hex: "#EFE6D3", note: "柔和明亮，不显生硬", moods: ["平静", "明亮"], lights: ["北向", "弱光"], sofas: ["灰色", "蓝色", "绿色", "棕色"]}, {name: "鼠尾草绿", hex: "#B5BFA1", note: "沉稳宁静", moods: ["平静", "温馨"], lights: ["南向", "东西向"], sofas: ["灰色", "棕色", "白色"]}, {name: "灰米色", hex: "#CFC5B8", note: "百搭的暖调中性色", moods: ["平静", "明亮"], lights: ["北向", "南向", "东西向", "弱光"], sofas: ["灰色", "蓝色", "绿色", "棕色", "白色"]}, {name: "灰蓝色", hex: "#9DB0BF", note: "清爽冷调", moods: ["平静", "明亮"], lights: ["南向", "东西向"], sofas: ["白色", "棕色", "灰色"]}, {name: "陶土色", hex: "#C9785A", note: "温暖而有个性", moods: ["温馨", "大胆"], lights: ["北向", "弱光", "东西向"], sofas: ["白色", "绿色", "蓝色"]}, {name: "深海军蓝", hex: "#2F3E55", note: "浓郁且富有包裹感", moods: ["大胆", "温馨"], lights: ["南向", "东西向"], sofas: ["白色", "棕色", "绿色"]}]
scored = @Each(colors, "c", {name: c.name, hex: c.hex, note: c.note, score: (@Includes(c.moods, $mood) ? 2 : 0) + (@Includes(c.lights, $light) ? 2 : 0) + (@Includes(c.sofas, $sofa) ? 1 : 0)})
best = @Take(@Sort(scored, "score", "desc"), 3)
picked = @Find(colors, "name", $pick)
sofaHex = $sofa == "灰色" ? "#8D9197" : $sofa == "蓝色" ? "#3F5A7A" : $sofa == "绿色" ? "#4F6B52" : $sofa == "棕色" ? "#7A5236" : "#EFEEEA"
tint = $light == "北向" ? "#9EC5FF" : $light == "南向" ? "#FFC870" : $light == "东西向" ? "#FFE6B0" : "#000000"
tintOpacity = $light == "北向" ? 0.14 : $light == "南向" ? 0.16 : $light == "东西向" ? 0.08 : 0.22
lightNote = $light == "北向" ? "北向光线偏冷：暖色依然显得温暖" : $light == "南向" ? "南向阳光较暖：冷色能保持清新" : $light == "东西向" ? "颜色会随早晚光线变化" : "弱光会加深所有颜色"
room = Svg([Rect(0, 0, 320, 132, picked.hex), Rect(0, 132, 320, 48, "#B08D6A"), Rect(0, 128, 320, 6, "#E9E4DA"), Rect(28, 24, 70, 76, "#DCE9F5", "#FFFFFF", 5), Line(63, 24, 63, 100, "#FFFFFF", 4), Line(28, 62, 98, 62, "#FFFFFF", 4), Rect(196, 30, 70, 44, "#F4F1EA", "#8A7A66", 3), Circle(214, 52, 9, "#C9785A", null, null, 0.7), Circle(238, 48, 12, "#9DB0BF", null, null, 0.7), Rect(150, 98, 150, 40, sofaHex, null, null, 1, 10), Rect(160, 84, 62, 26, sofaHex, null, null, 1, 8), Rect(228, 84, 62, 26, sofaHex, null, null, 1, 8), Rect(144, 104, 16, 34, sofaHex, null, null, 1, 6), Rect(290, 104, 16, 34, sofaHex, null, null, 1, 6), Rect(0, 0, 320, 180, tint, null, null, tintOpacity)], "0 0 320 180")
preview = Card([room, Row([Box([], null, null, null, picked.hex, "full", true, 18, 18), Text(picked.name, "sm", null, "semibold"), Spacer(), Caption(lightNote)], 2, null, null, true)], null, 3, 2)
quiz = Grid([RadioGroup($mood, [{value: "平静", label: "平静放松"}, {value: "温馨", label: "温馨舒适"}, {value: "明亮", label: "明亮通透"}, {value: "大胆", label: "大胆醒目"}], "你希望房间给人什么感觉？"), RadioGroup($light, [{value: "北向", label: "朝北，光线偏冷"}, {value: "南向", label: "朝南，阳光充足"}, {value: "东西向", label: "朝东或朝西，光线会变化"}, {value: "弱光", label: "日照较少"}], "房间的采光如何？"), RadioGroup($sofa, [{value: "灰色", label: "灰色"}, {value: "蓝色", label: "蓝色"}, {value: "绿色", label: "绿色"}, {value: "棕色", label: "棕色皮革"}, {value: "白色", label: "白色或奶油色"}], "你的沙发颜色")], 3, 200, 4)
matches = Grid(@Each(best, "c", Pressable([Box([], null, null, null, c.hex, "md", true, "100%", 64), Text(c.name, "sm", null, "semibold"), Caption(c.note), Badge(c.score >= 4 ? "很匹配" : c.score >= 2 ? "比较匹配" : "可以考虑", c.score >= 4 ? "success" : c.score >= 2 ? "info" : "neutral")], @Set($pick, c.name), c.name == $pick, 2)), 3, 150, 3)
swatches = Row(@Each(colors, "c", Pressable([Col([Box([], null, null, null, c.hex, "full", true, 40, 40), Caption(c.name)], 1, "center")], @Set($pick, c.name), c.name == $pick, 2)), 2, null, null, true)
tip = Text("色卡颜色上墙后可能不同。正式涂刷前，先在两面墙上试涂较大面积，并分别在早晚观察效果。", "sm", "muted")`;

const origami = `root = Col([head, viewer, Title("全部六步", "md"), strip, tip])
$step = 0
head = Col([Title("折一只狐狸折纸", "xl"), Text("用一张正方形纸折出简单的狐狸脸：无需剪裁，约 5 分钟完成。橙色一面配白色背面效果最好。", "md", "muted"), Row([Badge("适合初学者", "success"), Badge("约 5 分钟", "info"), Badge("一张正方形纸", "neutral")], 2, null, null, true)], 2)
steps = [{title: "先将纸摆成菱形", text: "白色面朝上，将正方形纸的一角对着自己。"}, {title: "对折纸张", text: "将上角向下对齐底角，折成三角形并压实折痕。"}, {title: "将两侧角折向底角", text: "将左右两角向下折到最底端，形成一个小菱形。"}, {title: "折出耳朵", text: "将两侧翻片的底角向上、向外折过顶边，形成耳朵。"}, {title: "折出额头", text: "将顶部尖角稍微向下折，形成平坦的额头。"}, {title: "翻面并画出脸", text: "将纸翻面，在底部尖角附近画上眼睛和鼻子。"}]
o = "#F28C38"
w = "#FBE6D2"
e = "#B85E1C"
d0 = Svg([Polygon("100,20 180,100 100,180 20,100", w, e, 2), Line(20, 100, 180, 100, e, 1.5, 0.5), Line(100, 34, 100, 156, e, 2, 0.8), Polygon("93,150 107,150 100,164", e)], "0 0 200 200")
d1 = Svg([Polygon("20,100 180,100 100,180", o, e, 2), Line(100, 100, 100, 180, e, 1.5, 0.5)], "0 0 200 200")
d2 = Svg([Polygon("100,100 60,140 100,180 140,140", w, e, 2), Line(100, 100, 100, 180, e, 1.5)], "0 0 200 200")
d3 = Svg([Polygon("60,140 100,100 140,140 100,180", o, e, 2), Polygon("62,138 98,124 70,58", w, e, 2), Polygon("138,138 102,124 130,58", w, e, 2)], "0 0 200 200")
d4 = Svg([Polygon("60,140 80,118 120,118 140,140 100,180", o, e, 2), Polygon("62,138 98,124 70,58", w, e, 2), Polygon("138,138 102,124 130,58", w, e, 2), Polygon("80,118 120,118 100,136", w, e, 1.5)], "0 0 200 200")
d5 = Svg([Polygon("60,140 80,118 120,118 140,140 100,180", o, e, 2), Polygon("62,138 98,124 70,58", o, e, 2), Polygon("138,138 102,124 130,58", o, e, 2), Polygon("70,124 88,122 74,82", w), Polygon("130,124 112,122 126,82", w), Circle(86, 142, 4.5, "#2B2B2B"), Circle(114, 142, 4.5, "#2B2B2B"), Circle(100, 168, 5, "#2B2B2B")], "0 0 200 200")
drawings = [d0, d1, d2, d3, d4, d5]
viewer = Card([Row([Badge("第 " + ($step + 1) + " 步，共 6 步", "info"), Spacer(), Caption(@Percent($step + 1, 6) + "% 已折")], 2), Box([drawings[$step]], null, null, 3, "surface", "lg", null, "100%", null, null, "center", "center"), Title(steps[$step].title, "md"), Text(steps[$step].text, "sm"), Box([Box([], null, null, null, "chart1", "full", null, @Percent($step + 1, 6) + "%", 4)], null, null, null, "border", "full", null, "100%", 4), Row([Button("上一步", @Set($step, @Clamp($step - 1, 0, 5)), "outline", null, null, "arrow-left", $step == 0), Spacer(), $step < 5 ? Button("下一步", @Set($step, $step + 1), "solid", null, null, "arrow-right") : Button("重新开始", @Set($step, 0), "solid", null, null, "rotate-ccw")], 2)], null, 4, 3)
strip = Grid(@Each(@Range(0, 6), "i", Pressable([drawings[i], Caption((i + 1) + ". " + steps[i].title)], @Set($step, i), i == $step, 2)), 6, 96, 2)
tip = Row([Icon("lightbulb", "sm", "warning"), Text("折痕压得清晰，作品才会更好看：每次继续折之前，用指甲压实折痕。", "sm", "muted")], 2)`;

const garden = `root = Col([head, size, Title("选择种植作物", "md"), picker, sunNote, Title("逐格规划种植床", "md"), bed, Caption("每格宽 1 英尺，数字表示该格可种植的株数。"), Title("种植摘要", "md"), summary, Title("所需物品", "md"), needs])
$w = 4
$l = 6
$sun = 7
$chosen = ["番茄", "生菜", "豆类", "萝卜", "罗勒", "胡萝卜"]
$got = []
head = Col([Title("规划一座小菜园", "xl"), Text("设置种植床尺寸和日照时长，选好作物后，方格种植方案会自动生成。", "md", "muted")], 2)
crops = [{name: "番茄", icon: "🍅", per: 1, weeks: 10, sun: 8, color: "#F6D5CF"}, {name: "甜椒", icon: "🌶️", per: 1, weeks: 11, sun: 8, color: "#F7DCC4"}, {name: "豆类", icon: "🌱", per: 9, weeks: 8, sun: 6, color: "#DCEBD0"}, {name: "生菜", icon: "🥬", per: 4, weeks: 6, sun: 4, color: "#E2F0D3"}, {name: "菠菜", icon: "🍃", per: 9, weeks: 6, sun: 4, color: "#D5EAD6"}, {name: "胡萝卜", icon: "🥕", per: 16, weeks: 10, sun: 6, color: "#FBE2C9"}, {name: "萝卜", icon: "🔴", per: 16, weeks: 4, sun: 4, color: "#F8D9E2"}, {name: "罗勒", icon: "🌿", per: 4, weeks: 8, sun: 6, color: "#D8ECCF"}]
picked = @Each($chosen, "n", @Find(crops, "name", n))
cells = @Count(picked) == 0 ? [] : @Each(@Range(0, $w * $l), "i", picked[i % @Count(picked)])
size = Card([Grid([Slider($w, 2, 8, 1, "种植床宽度", " 英尺"), Slider($l, 2, 12, 1, "种植床长度", " 英尺"), Slider($sun, 2, 12, 1, "直射日照", " 小时")], 3, 200, 5), Row([Badge(@Plural($w * $l, "平方英尺"), "info"), Badge("约 " + @Plural(@Ceil($w * $l * 0.83 / 1.5), "袋土") + "（土层深 10 英寸）", "neutral")], 2, null, null, true)], "soft", 4, 3)
picker = Row(@Each(crops, "c", Pressable([Row([Text(c.icon, "md"), Text(c.name, "sm", null, "medium")], 1)], @Set($chosen, @Toggle($chosen, c.name)), @Includes($chosen, c.name), 2, null, "full")), 2, null, null, true)
shady = @Filter(picked, "sun", ">", $sun)
sunNote = @Count(shady) > 0 ? Box([Text("日照 " + $sun + " 小时时，" + @Join(shady, "、", "name") + " 可能生长困难；叶菜和萝卜在 4 小时日照下也能生长。", "sm", "warning")], null, null, 3, "warning", "lg") : Box([Text(@Count(picked) == 0 ? "至少选择一种作物以查看种植方案。" : "你选择的作物都能获得足够日照。", "sm", @Count(picked) == 0 ? "muted" : "success")], null, null, 3, @Count(picked) == 0 ? "surface" : "success", "lg")
bed = Box([Grid(@Each(cells, "c", Box([Text(c.icon, "lg"), Caption(c.per + "")], null, 0, 1, c.color, "sm", null, null, 56, null, "center", "center")), $w, null, 1)], null, null, 2, "#8B6A4E", "lg")
summary = Table(["作物", "格数", "株数", "首次收获", "日照"], @Each(picked, "p", [p.icon + " " + p.name, @Count(@Filter(cells, "name", "==", p.name)), @Count(@Filter(cells, "name", "==", p.name)) * p.per, p.weeks + " 周", p.sun + "+ 小时"]))
items = ["高架种植床或翻整好的土地", "富含堆肥的土壤", "种子或幼苗", "覆盖物", "洒水壶或滴灌软管", "支柱或攀爬架"]
needs = Card([Row([Text(@Count($got) + " / " + @Count(items) + " 项准备就绪", "sm", "muted"), Spacer(), Button("重置", @Reset($got), "ghost", null, "sm", "rotate-ccw")], 2), Col(@Each(items, "it", Pressable([Row([Icon(@Includes($got, it) ? "check-circle" : "circle", "sm", @Includes($got, it) ? "success" : "faint"), Text(it, "sm", null, null, false, @Includes($got, it))], 2)], @Set($got, @Toggle($got, it)), @Includes($got, it), 2)), 1)], null, 4, 2)`;

const wardrobe = `root = Col([head, photos, setup, Title("配色方案", "md"), palette, Title("行李清单", "md"), packing, Title("逐日穿搭", "md"), outfits, tip])
$days = 7
$weather = "温和"
$packed = []
head = Col([Title("一周旅行胶囊衣橱", "xl"), Text("用一组配色协调的约 12 件衣物搭配出多套穿搭。调整行程，清单和每日搭配也会随之变化。", "md", "muted")], 2)
photos = Grid([SearchImage("Folded clothes", 1.2, "lg"), SearchImage("胶囊衣橱", 1.2, "lg"), SearchImage("Suitcase", 1.2, "lg")], 3, 140, 2)
setup = Card([Grid([Slider($days, 3, 14, 1, "旅行天数", " 天"), Col([Label("天气"), SegmentedControl($weather, ["温暖", "温和", "凉爽"])], 2)], 2, 220, 5)], "soft", 4)
colors = [{name: "海军蓝", hex: "#2F3E55"}, {name: "白色", hex: "#F7F5F0"}, {name: "浅褐色", hex: "#CFC5B8"}, {name: "橄榄绿", hex: "#6B7350"}, {name: "棕褐色", hex: "#B98B5E"}]
palette = Row(@Each(colors, "c", Col([Box([], null, null, null, c.hex, "full", true, 40, 40), Caption(c.name)], 1, "center")), 4, null, null, true)
tops = $weather == "温暖" ? ["白色亚麻衬衫", "海军蓝 T 恤", "条纹 T 恤", "橄榄绿休闲衬衫"] : $weather == "凉爽" ? ["美利奴羊毛圆领衫", "白色牛津纺衬衫", "海军蓝长袖 T 恤", "浅褐色针织衫"] : ["白色 T 恤", "海军蓝牛津纺衬衫", "条纹长袖 T 恤", "浅褐色针织马球衫"]
bottoms = $weather == "温暖" ? ["浅褐色亚麻长裤", "海军蓝短裤"] : $weather == "凉爽" ? ["深色牛仔裤", "橄榄绿斜纹棉裤"] : ["深色牛仔裤", "浅褐色斜纹棉裤"]
layers = $weather == "温暖" ? ["轻薄衬衫外套"] : $weather == "凉爽" ? ["羊毛大衣", "海军蓝开衫"] : ["海军蓝休闲西装外套"]
shoes = $weather == "凉爽" ? ["皮靴", "白色运动鞋"] : ["白色运动鞋", "棕褐色乐福鞋"]
nTops = @Clamp(@Ceil($days / 2) + 1, 3, @Count(tops))
list = @Concat(@Concat(@Each(@Take(tops, nTops), "x", {group: "上装", name: x}), @Each(bottoms, "x", {group: "下装", name: x})), @Concat(@Concat(@Each(layers, "x", {group: "外搭", name: x}), @Each(shoes, "x", {group: "鞋履", name: x})), [{group: "基础衣物", name: "袜子和内衣 × " + @Min([$days, 7])}, {group: "基础衣物", name: "睡衣"}, {group: "基础衣物", name: $weather == "温暖" ? "泳衣和太阳镜" : "轻便折叠伞"}]))
done = @Count(@Filter(@Each(list, "it", @Includes($packed, it.name)), "", "==", true))
packing = Card([Row([Text("已收拾 " + done + " / " + @Count(list) + " 件", "sm", "muted", null, false, false, true), Spacer(), Button("重置", @Reset($packed), "ghost", null, "sm", "rotate-ccw")], 2), Box([Box([], null, null, null, "ink", "full", null, @Percent(done, @Count(list)) + "%", 4)], null, null, null, "border", "full", null, "100%", 4), Col(@Each(list, "it", Pressable([Row([Icon(@Includes($packed, it.name) ? "check-circle" : "circle", "sm", @Includes($packed, it.name) ? "success" : "faint"), Text(it.name, "sm", null, null, false, @Includes($packed, it.name)), Spacer(), Caption(it.group)], 2)], @Set($packed, @Toggle($packed, it.name)), @Includes($packed, it.name), 2)), 1), $days > 7 ? Caption("建议在第 " + @Ceil($days / 2) + " 天安排一次洗衣。") : null], null, 4, 2)
outfits = Card([Col(@Each(@Range(0, $days), "d", Row([Box([Text("第 " + (d + 1) + " 天", "xs", null, "semibold")], null, null, 1, "surface", "md", null, 56, null, null, "center", "center"), Text(tops[d % nTops] + " 搭配 " + bottoms[d % @Count(bottoms)] + ($weather == "温暖" ? "" : "、" + layers[d % @Count(layers)]), "sm"), Spacer(), Caption(shoes[d % @Count(shoes)])], 2)), 2)], null, 3)
tip = Text("出行当天穿最厚重的鞋子和外套；衣物卷起来收纳，比折叠更省空间。", "sm", "muted")`;

const drones = `root = Col([head, Title("市场结构", "md"), segments, Title("市场规模", "md"), sizeCard, Title("哪些参与者能盈利", "md"), players, Title("模拟无人机摄影业务的经营情况", "md"), sim, Title("行业变化", "md"), changes, ask])
$projects = 12
$price = 450
$cost = 90
$fixed = 1800
head = Col([Title("无人机摄影市场", "xl"), Text("为房产、活动、巡检和媒体提供航拍照片与视频。这是一个新兴市场，价格亲民的设备与持证专业服务并存。", "md", "muted")], 2)
segs = [{name: "房地产与建筑", query: "郊区航拍", text: "房源照片和视频，是最稳定的业务来源。"}, {name: "婚礼与活动", query: "婚礼摄影", text: "业务有季节性，按场次收费，通常会与地面摄影团队服务打包。"}, {name: "巡检与测绘", query: "太阳能电站航拍", text: "屋顶、太阳能电站和建筑工地巡检：需要更多培训，报酬也更高。"}, {name: "媒体与旅游", query: "海岸线航拍", text: "素材库、旅游局和影视拍摄：曝光度高，但竞争激烈。"}]
segments = Grid(@Each(segs, "s", Card([SearchImage(s.query, 1.7, "md"), Text(s.name, "sm", null, "semibold"), Caption(s.text)], null, 3, 2)), 2, 220, 3)
market = [{year: "2024", size: 860000000}, {year: "2026", size: 1110000000}, {year: "2028", size: 1520000000}, {year: "2030", size: 2260000000}]
sizeCard = Card([Row([Col([Caption("2026 年全球无人机摄影服务"), Title(@Format(1110000000, "compact", 1, "USD"), "2xl")], 1), Spacer(), Badge("年增长约 19%", "success")], 3, null, null, true), Chart("bar", market, "year", ["size"], "currency", null, false, 200), Caption("示意数据参考公开市场报告；因市场定义不同，各项估算可能差异较大。")], null, 4, 2)
players = Table(["参与者", "收入来源", "利润率"], [["无人机制造商", "设备、相机和配件", Badge("中", "warning")], ["自由飞手", "按拍摄场次或项目收费", Badge("高", "success")], ["服务机构", "打包提供照片、视频和后期制作", Badge("中", "warning")], ["软件平台", "测绘和数据处理订阅服务", Badge("高", "success")]])
revenue = $projects * $price
costs = $fixed + $projects * $cost
profit = revenue - costs
margin = revenue > 0 ? profit / revenue * 100 : 0
breakeven = $price > $cost ? @Ceil($fixed / ($price - $cost)) : null
curve = @Each(@Range(0, 41, 5), "n", {projects: n + "", Revenue: n * $price, Costs: $fixed + n * $cost})
sim = Card([Grid([Slider($projects, 0, 40, 1, "每月项目数"), Slider($price, 100, 1500, 25, "单个项目报价", "$"), Slider($cost, 0, 400, 10, "单个项目成本", "$"), Slider($fixed, 0, 6000, 100, "每月固定成本", "$")], 2, 240, 5), Grid([k1, k2, k3, k4], 4, 130, 3), Chart("line", curve, "projects", ["Revenue", "Costs"], "currency", null, false, 200), Text(breakevenText, "sm"), Caption("仅作示意。固定成本包括保险、设备、软件和营销；项目成本包括后期制作和差旅。")], null, 4, 4)
k1 = Card([Caption("月收入"), Title(@Format(revenue, "currency", 0), "lg")], "soft", 3, 1)
k2 = Card([Caption("月利润"), Title(@Format(profit, "currency", 0), "lg", profit >= 0 ? "success" : "danger")], "soft", 3, 1)
k3 = Card([Caption("利润率"), Title(@Format(margin, "percent", 1), "lg")], "soft", 3, 1)
k4 = Card([Caption("盈亏平衡"), Title(breakeven == null ? "无法实现" : @Plural(breakeven, "个项目"), "lg")], "soft", 3, 1)
breakevenText = breakeven == null ? "每个项目的成本都高于收入，因此增加业务量只会扩大亏损。" : breakeven > 40 ? "每月需要完成 " + @Plural(breakeven, "个项目") + " 才能覆盖固定成本；建议提高报价或降低成本。" : "从第 " + breakeven + " 个项目起即可覆盖固定成本；此后每个项目增加 " + @Format($price - $cost, "currency", 0) + " 利润。"
changes = List(["更便宜、相机更好的无人机让基础航拍服务价格下降。", "在美国，FAA Part 107 等许可要求使缺乏资质的竞争者难以进入商业市场。", "巡检、测绘和热成像业务的增长快于单纯摄影。", "客户越来越需要剪辑视频和 3D 模型，而不只是照片。"])
ask = Row([Button("与无人机巡检服务比较", @ToAssistant("比较无人机摄影和无人机巡检市场"), "outline", null, "sm", "arrow-right")])`;

// A small space shooter for HtmlView: keyboard and on-screen buttons, waves that speed up.
const arcadeHtml = `<style>
body{padding:12px;display:flex;flex-direction:column;gap:10px;align-items:center;background:#0b0b1a;color:#e6e6ff;font-family:ui-monospace,Menlo,monospace}
.top{display:flex;justify-content:space-between;width:100%;max-width:400px;font-size:13px;letter-spacing:.06em}
canvas{width:100%;max-width:400px;aspect-ratio:4/5;border-radius:10px;background:#05050f;box-shadow:0 0 0 1px #2a2a55,0 0 24px #3b1d6e66;touch-action:none;outline:none}
.pad{display:flex;gap:8px;width:100%;max-width:400px}
.pad button{flex:1;padding:12px 0;font:600 14px ui-monospace,Menlo,monospace;color:#e6e6ff;background:#1a1a3a;border:1px solid #3a3a7a;border-radius:10px;user-select:none;-webkit-user-select:none;touch-action:none;cursor:pointer}
.pad button:active{background:#2c2c66}
#start{background:#ff2bd6;border-color:#ff2bd6;color:#0b0b1a}
p{margin:0;font-size:12px;opacity:.7}
</style>
<div class="top"><span id="score">得分 0</span><span id="wave">波次 1</span><span id="lives">♥♥♥</span></div>
<canvas id="c" width="400" height="500" tabindex="0"></canvas>
<div class="pad"><button id="left" aria-label="向左移动">◀</button><button id="fire">开火</button><button id="right" aria-label="向右移动">▶</button></div>
<div class="pad"><button id="start">开始游戏</button></div>
<p>使用方向键移动、空格键开火。手机上请使用屏幕按钮。</p>
<script>
const c=document.getElementById('c'),g=c.getContext('2d'),W=400,H=500,S=id=>document.getElementById(id),keys={};
let ship,shots,bombs,aliens,dir,speed,score=0,lives=3,wave=1,running=false,over=false,last=0,cool=0;
const stars=Array.from({length:60},()=>[Math.random()*W,Math.random()*H,Math.random()*1.5+.3]);
const colors=['#ff2bd6','#ffb000','#2bf0ff','#7dff5a'];
function newWave(){aliens=[];for(let r=0;r<4;r++)for(let k=0;k<8;k++)aliens.push({x:40+k*42,y:50+r*34,r});dir=1;speed=20+wave*8}
function reset(){ship={x:W/2};shots=[];bombs=[];score=0;lives=3;wave=1;over=false;newWave();hud()}
function hud(){S('score').textContent='得分 '+score;S('wave').textContent='波次 '+wave;S('lives').textContent='♥'.repeat(Math.max(lives,0))||'-'}
function fire(){if(running&&cool<=0&&shots.length<3){shots.push({x:ship.x,y:H-48});cool=.28}}
function step(dt){
const mv=(keys.ArrowLeft||keys.left?-1:0)+(keys.ArrowRight||keys.right?1:0);
ship.x=Math.max(20,Math.min(W-20,ship.x+mv*240*dt));cool-=dt;if(keys[' ']||keys.fire)fire();
shots.forEach(s=>s.y-=420*dt);
let edge=false;aliens.forEach(a=>{a.x+=dir*speed*dt;if(a.x<16||a.x>W-16)edge=true});
if(edge){dir*=-1;aliens.forEach(a=>{a.y+=14;a.x+=dir*2})}
if(aliens.length&&Math.random()<dt*(.8+wave*.3)){const a=aliens[Math.floor(Math.random()*aliens.length)];bombs.push({x:a.x,y:a.y+10})}
bombs.forEach(b=>b.y+=(150+wave*15)*dt);
for(const s of shots)for(const a of aliens)if(!a.dead&&!s.hit&&Math.abs(s.x-a.x)<14&&Math.abs(s.y-a.y)<11){a.dead=s.hit=true;score+=10*(4-a.r)}
aliens=aliens.filter(a=>!a.dead);shots=shots.filter(s=>!s.hit&&s.y>-10);
for(const b of bombs)if(Math.abs(b.x-ship.x)<16&&b.y>H-46&&b.y<H-20){b.hit=true;lives--}
bombs=bombs.filter(b=>!b.hit&&b.y<H);
if(aliens.some(a=>a.y>H-70))lives=0;
if(!aliens.length){wave++;newWave()}
if(lives<=0){running=false;over=true;S('start').textContent='再玩一次'}
hud()}
function draw(){
g.fillStyle='#05050f';g.fillRect(0,0,W,H);g.fillStyle='#fff';
stars.forEach(s=>{g.globalAlpha=s[2]/2;g.fillRect(s[0],s[1],s[2],s[2])});g.globalAlpha=1;
aliens.forEach(a=>{g.fillStyle=colors[a.r];g.shadowColor=colors[a.r];g.shadowBlur=8;g.fillRect(a.x-12,a.y-7,24,14);g.shadowBlur=0;g.fillStyle='#05050f';g.fillRect(a.x-7,a.y-3,4,4);g.fillRect(a.x+3,a.y-3,4,4)});
g.shadowBlur=10;g.shadowColor='#2bf0ff';g.fillStyle='#2bf0ff';g.beginPath();g.moveTo(ship.x,H-46);g.lineTo(ship.x+16,H-24);g.lineTo(ship.x-16,H-24);g.closePath();g.fill();
g.fillStyle='#fff';shots.forEach(s=>g.fillRect(s.x-1.5,s.y-8,3,10));
g.fillStyle='#ff4d4d';g.shadowColor='#ff4d4d';bombs.forEach(b=>g.fillRect(b.x-2,b.y-6,4,9));g.shadowBlur=0;
if(!running){g.fillStyle='rgba(5,5,15,.75)';g.fillRect(0,H/2-50,W,100);g.textAlign='center';g.fillStyle='#ff2bd6';g.font='bold 28px ui-monospace,Menlo,monospace';g.fillText(over?'游戏结束':'霓虹入侵者',W/2,H/2-5);g.fillStyle='#e6e6ff';g.font='13px ui-monospace,Menlo,monospace';g.fillText(over?'得分：'+score+'。按下“再玩一次”':'按下“开始游戏”',W/2,H/2+22)}}
function loop(t){const dt=Math.min(.05,(t-last)/1000||0);last=t;if(running)step(dt);draw();requestAnimationFrame(loop)}
addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight',' '].includes(e.key)){keys[e.key]=true;e.preventDefault()}});
addEventListener('keyup',e=>{keys[e.key]=false});
for(const id of ['left','right','fire']){const b=S(id);b.addEventListener('pointerdown',e=>{keys[id]=true;b.setPointerCapture(e.pointerId)});b.addEventListener('pointerup',()=>{keys[id]=false});b.addEventListener('pointercancel',()=>{keys[id]=false})}
S('start').onclick=()=>{reset();running=true;S('start').textContent='重新开始';c.focus()};
reset();requestAnimationFrame(loop);
</script>`;

const arcade = `root = Col([Title("霓虹入侵者", "lg"), Text("一款迷你复古射击游戏。敌人降落前清除当前波次；每一波都会变得更快。", "sm", "muted"), HtmlView(${JSON.stringify(arcadeHtml)}, null, "霓虹入侵者")], 3)`;

export const toolPrograms: ToolProgram[] = [
  {
    id: "recipe",
    example: "recipe",
    title: "周日烤肉",
    prompt: "为朋友安排一顿周日烤肉，并准备购物清单",
    note: "人数调节器会按比例调整购物清单（@Each、@Clamp、@Format）；可用 @Toggle 勾选食材和步骤，并通过 @Join 与 @CopyToClipboard 复制清单。",
    code: roast,
  },
  {
    id: "bill",
    example: "bill",
    title: "分摊账单",
    prompt: "制作一个与朋友聚餐时使用的账单分摊工具",
    note: "通过 @Append 和 @Remove 添加或移除用餐人及项目；用 @Update 和 @Toggle 选择分摊人；设置税费和小费；@Allocate 确保金额分币后总额一致；复制分账结果。",
    code: bill,
  },
  {
    id: "monty",
    example: "monty",
    title: "蒙提霍尔问题",
    prompt: "通过互动游戏解释蒙提霍尔问题",
    note: "选择一扇门：@Set 中的 @Random 随机放置汽车并打开一扇有山羊的门。你可以选择换门或坚持，并通过 @Range 和 @Each 模拟 1,000 局。",
    code: monty,
  },
  {
    id: "savings",
    example: "savings",
    title: "退休储蓄",
    prompt: "帮我探索退休储蓄的增长情况",
    note: "通过 @Range 和 @Each 使用 @Pow 计算逐年余额；四个滑块会同步更新图表、总额和 100 万美元里程碑。",
    code: savings,
  },
  {
    id: "gdp-explained",
    example: "gdp",
    title: "GDP 详解",
    prompt: "GDP 如何运作？让我探索一个经济体",
    note: "通过四个滑块调整经济指标；@Each 从同一份数据生成分段条和图例；净出口为负时显示说明，并附带知识测验。",
    code: gdp,
  },
  {
    id: "clt",
    example: "clt",
    title: "中心极限定理",
    prompt: "用直观的方式帮我理解中心极限定理",
    note: "在 @Set 中通过 @Random 抽取样本；@Histogram 和 @Stats 展示三种总体下均值分布如何按 1/√n 收窄。",
    code: clt,
  },
  {
    id: "bicycle",
    example: "bicycle",
    title: "7 速自行车",
    prompt: "介绍 7 速自行车的结构设计",
    note: "档位滑块会驱动由七个飞轮片组成的 Svg（@Range、@Each 和索引访问），并更新齿比与对应踏频下的速度。",
    code: bicycle,
  },
  {
    id: "bike-repair",
    example: "bike-repair",
    title: "组装青少年自行车",
    prompt: "一步一步指导我组装一辆青少年自行车",
    note: "点击步骤即可勾选（按索引使用 @Toggle）并更新进度条；刹车类型会改变对应步骤；腿内侧长度用于估算坐垫高度。",
    code: bikeRepair,
  },
  {
    id: "route",
    example: "route",
    title: "旧金山一日游",
    prompt: "规划旧金山观光路线",
    note: "通过 @Each 生成地图标记和驾车路线；节奏选项会重新安排时间表（@Cumulative、@Pad）；点击地图标记或行程项可选择站点。",
    code: route,
  },
  {
    id: "roadtrip",
    example: "roadtrip",
    title: "太平洋西北自驾游",
    prompt: "规划一趟为期十天的太平洋西北自驾游",
    note: "路线包含九个站点；点击某一天即可选中对应地点；调整预算档位和出行人数后，总额和图表会自动更新。",
    code: roadtrip,
  },
  {
    id: "room",
    example: "room",
    title: "挑选墙面颜色",
    prompt: "帮我为客厅挑选一种新的墙面颜色",
    note: "根据三个回答为六种颜色评分（@Includes、@Sort、@Take）；房间 Svg 会显示所选墙色、沙发和叠加光线效果。",
    code: room,
  },
  {
    id: "origami",
    example: "origami",
    title: "折一只狐狸折纸",
    prompt: "教我如何折一只小狐狸折纸",
    note: "列表中包含六张 Svg 折纸示意图；通过 @Clamp 控制上一步和下一步，点击缩略图可跳到对应步骤。",
    code: origami,
  },
  {
    id: "garden",
    example: "garden",
    title: "规划菜园",
    prompt: "帮我规划一个小型后院菜园",
    note: "通过滑块设置种植床尺寸和日照；用 @Toggle 选择作物；Grid 根据 $w 列数生成方格种植布局，并显示日照提醒、摘要表格和清单。",
    code: garden,
  },
  {
    id: "wardrobe",
    example: "wardrobe",
    title: "胶囊衣橱",
    prompt: "为一周旅行搭配一套百搭胶囊衣橱",
    note: "旅行天数和天气会重新生成行李清单（@Concat、@Take）及每日穿搭（取模索引）；附带行李勾选清单。",
    code: wardrobe,
  },
  {
    id: "drones",
    example: "drones",
    title: "无人机摄影市场",
    prompt: "帮我了解无人机摄影市场",
    note: "展示市场细分、市场规模图表和参与者表格；通过四个滑块探索业务模型的利润、利润率和盈亏平衡点。",
    code: drones,
  },
  {
    id: "game",
    example: "game",
    title: "复古街机游戏",
    prompt: "制作一款可以直接游玩的复古街机游戏",
    note: "HtmlView 在沙箱 iframe 中运行 canvas 太空射击游戏，支持键盘和屏幕按钮操作。",
    code: arcade,
  },
  {
    id: "dash-sales",
    example: "dash-sales",
    title: "销售仪表盘",
    prompt: "构建最近 90 天的销售仪表盘，展示销售额、订单数、平均订单金额、按周和地区统计的销售额，以及热销商品。",
    note: "通过 Query(get_orders) 获取数据并按渠道和时间筛选；使用 @Bucket、@Cumulative、@Change、@GroupBy、@Pivot 和 @Top 处理数据。",
    code: sales,
  },
  {
    id: "dash-support",
    example: "dash-support",
    title: "客服仪表盘",
    prompt: "制作客服仪表盘，展示未结工单、处理时长中位数、每周工单数、处理最慢的团队和满意度。",
    note: "通过 Query(get_tickets) 获取工单；使用 @Bucket 和 @Between 对比每周新建与已解决工单；用 @Stats、@Histogram、@MovingAvg 分析处理时长，并列出等待最久的工单。",
    code: support,
  },
];
