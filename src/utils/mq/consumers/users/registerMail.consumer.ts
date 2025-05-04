import connectRabbitMQ from "../../../../libs/rabbitmq.lib";
import { sendRegistrationMail } from "../../../mailer/mailer";

import errorMessage from "../../../../helpers/errorMessage.helper";

const registerMailConsumer = async () => {
    try {
        const { channel } = await connectRabbitMQ();
        const exchange = "user_exchange";
        await channel.assertExchange(exchange, "topic", { durable: true });
        const queue = await channel.assertQueue("register_mail", { durable: true });
        await channel.bindQueue(queue.queue, exchange, "user.register.welcomeMessage");

        await channel.consume(queue.queue, async (message) => {
            if (message) {
                const decodeMail = JSON.parse(message.content.toString());
                await sendRegistrationMail(decodeMail.email);
                channel.ack(message);
            } else {
                console.log("No Message Received");
            }
        }, {noAck: false});
    } catch (error: any) {
        console.log("Error in userProducer: ", errorMessage(error));
    }
};

export default registerMailConsumer;