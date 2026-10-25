import spec from "@/generated/spec.json";
import { promptOptions } from "@/lib/prompt-options";
import { hasAllowedOrigin } from "@/lib/same-origin";
import { generateSystemPrompt, type LibrarySpec } from "@openuidev/lang-core";
import OpenAI from "openai";
import type { ReasoningEffort } from "openai/resources/shared";
import type { ChatCompletionChunk, ChatCompletionCreateParamsStreaming, ChatCompletionMessageParam } from "openai/resources/chat/completions";
import type { ResponseInputItem } from "openai/resources/responses/responses";

// 根据环境变量选择一种模型调用方式：
//
// OpenUI Cloud（默认，配置 THESYS_API_KEY）：通过 Gateway 调用 Responses API。
// cloud: true 会把组件库规范交给 Gateway，由 Gateway 生成提示词，并校验、修正流式返回的 OpenUI Lang。
//
// 直连（LLM_BASE_URL 或 Ollama 快捷配置）：调用 OpenAI-compatible Chat Completions 服务，
// 例如 OpenRouter、Ollama 或 LM Studio。服务端根据同一份组件库规范和提示词选项生成完整提示词，
// 再把模型文本转换为 Responses 事件，因此浏览器消费的流格式与 Gateway 路径一致；此路径不会自动修正输出。
//
// 两种模型路径都不提供图片搜索工具；SearchImage 组件会根据自己的 query 查找照片。

const librarySpec: LibrarySpec = spec;

// 默认使用 low 推理强度；设为 default 或空字符串时不发送推理强度参数，由模型采用自身默认值。
const effortSetting = process.env.LLM_REASONING_EFFORT ?? "low";
const effort = effortSetting === "default" || effortSetting === "" ? undefined : (effortSetting as ReasoningEffort);

const useOllama = process.env.MODEL_PROVIDER === "ollama" || !!process.env.OLLAMA_MODEL;
const direct = process.env.LLM_BASE_URL
  ? { name: "LLM", baseURL: process.env.LLM_BASE_URL, apiKey: process.env.LLM_API_KEY, model: process.env.LLM_MODEL }
  : useOllama
    ? { name: "Ollama", baseURL: process.env.OLLAMA_BASE_URL ?? "http://localhost:11434/v1", apiKey: "ollama", model: process.env.OLLAMA_MODEL ?? "qwen3.8:27b" }
    : null;

const backend = direct
  ? {
      kind: "direct" as const,
      name: direct.name,
      model: direct.model ?? "",
      instructions: generateSystemPrompt({ library: librarySpec, promptOptions }),
      connect: () => new OpenAI({ apiKey: direct.apiKey ?? "none", baseURL: direct.baseURL }),
      missingConfig: direct.model ? undefined : "未设置 LLM_MODEL。请将其设置为 LLM_BASE_URL 提供的模型 ID。",
    }
  : {
      kind: "cloud" as const,
      name: "OpenUI Gateway",
      model: process.env.THESYS_MODEL ?? "openai/gpt-6.1-sol",
      instructions: generateSystemPrompt({
        cloud: true,
        library: librarySpec,
        promptOptions: { examples: promptOptions.examples, additionalRules: promptOptions.additionalRules },
      }),
      connect: () => new OpenAI({ apiKey: process.env.THESYS_API_KEY, baseURL: process.env.THESYS_BASE_URL ?? "https://api.thesys.dev/v1/embed" }),
      missingConfig: process.env.THESYS_API_KEY
        ? undefined
        : "未设置 THESYS_API_KEY。请将其添加到 .env，或配置 LLM_BASE_URL、LLM_API_KEY 和 LLM_MODEL 以使用 OpenAI-compatible API。",
    };

// 为较长的流式回答预留最多 300 秒执行时间；具体平台可能有自己的时限。
export const maxDuration = 300;

// 首次有效请求到来时才创建 SDK 客户端，使项目在未配置密钥时仍可完成构建。
let client: OpenAI | undefined;

const MAX_ITEMS = 60;
const MAX_BODY_BYTES = 1_000_000;
const MAX_OUTPUT_TOKENS = 16_000;

// 浏览器每轮都会发送当前会话的消息列表。这里只保留 user/assistant 文本：
// 历史工具调用已在此前轮次执行，系统提示词等可信指令由服务端生成，不能信任浏览器传入的内容。
// 当前聊天不支持附件，因此图片、文件等非文本部分不会转发给模型。
function toInput(messages: unknown): ResponseInputItem[] | null {
  if (!Array.isArray(messages)) return null;
  const items = messages.flatMap((item): ResponseInputItem[] => {
    if (!item || typeof item !== "object") return [];
    const { role, content } = item as { role?: unknown; content?: unknown };
    if (role !== "user" && role !== "assistant") return [];
    if (typeof content !== "string" && !Array.isArray(content)) return [];
    const text = typeof content === "string" ? content : content.map((part) => (typeof part?.text === "string" ? part.text : "")).join("");
    return [{ role, content: text } as ResponseInputItem];
  });
  return items.length ? items.slice(-MAX_ITEMS) : null;
}

