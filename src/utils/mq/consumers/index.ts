import registerMailConsumer from "./users/registerMail.consumer";
import registerMailOTPConsumer from "./users/registerMailOTP.consumer";
import forgotPasswordOTPConsumer from "./users/forgotPasswordOTP.consumer";
import changePasswordConsumer from "./users/changePassword.consmer";

const startConsumer = async () => {
    await registerMailConsumer();
    await registerMailOTPConsumer();
    await forgotPasswordOTPConsumer();
    await changePasswordConsumer();
};

export default startConsumer;