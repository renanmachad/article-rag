import type { GenerateContentResult } from "@google/generative-ai";
import type { MessageConsumer } from "../domain/message.consumer.ts";
import { parseLink } from "./ai/parseLink.ts";
import storeInPinecone from "./database/pinecone.ts";
import { generateEmbedding } from "./ai/generateEmbeddings.ts";

async function saveInVectorStore(message: MessageConsumer) {
    console.log(message);

    // Verificar se a propriedade 'url' está presente
    if (!message.value?.url) {
        throw new Error("A propriedade 'url' está ausente no objeto 'value'.");
    }

    console.log(message);
    const extractedText = await parseLink(message.value.url) as GenerateContentResult;
    console.log(`📄 Extracted text:`, extractedText.response.text());

    const extractedTextString = await extractedText.response.text();
    console.log(`📄 Extracted text string:`, extractedTextString);

    // Limpar o texto extraído para remover caracteres inválidos
    const cleanedTextString = extractedTextString.replace(/```json|```/g, '').trim();

    let extractedTextJson;
    try {
        extractedTextJson = JSON.parse(cleanedTextString);
    } catch (error) {
        console.error("Erro ao analisar o texto extraído como JSON:", error);
        throw new Error("O texto extraído não é um JSON válido.");
    }

    // Verificar se o JSON extraído possui a propriedade 'title'
    if (!extractedTextJson.title) {
        throw new Error("O JSON extraído não possui a propriedade 'title'.");
    }

    const embedding = await generateEmbedding(cleanedTextString);

    await storeInPinecone(message.value.url, embedding.values, extractedTextJson.title);
}

export default saveInVectorStore;