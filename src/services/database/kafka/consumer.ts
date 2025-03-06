import { Kafka, type EachMessagePayload } from 'kafkajs';
import dotenv from 'dotenv';
import type { MessageConsumer } from '../../../domain/message.consumer.ts';
import storeInPinecone from '../pinecone.ts';
import { parseLink } from '../../ai/parseLink.ts';
import { generateEmbedding } from '../../ai/generateEmbeddings.ts';
import { KAFKA_BROKER, KAFKA_USERNAME, KAFKA_PASSWORD, KAFKA_TOPIC_NAME, KAFKA_GROUP_ID } from '../../../config/kafka.ts';
import type { GenerateContentResult } from '@google/generative-ai';
import saveInVectorStore from '../../saveInVectorStore.ts';

dotenv.config();


const kafka = new Kafka({
    clientId: 'node-kafka-consumer',
    brokers: [KAFKA_BROKER],
    ssl: true,
    sasl: {
        mechanism: 'plain',
        username: KAFKA_USERNAME,
        password: KAFKA_PASSWORD,
    },
});

class KafkaConsumer {
    private topic: string;
    private groupId: string;
    private consumer;

    constructor(topic: string, groupId: string) {
        this.topic = topic;
        this.groupId = groupId;
        this.consumer = kafka.consumer({ groupId: this.groupId });
    }

    async start() {
        try {
            await this.consumer.connect();
            await this.consumer.subscribe({ topic: this.topic, fromBeginning: true });
            console.log(`✅ Consuming messages from topic '${this.topic}'...`);

            await this.consumer.run({
                eachMessage: async ({ topic, partition, message }: EachMessagePayload) => {
                    try {
                        const parsedMessage: MessageConsumer = {
                            event: message.key?.toString() || '',
                            value: {
                                url: message.value?.toString() || ''
                            }
                        };
                        await saveInVectorStore(parsedMessage);
                    } catch (error) {
                        console.error("❌ Error parsing message:", error);
                    }
                },
            });
        } catch (error) {
            console.error("❌ Kafka Consumer error:", error);
        }
    }

    async shutdown() {
        console.log("\nShutting down consumer...");
        await this.consumer.disconnect();
        process.exit(0);
    }
}

const kafkaConsumer = new KafkaConsumer(KAFKA_TOPIC_NAME, KAFKA_GROUP_ID);
export default kafkaConsumer

