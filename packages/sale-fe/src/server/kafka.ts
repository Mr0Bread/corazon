import { Kafka } from "@upstash/kafka";
import { env } from "~/env.mjs";

export const createNewProductsProducer = () => {
  const kafka = new Kafka({
    url: env.UPSTASH_KAFKA_REST_URL,
    username: env.UPSTASH_KAFKA_REST_USERNAME,
    password: env.UPSTASH_KAFKA_REST_PASSWORD,
  });

  return kafka.producer();
}

export const createNewProductsConsumer = () => {
  const kafka = new Kafka({
    url: env.UPSTASH_KAFKA_REST_URL,
    username: env.KAFKA_CONSUME_NEW_PRODUCTS_USERNAME,
    password: env.KAFKA_CONSUME_NEW_PRODUCTS_PASSWORD,
  });

  return kafka.consumer();
}