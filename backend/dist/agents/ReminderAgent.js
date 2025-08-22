"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runReminderAgent = void 0;
const agents_1 = require("langchain/agents");
const openai_1 = require("langchain/chat_models/openai");
const NotionTool_1 = require("../tools/NotionTool");
const runReminderAgent = async (input) => {
    const tools = [new NotionTool_1.NotionTool()];
    const model = new openai_1.ChatOpenAI({ temperature: 0 });
    const executor = await (0, agents_1.initializeAgentExecutorWithOptions)(tools, model, {
        agentType: "zero-shot-react-description",
        verbose: true
    });
    const result = await executor.run(input);
    return result;
};
exports.runReminderAgent = runReminderAgent;
