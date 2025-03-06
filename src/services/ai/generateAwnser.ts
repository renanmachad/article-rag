import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";  // Import Gemini API
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

async function generateAnswer(query: string, sources: any) {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    console.log(sources);

    const prompt = `Answer the following query using the provided sources:\n\nQuery: "${query}"\n\nSources:\nTitle: ${sources.title}\nDate: ${new Date(parseInt(sources.date)).toLocaleString()}\nURL: ${sources.url}\nContent: ${sources.content}`;

    const result = await model.generateContent(prompt);

    return result; // This should return a relevant answer to the query
}

export default generateAnswer;