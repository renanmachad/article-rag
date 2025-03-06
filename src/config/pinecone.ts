import { Pinecone } from "@pinecone-database/pinecone"
import dotenv from 'dotenv'
dotenv.config()

export const pineconeClient = new Pinecone({ apiKey: process.env.PINECONE_STORE as string })
