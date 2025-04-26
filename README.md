# Article RAG

This project is a Node.js application that utilizes Fastify, Kafka, and Pinecone to process and store article data.
Have objetive to store article data in a database vector,
and when users interact with a prompt we made a RAG process to return an response about the articles

## Prerequisites

- Docker and Docker Compose installed
- Node.js and npm installed

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/article-rag.git
   cd article-rag
   ```

2. Create a `.env` file in the project root and add the following environment variables:
   ```env
   KAFKA_BROKER="your_kafka_broker_url"
   KAFKA_USERNAME="your_kafka_username"
   KAFKA_PASSWORD="your_kafka_password"
   KAFKA_TOPIC_NAME="news"
   KAFKA_GROUP_ID_PREFIX="test-task-1"
   GEMINI_API_KEY="your_gemini_api_key"
   PINECONE_STORE="your_pinecone_store_id"
   PINECONE_API_KEY="your_pinecone_api_key"
   PINECONE_ENVIRONMENT="your_pinecone_environment"
   ```

3. Start the application using Docker Compose:
   ```bash
   docker-compose up --build
   ```

4. Access the application at [http://localhost:8080](http://localhost:8080).

## Endpoints

### Process AI Queries
- **POST** `/agent`: Endpoint to process queries using AI.

### Health Check
- **GET** `/ping`: Endpoint to verify if the server is running.

## Dependencies

- Node.js
- Fastify
- Kafka
- Pinecone
- Google Generative AI

## Project Structure

- `src/` : Contains the application source code.
- `routes/` : Contains the application routes.
- `services/` : Contains services used by the application.
- `config/` : Contains application configuration files.

## Contribution
Feel free to open issues and pull requests to improve this project.

## License
This project is licensed under the MIT License.

