const crypto = require('crypto');
const bcrypt = require('bcrypt');
const Schemas = require('../MongoDB/Schema');
const OTP = require('../Utils/OtpSchema');

exports.signup = async (req, res) => {
    // console.log(crypto.constants.RSA_PKCS1_OAEP_PADDING);
    try {
        const { user_email, password, otp } = req.body.details;
        let encryptedText = Buffer.from(password, 'hex');
        let decipher = crypto.createDecipheriv(
            'aes-256-cbc',
            Buffer.from(process.env.AES_KEY, 'hex'),
            Buffer.from(process.env.AES_IV, 'hex')
        );
        let decryptedData = decipher.update(encryptedText);
        decryptedData = Buffer.concat([decryptedData, decipher.final()]);
        const user_pwd = decryptedData.toString();
        console.log(user_pwd, 'password');
        // Check if all details are provided
        if (!user_email || !otp || !user_pwd) {
            return res.status(403).json({
                success: false,
                message: 'All fields are required',
            });
        }
        // Find the most recent OTP for the email
        const response = await OTP.find({ user_email })
            .sort({ createdAt: -1 })
            .limit(1);
        if (response.length === 0 || otp !== response[0].otp) {
            return res.status(400).json({
                success: false,
                message: 'The OTP is not valid',
            });
        } else {
            const request = req.body.details;
            try {
                const userDataToSave = {
                    user_name: request.user_name,
                    user_pwd: bcrypt.hashSync(
                        decryptedData.toString(),
                        bcrypt.genSaltSync(8),
                        null
                    ),
                    // user_lvl: request.user_lvl,
                    user_email: request.user_email,
                    user_mobile_no: request.user_mobile_no,
                };
                try {
                    const data = new Schemas['Users'](userDataToSave);
                    const dataToSave = await data.save();
                    res.status(200).json({ success: true, Message: data });
                    //res.redirect('/login')
                } catch (error) {
                    console.log(error);
                    res.status(400).json({
                        success: false,
                        Message: error.message,
                    });
                }
            } catch (e) {
                console.log(e);
                res.status(400).json({ message: e });
            }
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, error: error.message });
    }
};
