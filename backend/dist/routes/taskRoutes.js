"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const TaskController_1 = require("../controllers/TaskController");
const router = (0, express_1.Router)();
router.post("/summarize", TaskController_1.summarizeTasks);
router.post("/prioritize", TaskController_1.prioritizeTasks);
router.post("/reminder", TaskController_1.triggerReminder);
exports.default = router;
