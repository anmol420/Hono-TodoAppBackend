import connectRabbitMQ from "../../../../libs/rabbitmq.lib";
import {sendChangePasswordMail} from "../../../mailer/mailer";

import errorMessage from "../../../../helpers/errorMessage.helper";

const changePasswordConsumer = async () => {
    try {
        const {channel} = await connectRabbitMQ();
        const exchange = "user_exchange";
        await channel.assertExchange(exchange, "topic", {durable: true});
        const queue = await channel.assertQueue("changePassword", {durable: true});
        await channel.bindQueue(queue.queue, exchange, "user.password.changePassword");

        await channel.consume(queue.queue, async (message) => {
            if (message) {
                const decodedMessage = JSON.parse(message.content.toString());
                await sendChangePasswordMail(decodedMessage.email);
                channel.ack(message)
            } else {
                console.log("No Message Received");
            }
        }, {noAck: false});
    } catch (e: unknown) {
        console.log("Error sending Change Password Mail", errorMessage(e));
    }
};

export default changePasswordConsumer;