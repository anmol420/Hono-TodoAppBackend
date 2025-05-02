import connectRabbitMQ from "../../../../libs/rabbitmq.lib";
import {sendRegistrationOTP} from "../../../mailer/mailer";

import errorMessage from "../../../../helpers/errorMessage.helper";

const registerMailOTPConsumer = async () => {
    try {
        const { channel } = await connectRabbitMQ();
        const exchange = "user_exchange";
        await channel.assertExchange(exchange, "topic", { durable: true });
        const queue = await channel.assertQueue("registration_otp", { durable: true });
        await channel.bindQueue(queue.queue, exchange, "user.register.registrationOTP");

        await channel.consume(queue.queue, async (message) => {
            if (message) {
                const decodedMessage = JSON.parse(message.content.toString());
                await sendRegistrationOTP(decodedMessage.email, decodedMessage.otp);
                channel.ack(message);
            } else {
                console.log("No Message Received");
            }
        }, {noAck: false});
    } catch (e: any) {
        console.log("Error sending Registration OTP consumer", errorMessage(e));
    }
};

export default registerMailOTPConsumer;