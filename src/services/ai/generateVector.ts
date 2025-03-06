import { GoogleGenerativeAI } from "@google/generative-ai";

// Function to generate a vector from the query text using Gemini API
async function generateVector(text: string) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
    const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
    const result = await model.embedContent(text);
    return result.embedding;
}

export default generateVector