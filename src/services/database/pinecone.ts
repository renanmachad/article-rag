import { Pinecone } from '@pinecone-database/pinecone'
import { pineconeClient } from '../../config/pinecone.ts';



const storeInPinecone = async (url: string, embedding: number[], title: string) => {
    try {
        const pc = pineconeClient
        const pineconeIndex = pineconeClient.Index('news');
        await pineconeIndex.upsert([
            {
                id: `url-${Date.now()}`,
                values: embedding,
                metadata: { url, date: Date.now().toString(), title },
            },
        ]);
        console.log(`✅ Successfully stored URL with embedding: ${url}`);
    } catch (error) {
        console.error('❌ Error storing in Pinecone:', error);
    }
};

export default storeInPinecone