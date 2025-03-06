import dotenv from 'dotenv';

dotenv.config();

// Kafka configuration
export const KAFKA_BROKER = process.env.KAFKA_BROKER || "pkc-ewzgj.europe-west4.gcp.confluent.cloud:9092";
export const KAFKA_USERNAME = process.env.KAFKA_USERNAME || "OXQDOMDXAEIPZDEG";
export const KAFKA_PASSWORD = process.env.KAFKA_PASSWORD || "Rq9Jv5kKr4kfMTG0xkJZazgwOIKqduM+vbXjyxBK9EpE7FDLbcMRcbbx17TYEhZm";
export const KAFKA_TOPIC_NAME = process.env.KAFKA_TOPIC_NAME || "news";
export const KAFKA_GROUP_ID = process.env.KAFKA_GROUP_ID_PREFIX ? `${process.env.KAFKA_GROUP_ID_PREFIX}-consumer` : "test-task-consumer";


