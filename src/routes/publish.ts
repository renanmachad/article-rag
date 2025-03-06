import type { FastifyInstance } from 'fastify';
import KafkaProducer from '../services/kafka/producer.ts';
import type { MessageConsumer } from '../domain/message.consumer.ts';
import saveInVectorStore from '../services/saveInVectorStore.ts';

export default async function publishRoutes(server: FastifyInstance) {
    server.post('/publish', async (request, reply) => {
        const message = request.body as MessageConsumer;

        try {
            // Verificar se a propriedade 'url' está presente
            if (!message.value?.url) {
                throw new Error("A propriedade 'url' está ausente no objeto 'value'.");
            }

            await KafkaProducer.connect();
            await saveInVectorStore(message);
            const response = await KafkaProducer.sendMessage(message);
            return reply.send(response);

        } catch (error) {
            server.log.error(error);
            console.log(`erro ao enviar mensagem`, error);
            return reply.code(500).send(error);
        }
    });
}



