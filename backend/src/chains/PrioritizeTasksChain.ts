import "../loadEnv";
import { LLMChain } from "langchain/chains";
import { PromptTemplate } from "langchain/prompts";
import { ChatOpenAI } from "langchain/chat_models/openai";

const model = new ChatOpenAI({ temperature: 0.5 });

const prompt = new PromptTemplate({
  template: "Given these tasks:\n\n{tasks}\n\nAssign each one a priority (high/medium/low) with reasoning. Give output as JSON array of objects with taskName,dueDate,priority,status.",
  inputVariables: ["tasks"]
});

export const prioritizeTasksChain = new LLMChain({
  llm: model,
  prompt
});
