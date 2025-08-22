import { LLMChain, LLMChainInput } from "langchain/chains";
import { PromptTemplate } from "langchain/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { OutputFixingParser, StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";

// Define the schema for the response
const responseSchema = z.object({
  taskName: z.string().describe("The name of the suggested task"),
  reason: z.string().describe("The reason for choosing this task")
});

// Create a parser for the response
const parser = StructuredOutputParser.fromZodSchema(responseSchema);

const model = new ChatOpenAI({ 
  temperature: 0.7,
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: "gpt-4"
});

const promptTemplate = `You are a task prioritization assistant. 

Tasks to analyze (DO NOT include tasks with Status "Done" or "In Progress"):
{tasks}

Instructions:
1. First, filter out any tasks with Status "Done" or "In Progress"
2. From the remaining tasks, find the most important one based on:
   - Task priority (High > Medium > Low)
   - Due date (sooner is more important)
   - Task complexity and time required
3. Return a valid JSON object with 'taskName' and 'reason' fields
4. The taskName must exactly match one of the tasks provided
5. The reason should explain why this task was chosen, including its priority and due date if available

Example of valid response format:
{{"taskName": "Complete project proposal", "reason": "This is a high priority task due tomorrow"}}

Your response must be valid JSON. Only return the JSON object, nothing else.`;

const prompt = new PromptTemplate({
  template: promptTemplate,
  inputVariables: ["tasks"],
});

// Custom chain that handles the output parsing
class SuggestTaskChain extends LLMChain {
  constructor(fields: Omit<LLMChainInput, 'prompt' | 'llm'>) {
    super({
      ...fields,
      prompt,
      llm: model,
    });
  }

  async _call(values: Record<string, any>): Promise<any> {
    try {
      console.log('Input to LLM chain:', values);
      const result = await super._call(values);
      console.log('Raw LLM response:', result.text);
      
      // Try to parse the response
      try {
        // Clean up the response to handle markdown code blocks
        let cleanedText = result.text.trim();
        if (cleanedText.startsWith('```json')) {
          cleanedText = cleanedText.replace(/^```(?:json)?\n|\n```$/g, '').trim();
        }
        
        const parsed = JSON.parse(cleanedText);
        // Validate against our schema
        const validated = responseSchema.parse(parsed);
        return validated;
      } catch (parseError) {
        console.error('Error parsing LLM response:', parseError);
        throw new Error(`Failed to parse LLM response: ${parseError}`);
      }
    } catch (error) {
      console.error('Error in SuggestTaskChain._call:', error);
      throw error;
    }
  }
}

export const suggestTaskChain = new SuggestTaskChain({
  verbose: true,
});
