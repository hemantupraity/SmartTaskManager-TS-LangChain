"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prioritizeTasksChain = void 0;
const chains_1 = require("langchain/chains");
const prompts_1 = require("langchain/prompts");
const openai_1 = require("langchain/chat_models/openai");
const model = new openai_1.ChatOpenAI({ temperature: 0.5 });
const prompt = new prompts_1.PromptTemplate({
    template: "Given these tasks:\n\n{tasks}\n\nAssign each one a priority (high/medium/low) with reasoning.",
    inputVariables: ["tasks"]
});
exports.prioritizeTasksChain = new chains_1.LLMChain({
    llm: model,
    prompt
});
