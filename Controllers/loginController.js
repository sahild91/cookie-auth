const crypto = require('crypto');
const bcrypt = require('bcrypt');
const Schemas = require('../MongoDB/Schema');
const OTP = require('../Utils/OtpSchema');

exports.login = async (req, res) => {
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
        // Check if all details are provided
        if (!user_email || !user_pwd) {
            return res.status(403).json({
                success: false,
                message: 'All fields are required',
            });
        }
        // Find the most recent OTP for the email
        const validatePassword = await Schemas['Users'].find({
            user_email,
        });
        if (bcrypt.compareSync(user_pwd, validatePassword[0].user_pwd)) {
            req.session.LoggedIn = true;
            return res.status(201).json({
                success: true,
                message: 'User successfully LoggedIn ',
                details: {
                    user_name: validatePassword[0].user_name,
                    user_email: validatePassword[0].user_email,
                    user_lvl: validatePassword[0].user_lvl,
                    user_id: validatePassword[0]._id,
                    user_moblie_no: validatePassword[0].user_moblie_no,
                },
            });
        } else {
            return res.status(404).json({
                success: false,
                message: 'Incorrect Password',
            });
        }
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};
