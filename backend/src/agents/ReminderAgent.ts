import { HuggingFaceInference } from "@langchain/community/llms/hf";
import dotenv from "dotenv";
import { Task } from "../types/BaseTask";

dotenv.config();

const model = new HuggingFaceInference({
  model: "mistralai/Mistral-7B-Instruct-v0.2",
  apiKey: process.env.HUGGINGFACE_API_TOKEN,
  temperature: 0.3,
  maxTokens: 200,
  maxRetries: 2,
});

interface SmartReminder {
  taskName: string;
  reason: string;
  priority?: string;
  dueDate?: string;
}

function formatTasksForPrompt(tasks: Task[]): string {
  return tasks.map(task => {
    const due = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date";
    const notes = task.notes ? `Notes: ${task.notes.slice(0, 50)}${task.notes.length > 50 ? "..." : ""}` : "";
    return `- ${task.taskName} (Priority: ${task.priority}, Due: ${due}, Status: ${task.status})\n  ${notes}`;
  }).join("\n\n");
}

function parseModelResponse(response: string): SmartReminder[] {
  try {
    // Try to extract JSON array from the response
    const jsonMatch = response.match(/\[\s*\{[\s\S]*\}\s*\]/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(item => ({
          taskName: item.taskName || 'Unknown Task',
          reason: item.reason || 'No reason provided',
          priority: item.priority,
          dueDate: item.dueDate
        }));
      }
    }
    
    // Fallback to single object extraction if array not found
    const singleMatch = response.match(/\{[\s\S]*\}/);
    if (singleMatch) {
      const parsed = JSON.parse(singleMatch[0]);
      return [{
        taskName: parsed.taskName || parsed.suggestedTask || 'Unknown Task',
        reason: parsed.reason || 'No reason provided',
        priority: parsed.priority,
        dueDate: parsed.dueDate
      }];
    }
    
    console.warn("Could not parse model response as JSON, falling back to text extraction");
    const taskMatch = response.match(/taskName[\s:]*"?([^\n"]+)"?/i) || 
                     response.match(/suggestedTask[\s:]*"?([^\n"]+)"?/i);
    const reasonMatch = response.match(/reason[\s:]*"?([^\n"]+)"?/i);
    
    return [{
      taskName: taskMatch?.[1]?.trim() || 'Unknown Task',
      reason: reasonMatch?.[1]?.trim() || 'No reason provided',
      priority: response.match(/priority[\s:]*"?([^\n"]+)"?/i)?.[1]?.trim(),
      dueDate: response.match(/dueDate[\s:]*"?([^\n"]+)"?/i)?.[1]?.trim()
    }];
  } catch (e) {
    console.warn("Failed to parse model response:", e);
    return [{
      taskName: 'Error parsing response',
      reason: 'Failed to parse model response',
      priority: 'Medium'
    }];
  }
}

function getFallbackSuggestion(tasks: Task[]): SmartReminder[] {
  const priorityRank = { High: 1, Medium: 2, Low: 3 };
  const sorted = [...tasks].sort((a, b) => {
    const priorityDiff = priorityRank[a.priority as keyof typeof priorityRank] - priorityRank[b.priority as keyof typeof priorityRank];
    return priorityDiff || (new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  });

  return sorted.slice(0, 5).map(task => ({
    taskName: task.taskName,
    reason: `Suggested based on priority (${task.priority}) and due date (${new Date(task.dueDate).toLocaleDateString()})`,
    priority: task.priority,
    dueDate: task.dueDate
  }));
}

export async function suggestNextTaskWithLangChain(tasks: Task[]): Promise<SmartReminder[]> {
  if (!tasks?.length) return [{ 
    taskName: 'No tasks available', 
    reason: 'There are no tasks to analyze.' 
  }];

  const active = tasks.filter(t => t.status !== "Done");
  if (!active.length) return [{ 
    taskName: 'All tasks completed!', 
    reason: 'All tasks are marked as done.' 
  }];

  try {
    const formatted = formatTasksForPrompt(active);
    const prompt = `You are an AI task assistant. Your role is to analyze the given tasks and suggest the top 5 next best tasks to work on.
    
Consider the following in order of importance:
1. Priority (High > Medium > Low)
2. Due date (sooner first)
3. Status (prefer "In Progress" over "To Do" if priority is same)

Tasks to analyze:
${formatted}

Respond with a JSON array of objects. Each object should have:
- taskName: The name of the task
- reason: Your reasoning for suggesting this task
- priority: The task's priority (High/Medium/Low)
- dueDate: The task's due date (if available)

Example response:
[
  {
    "taskName": "Complete project proposal",
    "reason": "High priority and due soon",
    "priority": "High",
    "dueDate": "2023-06-01"
  }
]`;

    const response = await model.invoke(prompt);
    const reminders = parseModelResponse(response);
    
    // If no valid reminders were parsed, fall back to a simple priority sort
    if (!reminders.length) {
      console.log("Falling back to priority-based sorting");
      return getFallbackSuggestion(active);
    }
    
    return reminders;
  } catch (err) {
    console.error("LangChain error:", err);
    // Fallback to basic sorting if there's an error
    return active
      .sort((a, b) => (a.priority > b.priority ? -1 : 1))
      .slice(0, 3)
      .map(task => ({
        taskName: task.taskName,
        reason: `Suggested based on priority (${task.priority})`,
        priority: task.priority,
        dueDate: task.dueDate
      }));
  }
}