/** 将整理后的对话转换为 Chat Completions 所需的纯文本消息格式。 */
function toChatMessages(input: ResponseInputItem[]): ChatCompletionMessageParam[] {
  return input.map((item) => {
    const { role, content } = item as { role: "user" | "assistant"; content: unknown };
    const text = typeof content === "string" ? content : Array.isArray(content) ? content.map((p) => (p as { text?: string }).text ?? "").join("") : "";
    return { role, content: text };
  });
}

/** 将直连服务的 Chat Completions 流转换为浏览器 Responses 适配器可读取的事件。 */
async function* asResponsesEvents(stream: AsyncIterable<ChatCompletionChunk>) {
  const id = `msg_${Date.now()}`;
  yield { type: "response.output_item.added", item: { id, type: "message", role: "assistant", content: [], status: "in_progress" }, output_index: 0 };
  let text = "";
  for await (const chunk of stream) {
    const delta = chunk.choices?.[0]?.delta?.content;
    if (!delta) continue;
    text += delta;
    yield { type: "response.output_text.delta", item_id: id, output_index: 0, content_index: 0, delta };
  }
  yield { type: "response.output_text.done", item_id: id, output_index: 0, content_index: 0, text };
  yield { type: "response.completed" };
}

export async function POST(req: Request) {
  // 当前接口没有登录鉴权，因此先限制为本站来源，避免其他网站借用服务端配置的模型凭据。
  if (!hasAllowedOrigin(req)) return Response.json({ error: { message: "不允许的请求来源。" } }, { status: 403 });
  // 本接口只接受 JSON 请求体。
  if (!req.headers.get("content-type")?.includes("application/json")) {
    return Response.json({ error: { message: "请求体必须是 application/json。" } }, { status: 415 });
  }
  // 先读取原始请求体并按 UTF-8 字节数限制大小，避免超大消息占用过多内存。
  const raw = await req.text();
  if (new TextEncoder().encode(raw).length > MAX_BODY_BYTES) {
    return Response.json({ error: { message: "请求体过大。" } }, { status: 413 });
  }
  let input: ResponseInputItem[] | null;
  try {
    // 解析浏览器提交的对话，并过滤成模型支持的 user/assistant 文本输入。
    input = toInput((JSON.parse(raw) as { messages?: unknown }).messages);
  } catch {
    input = null;
  }
  if (!input) return Response.json({ error: { message: "messages 必须是非空数组。" } }, { status: 400 });

  if (backend.missingConfig) return Response.json({ error: { message: backend.missingConfig } }, { status: 500 });

  // 将两种上游路径统一为事件流：Gateway 原生返回 Responses 事件，直连路径由适配器转换。
  let events: AsyncIterable<unknown>;
  try {
    client ??= backend.connect();
    // console.log(backend.instructions);
    // console.log('---------------------------------');
    // console.log(input);
    events =
      backend.kind === "cloud"
        ? await client.responses.create(
            {
              model: backend.model,
              instructions: backend.instructions,
              input,
              store: false,
              // 最长回答（例如 HtmlView 中的小游戏）约为 2,500 tokens；该上限主要用于阻止异常冗长的输出。
              max_output_tokens: MAX_OUTPUT_TOKENS,
              ...(effort ? { reasoning: { effort } } : {}),
              stream: true,
            },
                { signal: req.signal }, // 浏览器取消请求时，将取消信号继续传给模型服务。
          )
        : asResponsesEvents(
            await client.chat.completions.create(
              {
                model: backend.model,
                messages: [{ role: "system", content: backend.instructions }, ...toChatMessages(input)],
                stream: true,
                // OpenRouter 读取 reasoning.effort；其他 OpenAI-compatible 服务通常读取 reasoning_effort。
                ...(effort ? { reasoning_effort: effort, reasoning: { effort } } : {}),
              } as ChatCompletionCreateParamsStreaming,
              { signal: req.signal },
            ),
          );
  } catch (err) {
    // 建立上游请求失败时，将状态码和错误摘要转换为 HTTP 错误响应。
    const e = err as { status?: number; message?: string };
    console.error(err);
    return Response.json({ error: { message: `${backend.name}：${e.message ?? "上游服务错误"}` } }, { status: e.status ?? 502 });
  }

  // 将统一后的 Responses 事件封装为 SSE；前端使用 openAIResponsesAdapter() 解析。
  const encoder = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const event of events) {
          // 部分 Responses 事件会重复携带系统提示词和 safety_identifier；页面不需要这些字段，
          // 移除它们可避免将内部提示词和无关元数据发给浏览器。
          const response = (event as { response?: Record<string, unknown> }).response;
          if (response) {
            delete response.instructions;
            delete response.safety_identifier;
          }
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
          // 前端适配器不会把 response.incomplete 当作可见错误；输出触及上限时补发明确错误提示。
          if ((event as { type?: string }).type === "response.incomplete") {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "error", message: "回答长度达到上限，请缩短问题后重试。" })}\n\n`));
          }
        }
      } catch (err) {
        // 流开始后发生的上游错误无法再更改 HTTP 状态码，因此作为 SSE error 事件发送。
        const message = err instanceof Error ? err.message : String(err);
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "error", message })}\n\n`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(body, {
    // no-transform 避免中间层改写流；keep-alive 保持连接直至模型事件全部转发完毕。
    headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache, no-transform", Connection: "keep-alive" },
  });
}
