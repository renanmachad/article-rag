import { Kafka } from 'kafkajs';
import dotenv from 'dotenv';
import type { MessageProducer } from '../../../domain/message.producer.ts';
import { KAFKA_BROKER, KAFKA_PASSWORD, KAFKA_TOPIC_NAME, KAFKA_USERNAME } from '../../../config/kafka.ts';

dotenv.config();


const kafka = new Kafka({
    clientId: 'node-kafka-producer',
    brokers: [KAFKA_BROKER],
    ssl: true,
    sasl: {
        mechanism: 'plain',
        username: KAFKA_USERNAME,
        password: KAFKA_PASSWORD,
    },
});

class KafkaProducer {
    private topic: string;
    private producer;

    constructor(topic: string) {
        this.topic = topic;
        this.producer = kafka.producer();
    }

    async connect() {
        await this.producer.connect();
        console.log('✅ Kafka Producer is ready');
    }

    async sendMessage(message: MessageProducer) {
        try {
            await this.producer.send({
                topic: this.topic,
                messages: [{ value: JSON.stringify(message) }],
            });
            console.log('📤 Message sent to Kafka:', message);
        } catch (error) {
            console.error('❌ Failed to send message:', error);
        }
    }

    async disconnect() {
        await this.producer.disconnect();
        console.log('🛑 Kafka Producer disconnected');
    }
}

const kafkaProducer = new KafkaProducer(KAFKA_TOPIC_NAME);

export default kafkaProducer;
