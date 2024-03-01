const otpGenerator = require('otp-generator');
const OTP = require('../Utils/OtpSchema');
const Schemas = require('../MongoDB/Schema');

exports.sendOTP = async (req, res) => {
    try {
        const { user_email } = req.body.details;
        let otp;
        if ((await Schemas['Users'].find({ user_email })).length === 1) {
            res.status(404).json({
                success: false,
                message: `${user_email} is already exists`,
            });
        } else {
            let checkIfOtpAlreadyExist = await OTP.find({ user_email });
            if (checkIfOtpAlreadyExist.length !== 0) {
                otp = checkIfOtpAlreadyExist[0].otp;
            } else {
                otp = otpGenerator.generate(6, {
                    upperCaseAlphabets: false,
                    lowerCaseAlphabets: false,
                    specialChars: false,
                });
                let result = await OTP.findOne({ otp: otp });
                while (result) {
                    otp = otpGenerator.generate(6, {
                        upperCaseAlphabets: false,
                    });
                    result = await OTP.findOne({ otp: otp });
                }
                const otpPayload = { user_email, otp };
                const otpBody = await OTP.create(otpPayload);
            }
            res.status(200).json({
                success: true,
                message: 'OTP sent successfully',
                otp,
            });
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, error: error.message });
    }
};
