import { Request, Response } from "express";
import { summarizeTasksChain } from "../chains/SummarizeTasksChain";
import { prioritizeTasksChain } from "../chains/PrioritizeTasksChain";
import { suggestTaskChain } from "../chains/SuggestTaskChain";
import { suggestNextTaskWithLangChain } from "../agents/ReminderAgent";
import { Client } from "@notionhq/client";
import dotenv from "dotenv";
import { ChatOpenAI } from "@langchain/openai";
// import { HumanMessage } from "@langchain/core/messages";

dotenv.config();

const model = new ChatOpenAI({
  temperature: 0.7,
  openAIApiKey: process.env.OPENAI_API_KEY,
});

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_DATABASE_ID!;

export const summarizeTasks = async (req: Request, res: Response) => {
  const tasks = req.body.tasks;
  const result = await summarizeTasksChain.invoke({ tasks: JSON.stringify(tasks) });
  res.json({ summary: result });
};

export const prioritizeTasks = async (req: Request, res: Response) => {
  const tasks = req.body.tasks;
  const result = await prioritizeTasksChain.invoke({ tasks: JSON.stringify(tasks) });
  res.json({ priorities: result.text });
};

export const getTasksFromNotionInternal = async () => {
  const response = await notion.databases.query({
    database_id: databaseId,
  });

  return response.results.map((page: any) => {
    const props = page.properties;
    return {
      id: page.id,
      taskName: props["Title"]?.title?.[0]?.text?.content || "",
      status: props["Status"]?.rich_text?.[0]?.text?.content || "",
      priority: props["Priority"]?.rich_text?.[0]?.text?.content || "",
      notes: props["Notes"]?.rich_text?.[0]?.text?.content || "",
      dueDate: props["DueDate"]?.date?.start || null,
      reminder: props["Reminder"]?.date?.start || null,
    };
  });
};

// export const suggestNextTask = async (req: Request, res: Response) => {
//   try {
//     const tasks = await getTasksFromNotionInternal();
//     const pendingTasks = tasks.filter((task) => task.status === "ToDo");

//     if (pendingTasks.length === 0) {
//       return res.status(200).json({
//         suggestion: {
//           suggestedTask: "No tasks available",
//           reason: "All tasks are either completed or missing.",
//         },
//       });
//     }

//     // Format tasks for the chain
//     const taskStrings = pendingTasks.map(
//       (t) => `- ${t.taskName} (Priority: ${t.priority || 'none'}, Due: ${t.dueDate || 'no due date'})`
//     ).join('\n');

//     // The chain now returns a parsed object, no need to parse again
//     const suggestion = await suggestTaskChain.call({ tasks: taskStrings });

//     res.json({
//       suggestion: {
//         suggestedTask: suggestion.taskName,
//         reason: suggestion.reason,
//       },
//     });
//   } catch (error) {
//     console.error('Error in suggestNextTask:', error);
//     res.status(500).json({
//       error: 'Failed to suggest next task',
//       details: error instanceof Error ? error.message : 'Unknown error'
//     });
//   }
// };

