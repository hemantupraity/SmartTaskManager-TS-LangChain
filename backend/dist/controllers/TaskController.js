"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.triggerReminder = exports.prioritizeTasks = exports.summarizeTasks = void 0;
const SummarizeTasksChain_1 = require("../chains/SummarizeTasksChain");
const PrioritizeTasksChain_1 = require("../chains/PrioritizeTasksChain");
const ReminderAgent_1 = require("../agents/ReminderAgent");
const summarizeTasks = async (req, res) => {
    const tasks = req.body.tasks;
    const result = await SummarizeTasksChain_1.summarizeTasksChain.run({ tasks: JSON.stringify(tasks) });
    res.json({ summary: result });
};
exports.summarizeTasks = summarizeTasks;
const prioritizeTasks = async (req, res) => {
    const tasks = req.body.tasks;
    const result = await PrioritizeTasksChain_1.prioritizeTasksChain.run({ tasks: JSON.stringify(tasks) });
    res.json({ priorities: result });
};
exports.prioritizeTasks = prioritizeTasks;
const triggerReminder = async (req, res) => {
    const result = await (0, ReminderAgent_1.runReminderAgent)("Set reminder for high priority tasks today.");
    res.json({ agentResult: result });
};
exports.triggerReminder = triggerReminder;
