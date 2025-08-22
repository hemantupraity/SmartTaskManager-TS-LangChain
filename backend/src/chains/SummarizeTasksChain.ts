import "../loadEnv";
import { LLMChain } from "langchain/chains";
import { PromptTemplate } from "langchain/prompts";
import { ChatOpenAI } from "langchain/chat_models/openai";

const model = new ChatOpenAI({ temperature: 0 });

const prompt = new PromptTemplate({
  template: "Summarize the following tasks for the user(Don't add reminders and due dates to the output):\n\n{tasks}",
  inputVariables: ["tasks"]
});

export const summarizeTasksChain = new LLMChain({
  llm: model,
  prompt
});
