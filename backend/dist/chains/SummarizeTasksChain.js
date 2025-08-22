"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.summarizeTasksChain = void 0;
const chains_1 = require("langchain/chains");
const prompts_1 = require("langchain/prompts");
const openai_1 = require("langchain/chat_models/openai");
const model = new openai_1.ChatOpenAI({ temperature: 0 });
const prompt = new prompts_1.PromptTemplate({
    template: "Summarize the following tasks for the user:\n\n{tasks}",
    inputVariables: ["tasks"]
});
exports.summarizeTasksChain = new chains_1.LLMChain({
    llm: model,
    prompt
});