// New endpoint for chain-based suggestion
export const suggestTask = async (req: Request, res: Response) => {
  try {
    const { tasks } = req.body;
    
    if (!tasks || !Array.isArray(tasks)) {
      console.error('Invalid tasks data received:', tasks);
      return res.status(400).json({ error: 'Tasks array is required' });
    }

    if (tasks.length === 0) {
      console.log('No tasks provided, returning default suggestion');
      return res.json({
        suggestion: {
          suggestedTask: "No tasks available",
          reason: "Please add some tasks to get suggestions."
        }
      });
    }

    // Format tasks for the chain
    const taskStrings = tasks.map(
      (t: any) => `- ${t.taskName || 'Unnamed task'} (Priority: ${t.priority || 'none'}, Due: ${t.dueDate || 'no due date'})`
    ).join('\n');

    console.log('Formatted tasks for chain:', taskStrings);

    // The chain returns a parsed object, no need to parse again
    console.log('Calling suggestTaskChain...');
    const suggestion = await suggestTaskChain.call({ tasks: taskStrings });
    console.log('Received suggestion from chain:', JSON.stringify(suggestion, null, 2));

    const response = {
      suggestion: {
        suggestedTask: suggestion?.taskName || "No task suggested",
        reason: suggestion?.reason || "No reason provided"
      }
    };

    console.log('Sending response:', JSON.stringify(response, null, 2));
    res.json(response);
  } catch (error) {
    console.error('Error in suggestTask:', error);
    res.status(500).json({
      error: 'Failed to suggest task',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const triggerReminder = async (req: Request, res: Response) => {
  const result = await suggestNextTaskWithLangChain(req.body.tasks);
  res.json({ agentResult: result });
};

export const getTasksFromNotion = async (_req: Request, res: Response) => {
  try {
    const response = await notion.databases.query({ database_id: databaseId });
    const tasks = response.results.map((page: any) => ({
      id: page.id,
      taskName: page.properties.Title?.title?.[0]?.text?.content || 'Untitled',
      notes: page.properties.Notes?.rich_text?.[0]?.text?.content || '',
      dueDate: page.properties.DueDate?.date?.start || null,
      priority: page.properties.Priority?.rich_text?.[0]?.text?.content || '',
      status: page.properties.Status?.rich_text?.[0]?.text?.content || '',
      reminder: page.properties.Reminder?.date?.start || null,
    }));
    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

export const addTaskToNotion = async (req: Request, res: Response) => {
  try {
    const { taskName, status, priority, notes, dueDate, reminder } = req.body;

    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        Title: {
          title: [
            {
              text: {
                content: taskName,
              },
            },
          ],
        },
        Status: {
          rich_text: [
            {
              text: {
                content: status || '',
              },
            },
          ],
        },
        Priority: {
          rich_text: [
            {
              text: {
                content: priority || '',
              },
            },
          ],
        },
        Notes: {
          rich_text: [
            {
              text: {
                content: notes || "",
              },
            },
          ],
        },
        DueDate: {
          date: dueDate ? { start: dueDate } : null,
        },
        Reminder: {
          date: reminder ? { start: reminder } : null,
        },
      },
    });

    res.status(201).json({ id: response.id });
  } catch (error) {
    console.error("❌ Error adding task to Notion:", error);
    res.status(500).json({ message: "Failed to add task" });
  }
};

export const updateTaskInNotion = async (req: Request, res: Response) => {
  console.log("updateTaskInNotion", req);
  try {
    const { id, taskName, status, priority, notes, dueDate, reminder } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Task ID is required" });
    }

    const response = await notion.pages.update({
      page_id: id,
      properties: {
        ...(taskName && {
          Title: {
            title: [
              {
                text: {
                  content: taskName,
                },
              },
            ],
          },
        }),
        ...(status !== undefined && {
          Status: {
            rich_text: [
              {
                text: {
                  content: status || '',
                },
              },
            ],
          },
        }),
        ...(priority !== undefined && {
          Priority: {
            rich_text: [
              {
                text: {
                  content: priority || '',
                },
              },
            ],
          },
        }),
        ...(notes !== undefined && {
          Notes: {
            rich_text: [
              {
                text: {
                  content: notes || '',
                },
              },
            ],
          },
        }),
        ...(dueDate !== undefined && {
          DueDate: {
            date: dueDate ? { start: dueDate } : null,
          },
        }),
        ...(reminder !== undefined && {
          Reminder: {
            date: reminder ? { start: reminder } : null,
          },
        }),
      },
    });

    res.status(200).json({ id: response.id });
  } catch (error) {
    console.error("Error updating task in Notion:", error);
    res.status(500).json({ message: "Failed to update task" });
  }
};


export const getTaskById = async (req: Request, res: Response) => {
  try {
    const pageId = req.params.id;
    const response = await notion.pages.retrieve({ page_id: pageId });
    res.json(response);
  } catch (error) {
    console.error("Error fetching task:", error);
    res.status(500).json({ message: "Failed to fetch task" });
  }
};

export const deleteTaskFromNotion = async (req: Request, res: Response) => {
  try {
    const pageId = req.params.id;
    await notion.pages.update({
      page_id: pageId,
      archived: true,
    });
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Failed to delete task" });
  }
};
