"use client";
import "@/lib/devtools";
import "@openuidev/react-ui/styles/index.css";

import {
  AgentInterface,
  fetchLLM,
  openAIConversationMessageFormat,
  openAIResponsesAdapter,
  useThemeModePreference,
} from "@openuidev/react-ui";
import type { ActionEvent } from "@openuidev/react-lang";
import { useEffect } from "react";
import { Brain, Calculator, Compass, Gamepad2, MapPinned, UtensilsCrossed, ChartNoAxesCombined, ReceiptText } from "lucide-react";
import { runLibraryAction } from "@/lib/actions";
import { withBase } from "@/lib/base-path";
import { localChatStorage, SaveMessages } from "@/lib/chat-storage";
import { webUrl } from "@/lib/components/style";
import { library } from "@/lib/library";

// The chat opens @OpenUrl with a plain window.open of whatever URL the model wrote, and on
// openui.com this page shares its origin with the rest of the site. So only http(s) URLs open,
// in a new tab without an opener; a javascript: or data: URL does nothing.
if (typeof window !== "undefined") {
  const open = window.open.bind(window);
  window.open = (url?: string | URL) => {
    const safe = webUrl(String(url ?? ""));
    return safe ? open(safe, "_blank", "noopener,noreferrer") : null;
  };
}

const starters = [
  { displayText: "规划一日游", prompt: "我会在上海待一天，请帮我规划观光路线", icon: <MapPinned size={16} /> },
  { displayText: "探索一座城市", prompt: "请规划一段轻松的洛杉矶半日游，安排三个停留点并附上地图", icon: <Compass size={16} /> },
  { displayText: "规划一顿晚餐", prompt: "请为六个人安排一顿简单的素食晚餐", icon: <UtensilsCrossed size={16} /> },
  { displayText: "分摊一下账单", prompt: "制作一个与朋友聚餐时使用的账单分摊工具", icon: <ReceiptText size={16} /> },
  { displayText: "制作数据看板", prompt: "构建网站流量仪表盘，展示各来源的访问量和注册量、转化率以及累计注册量。", icon: <ChartNoAxesCombined size={16} /> },
  { displayText: "制作一个计算器", prompt: "请制作一个带显示屏和按键、可以实际使用的计算器", icon: <Calculator size={16} /> },
  { displayText: "玩一款掌机游戏", prompt: "请制作一款可以玩的 Game Boy 风格掌机游戏，包含屏幕、方向键和 A/B 按钮", icon: <Gamepad2 size={16} /> },
  { displayText: "趣味知识问答", prompt: "请用五道有趣的知识题考考我，并记录得分", icon: <Brain size={16} /> },
];

const llm = fetchLLM({
  url: withBase("/api/chat"),
  streamAdapter: openAIResponsesAdapter(),
  messageFormat: openAIConversationMessageFormat,
});

// Threads and messages persist in localStorage (created once, on the client).
const storage = typeof window === "undefined" ? undefined : localChatStorage();

// The chat sends @ToAssistant and opens @OpenUrl itself; every other action,
// such as the library's @CopyToClipboard, reaches onAction.
function onAction(event: ActionEvent) {
  void runLibraryAction(event);
}

export default function Home() {
  // Follows the system theme until the footer toggle is first used, then
  // remembers the choice.
  const { setPreference, mode } = useThemeModePreference();

  // Mirror the resolved mode onto <html>, so the components' dark tokens also
  // apply while the theme follows the system.
  useEffect(() => {
    document.documentElement.setAttribute("data-openui-theme", mode);
  }, [mode]);

  return (
    <div className="chat-shell">
      <AgentInterface
        llm={llm}
        storage={storage}
        componentLibrary={library}
        onAction={onAction}
        agentName="Intelligent UI"
        logoUrl={withBase("/shiro-face.svg")}
        theme={{ mode }}
        starters={starters}
      >
        <AgentInterface.SidebarFooter>
          <AgentInterface.ThemeModeToggle mode={mode} onModeChange={setPreference} />
        </AgentInterface.SidebarFooter>
        <AgentInterface.ThreadHeader showChatTitle={false} />
        <AgentInterface.Welcome
          image={<img src={withBase("/shiro-woodworker.svg")} alt="" className="welcome-mascot" />}
          title="What can I help with?"
          starterVariant="card"
          glowAnimation
        />
        <SaveMessages />
      </AgentInterface>
    </div>
  );
}
