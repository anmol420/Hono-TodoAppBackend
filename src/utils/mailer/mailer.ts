import transporter from "../../libs/nodemailer.lib";

import errorMessage from "../../helpers/errorMessage.helper";

const sendRegistrationOTP = async (email: string, otp: string) => {
    try {
        await transporter.sendMail({
            from: '"ToDo" <testme2004.04@gmail.com>',
            to: email,
            subject: "Registration OTP",
            text: `Your OTP for registration is ${otp}`,
        });
    } catch (error: unknown) {
        console.log("Error sending Registration OTP email:", errorMessage(error));
    }
};

const sendRegistrationMail = async (email: string) => {
    try {
        await transporter.sendMail({
            from: '"ToDo" <testme2004.04@gmail.com>',
            to: email,
            subject: "Registration Success",
            text: `Registered Successfully.`,
        });
    } catch (error: unknown) {
        console.log("Error sending Registration Mail:", errorMessage(error));
    }
};

const sendForgotPasswordOTP = async (email: string, otp: string) => {
    try {
        await transporter.sendMail({
            from: '"ToDo" <testme2004.04@gmail.com>',
            to: email,
            subject: "Forgot Password OTP",
            text: `Your OTP for forgot password is ${otp}`,
        });
    } catch (error: unknown) {
        console.log("Error sending ForgotPassword OTP email:", errorMessage(error));
    }
}

const sendChangePasswordMail = async (email: string) => {
    try {
        await transporter.sendMail({
            from: '"ToDo" <testme2004.04@gmail.com>',
            to: email,
            subject: "Password Change Success",
            text: `Changed Password Successfully.`,
        });
    } catch (error: unknown) {
        console.log("Error sending Change Password Mail:", errorMessage(error));
    }
};

export {
    sendRegistrationOTP,
    sendRegistrationMail,
    sendForgotPasswordOTP,
    sendChangePasswordMail,
};