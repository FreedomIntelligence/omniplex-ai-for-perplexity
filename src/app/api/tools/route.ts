import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://api.ai-gaochao.cn/v1'
});

export async function POST(req: Request) {
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({
        error: "Method not allowed, only POST requests are accepted.",
      }),
      { status: 405 }
    );
  }

  const messages = await req.json();

  const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
    {
      type: "function",
      function: {
        name: "search",
        description: "Search for medical and health-related information only, including symptoms, diseases, treatments and health advice. Reject any non-medical queries.",
        parameters: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "Only accept medical or health-related search queries, such as symptoms, diseases, treatments or health concerns. Must reject any non-medical queries with a message explaining that this is a medical-only assistant."
            }
          },
          required: ["query"]
        },
      },
    }
  ];

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "你是一个专业的医疗助手，专门帮助用户解答医疗健康相关的问题。你必须：\n1. 只回答与医疗健康相关的问题\n2. 对于任何非医疗健康相关的问题（如宠物、娱乐、生活等），必须明确拒绝并说明：'抱歉，作为一个专业的医疗助手，我只能回答与医疗健康相关的问题。'\n3. 使用专业但易懂的语言\n4. 在必要时建议用户咨询医生\n5. 不做具体的诊断，而是提供健康指导"
        },
        ...messages
      ],
      tools,
      tool_choice: "auto",
    });

    // Check if tool_calls are present in the response
    const toolCalls = response.choices[0].message?.tool_calls;
    if (!toolCalls) {
      return new Response(JSON.stringify({ mode: "chat", arg: "" }), {
        status: 200,
      });
    }

    // Process the tool calls if present
    const firstToolCall = toolCalls[0];
    const modeAndArguments =
      Object.keys(firstToolCall.function.arguments).length === 2
        ? ""
        : firstToolCall.function.arguments;

    return new Response(
      JSON.stringify({
        mode: firstToolCall.function.name,
        arg: modeAndArguments,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error calling OpenAI:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process the input" }),
      { status: 500 }
    );
  }
}
