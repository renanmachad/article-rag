
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv'

dotenv.config()

export async function generateEmbedding(content: string) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

    const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
    const result = await model.embedContent(content);
    return result.embedding;
}