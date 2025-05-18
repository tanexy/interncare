import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error('Missing Gemini API key');
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

export async function generateAISuggestions(
  healthData: any[],
  moodEntries: any[],
  tasks: any[]
) {
  try {
    const context = {
      recentHealth: healthData.slice(-7),
      recentMood: moodEntries.slice(-7),
      recentTasks: tasks.slice(-7),
    };

    const prompt = `
      As a wellness and productivity assistant, analyze this user's recent data and provide personalized suggestions:
      
      Health Data (last 7 days): ${JSON.stringify(context.recentHealth)}
      Mood Entries (last 7 days): ${JSON.stringify(context.recentMood)}
      Tasks (last 7 days): ${JSON.stringify(context.recentTasks)}
      
      Based on this data, provide 3 specific, actionable suggestions for improving their wellbeing and productivity.
      Format the response as a JSON array of objects with 'type', 'message', and 'priority' properties.
      Types can be: 'sleep', 'stress', 'productivity', 'water', 'exercise', or 'general'.
      Priority can be: 'low', 'medium', or 'high'.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const suggestions = JSON.parse(response.text());

    return suggestions;
  } catch (error) {
    console.error('Error generating AI suggestions:', error);
    return [];
  }
}