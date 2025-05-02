import { connect } from "amqplib";

const connectRabbitMQ = async () => {
    const connection = await connect(process.env.RABBITMQ_URL as string);
    const channel = await connection.createChannel();
    return { connection, channel };
};

export default connectRabbitMQ;