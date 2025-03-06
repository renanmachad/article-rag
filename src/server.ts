import Fastify, { fastify } from 'fastify';
import dotenv from 'dotenv';
import publishRoutes from './routes/publish.ts';
import kafkaConsumer from './services/database/kafka/consumer.ts';
import { queryAi } from './routes/query-question.ts';

dotenv.config();

const server = fastify()

server.register(publishRoutes)
server.register(queryAi)

// Fastify health check route
server.get('/ping', async () => 'pong\n');

// Start server
const start = async () => {
  try {
    await server.listen({ port: 8080, host: '0.0.0.0' });
    console.log('🚀 Server running at http://localhost:8080');
    await kafkaConsumer.start();
  } catch (err) {
    console.error('❌ Server startup error:', err);
    process.exit(1);
  }
};

start();
