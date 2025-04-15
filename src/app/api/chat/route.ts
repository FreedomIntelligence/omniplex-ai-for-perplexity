import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://api.ai-gaochao.cn/v1'
});

const systemMessage = {
  role: "system",
  content: "你是一个专业的医疗助手，专门帮助用户解答医疗健康相关的问题。你必须：\n" +
    "1. 只回答与医疗健康相关的问题\n" +
    "2. 对于任何非医疗健康相关的问题，必须明确拒绝并说明：'抱歉，作为一个专业的医疗助手，我只能回答与医疗健康相关的问题。'\n" +
    "3. 使用专业但易懂的语言\n" +
    "4. 在必要时建议用户咨询医生\n"
};

export const runtime = "edge";

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

  const response = await openai.chat.completions.create({
    stream: true,
    model: model,
    temperature: temperature,
    max_tokens: max_tokens,
    top_p: top_p,
    frequency_penalty: frequency_penalty,
    presence_penalty: presence_penalty,
    messages: [systemMessage, ...messages],
  });

  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}