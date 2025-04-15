import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://api.ai-gaochao.cn/v1'
});

const TAVILY_API_KEY = process.env.TAVILY_API_KEY;

const systemMessage = {
  role: "system",
  content: "你是一个专业的医疗助手，专门帮助用户解答医疗健康相关的问题。你必须：\n" +
    "1. 只回答与医疗健康相关的问题\n" +
    "2. 对于任何非医疗健康相关的问题，必须明确拒绝并说明：'抱歉，作为一个专业的医疗助手，我只能回答与医疗健康相关的问题。'\n" +
    "3. 使用专业但易懂的语言\n" +
    "4. 在必要时建议用户咨询医生\n"
};

export const runtime = "edge";

async function searchMedical(query: string) {
  if (!TAVILY_API_KEY) {
    console.error("Tavily API key is undefined. Please check your .env.local file.");
    return null;
  }

  try {
    const response = await fetch('https://api.tavily.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TAVILY_API_KEY}`
      },
      body: JSON.stringify({
        query: query.trim(),
        search_depth: "advanced",
        max_results: 10,
        include_answer: "advanced"
      })
    });
    const data = await response.json();
    return data.answer || null;
  } catch (error) {
    console.error("TAVILY API request error:", error);
    return null;
  }
}

export async function POST(req: Request) {
  const {
    messages,
    model,
    temperature,
    max_tokens,
    top_p,
    frequency_penalty,
    presence_penalty,
  } = await req.json();

  // 获取用户最新的消息
  const userMessage = messages[messages.length - 1];
  const searchResult = await searchMedical(userMessage.content);

  // 如果有搜索结果，将其添加到系统消息中
  let enhancedMessages = [systemMessage, ...messages];
  if (searchResult) {
    enhancedMessages.splice(1, 0, {
      role: "system",
      content: `根据搜索结果补充信息：${searchResult}`
    });
  }

  const response = await openai.chat.completions.create({
    stream: true,
    model: model,
    temperature: temperature,
    max_tokens: max_tokens,
    top_p: top_p,
    frequency_penalty: frequency_penalty,
    presence_penalty: presence_penalty,
    messages: enhancedMessages,
  });

  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}