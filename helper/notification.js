const config = require("config");
const twilio = require("twilio");

const accountSid = config.get("accountSid");
const authToken = config.get("authToken");

const twilioConfig = twilio(accountSid, authToken, {
    lazyLoading: true
});

const generateOtp = async () => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp;
};

const sendBySms = async (data) => {
    try {
        const response = await twilioConfig.messages.create({
            to: '+91' + data.mobile_no,
            from: config.get("smsFromNumber"),
            body: data.body
        });
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

module.exports = { generateOtp, sendBySms }