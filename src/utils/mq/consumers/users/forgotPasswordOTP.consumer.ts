import connectRabbitMQ from "../../../../libs/rabbitmq.lib";
import {sendForgotPasswordOTP} from "../../../mailer/mailer";

import errorMessage from "../../../../helpers/errorMessage.helper";

const forgotPasswordOTPConsumer = async () => {
    try {
        const {channel} = await connectRabbitMQ();
        const exchange = "user_exchange";
        await channel.assertExchange(exchange, "topic", {durable:true});
        const queue = await channel.assertQueue("forgotPassword_otp", {durable:true});
        await channel.bindQueue(queue.queue, exchange, "user.password.forgotPasswordOTP");

        await channel.consume(queue.queue, async (message) => {
            if (message) {
                const decodedMessage = JSON.parse(message.content.toString());
                await sendForgotPasswordOTP(decodedMessage.email, decodedMessage.otp);
                channel.ack(message);
            } else {
                console.log("No Message Received");
            }
        }, {noAck: false});
    } catch (e: unknown) {
        console.log("Error sending Forgot Password consumer", errorMessage(e));
    }
};

export default forgotPasswordOTPConsumer;