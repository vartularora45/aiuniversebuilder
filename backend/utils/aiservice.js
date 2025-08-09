import mockAI from './mockAI.js';
import dotenv from 'dotenv';
dotenv.config();
// Check if Gemini is available
const hasGemini = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== '';

let genAI = null;
let model = null;

if (hasGemini) {
  const { GoogleGenerativeAI } = await import('@google/generative-ai');
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
 const tryModels = ["gemini-1.5-flash", "gemini-2.0-flash", "gemini-pro"];
for (const m of tryModels) {
  try {
    const testModel = genAI.getGenerativeModel({ model: m });
    // simple ping test
    await testModel.generateContent("Ping test");
    model = testModel;
    console.log(`Using model: ${m}`);
    break;
  } catch (e) {
    console.warn(`Model ${m} not available:`, e.message);
  }
}

}

/**
 * Generate follow-up questions based on initial prompt
 */
export const generateQuestions = async (prompt, context = {}) => {
  if (hasGemini && model) {
    return await generateQuestionsWithGemini(prompt, context);
  } else {
    console.log('Using mock AI for question generation');
    return mockAI.generateQuestions(prompt, context);
  }
};

/**
 * Generate flow structure from questions and answers
 */
export const generateFlowStructure = async (questions, answers, initialPrompt) => {
  if (hasGemini && model) {
    return await generateFlowWithGemini(questions, answers, initialPrompt);
  } else {
    console.log('Using mock AI for flow generation');
    return mockAI.generateFlowStructure(questions, answers, initialPrompt);
  }
};

/**
 * Generate questions using Gemini Pro
 */
const generateQuestionsWithGemini = async (prompt, context) => {
  try {
    const systemPrompt = `You are an AI assistant that helps create chatbots. Based on the user's initial prompt, generate 3-5 relevant follow-up questions that would help understand their requirements better. 

Context: ${JSON.stringify(context)}

Return your response as a JSON array of objects with this structure:
[
  {
    "question": "The follow-up question",
    "type": "text|number|boolean|choice|email|phone",
    "priority": 1-5,
    "context": "Why this question is important",
    "choices": ["option1", "option2"]
  }
]

User Prompt: ${prompt}`;

    const result = await model.generateContent(systemPrompt);
    const content = result.response.text();
    
    try {
      // Clean the response to extract JSON
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON array found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', parseError);
      console.log('Raw response:', content);
      // Fallback to mock AI
      return mockAI.generateQuestions(prompt, context);
    }

  } catch (error) {
    console.error('Gemini API error:', error);
    // Fallback to mock AI
    return mockAI.generateQuestions(prompt, context);
  }
};

/**
 * Generate flow structure using Gemini Pro
 */
const generateFlowWithGemini = async (questions, answers, initialPrompt) => {
  try {
    const systemPrompt = `You are an AI assistant that creates chatbot flow structures. Based on the initial prompt, questions, and answers provided, create a logical flow structure.

Return a JSON object with this structure:
{
  "nodes": [
    {
      "id": "unique-id",
      "type": "start|question|condition|action|end",
      "data": {
        "label": "Node label",
        "question": "Question text",
        "expectedAnswerType": "text|number|boolean|choice|email|phone",
        "choices": ["option1", "option2"]
      },
      "position": {"x": 100, "y": 100}
    }
  ],
  "edges": [
    {
      "id": "edge-id",
      "source": "source-node-id",
      "target": "target-node-id",
      "label": "Connection label"
    }
  ]
}

Initial Prompt: ${initialPrompt}
Questions: ${JSON.stringify(questions)}
Answers: ${JSON.stringify(answers)}`;

    const result = await model.generateContent(systemPrompt);
    const content = result.response.text();
    
    try {
      // Clean the response to extract JSON
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON object found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse Gemini flow response:', parseError);
      console.log('Raw response:', content);
      // Fallback to mock AI
      return mockAI.generateFlowStructure(questions, answers, initialPrompt);
    }

  } catch (error) {
    console.error('Gemini flow generation error:', error);
    // Fallback to mock AI
    return mockAI.generateFlowStructure(questions, answers, initialPrompt);
  }
};

/**
 * Alternative: Generate content with retry mechanism
 */
const generateWithRetry = async (prompt, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error);
      if (i === maxRetries - 1) throw error;
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
};


export default {
  generateQuestions,
    generateFlowStructure,
    generateQuestionsWithGemini,
    generateFlowWithGemini,
    generateWithRetry
};