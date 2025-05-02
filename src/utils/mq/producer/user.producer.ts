import connectRabbitMQ from "../../../libs/rabbitmq.lib";

import errorMessage from "../../../helpers/errorMessage.helper";

const userProducer = async <T>(routingKey: string, message: T) => {
    try {
        const { connection, channel } = await connectRabbitMQ();
        const exchange = "user_exchange";
        await channel.assertExchange(exchange, "topic", { durable: true });
        channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)), { persistent: true });
        setTimeout(() => {
            connection.close();
        }, 500);
    } catch (error: any) {
        console.log("Error in userProducer: ", errorMessage(error));
    }
};

export default userProducer;