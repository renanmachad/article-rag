

import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import { JSDOM } from "jsdom"
import { Readability } from "@mozilla/readability";
dotenv.config();

async function parseSiteContent(url: string): Promise<{
    dateOfSite: string | null | undefined,
    textContent: string | null | undefined
}> {

    try {
        const site = await fetch(url).then((res) => res.text())
        const document = new JSDOM(site, { url })
        const reader = new Readability(document.window.document).parse()
        console.log(reader)
        return {
            dateOfSite: reader?.publishedTime,
            textContent: reader?.textContent
        }
    } catch (err) {
        console.error(err)
        throw new Error("Error on parse site content")
    }
}

export async function parseLink(url: string) {

    const siteContent = await parseSiteContent(url)
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `Extract the title, content, and date from the following content and output it on json format: 
    {
      "title": "Article Title",
      "content": "Cleaned article content...",
      "url": "${url}",
      "date": "YYYY-MM-DD"
    }
     The content is ${siteContent?.textContent}, the url is ${url} and the date is ${siteContent.dateOfSite}
    `;

    try {
        const result = await model.generateContent(prompt);

        return result
    } catch (error) {
        console.error("Error extracting content from the URL:", error);
        return {
            title: "Unknown",
            content: "Unable to extract content.",
            url: url,
            date: "Unknown date",
        };
    }
}
