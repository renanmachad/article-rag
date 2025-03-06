import type { FastifyInstance } from "fastify";
import generateVector from "../services/ai/generateVector.ts";
import { pineconeClient } from "../config/pinecone.ts";
import generateAnswer from "../services/ai/generateAwnser.ts";

export async function queryAi(server: FastifyInstance) {
    server.post("/agent", async (request, reply) => {
        const { query } = request.body as { query: string };

        const queryVector = await generateVector(query);
        console.log(queryVector);

        const pc = pineconeClient.Index("news");
        const queryResponse = await pc.query({
            vector: queryVector.values,
            topK: 10,  // Number of relevant results to fetch
            includeMetadata: true,
        });

        if (!queryResponse.matches || queryResponse.matches.length === 0) {
            reply.status(404).send({ error: "No matches found" });
            return;
        }

        const metadata = queryResponse.matches[0].metadata;
        if (!metadata) {
            reply.status(500).send({ error: "Metadata is missing in the response" });
            return;
        }

        const answer = await generateAnswer(query, metadata);

        // Step 4: Send the response with the generated answer and sources
        reply.send({
            answer,
            sources: metadata
        });
    });
}