import { Router } from "express";
import { 
  summarizeTasks, 
  prioritizeTasks, 
  triggerReminder,
  getTasksFromNotion,
  addTaskToNotion, 
  updateTaskInNotion,
  deleteTaskFromNotion, 
 // suggestNextTask,
  suggestTask,
  getTaskById
} from "../controllers/TaskController";

const router = Router();

router.get("/", getTasksFromNotion);
router.post("/", addTaskToNotion);
router.put("/:id", updateTaskInNotion);
router.get("/:id", getTaskById);
router.delete("/:id", deleteTaskFromNotion);
router.post("/summarize/today", summarizeTasks);
router.post("/today-priority", prioritizeTasks);
// router.post("/suggest-next-task", suggestNextTask);
router.post("/suggest-task", suggestTask);
router.post("/generate-reminders", triggerReminder);

export default router;
