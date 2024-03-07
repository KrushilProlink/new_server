const express = require("express");
const User = require("../model/schema/user");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const jwt_decode = require("jwt-decode");
const { validSignup, validSignin } = require("../model/validation/user");
const mobile_otp = require("../helper/notification");
dotenv.config();

const router = express.Router();

router.post("/signup", async (req, res) => {
    const { error } = validSignup.validate(req.body);

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
        const phoneNumber = await User.findOne({ phoneNumber: req.body.phoneNumber });
        if (phoneNumber) {
            return res.status(400).json({ error: "Phone Number already exists" });
        }

        const email = await User.findOne({ email: req.body.email });
        if (email) {
            return res.status(400).json({ error: "Email already exists" });
        }

        const newUser = await new User(req.body);
        await newUser.save();
        jwt.sign(
            { phoneNumber: newUser.phoneNumber },
            process.env.SECRET_KEY,
            {
                expiresIn: 31556926, // 1 year in seconds
            },
            (err, token) => {
                res.send({
                    token: token,
                    data: newUser
                });
            }
        );
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.toString() });
    }
});


router.post("/otp-verify", async (req, res) => {

    let user = await User.findOne({ phoneNumber: req.body.phoneNumber });
    if (!user) return res.status(400).json({ message: 'User not found.' });
    if (user.otp !== req.body.otp) return res.status(400).json({ message: 'invalid otp.' });

    jwt.sign(
        { phoneNumber: user.phoneNumber },
        process.env.SECRET_KEY,
        {
            expiresIn: 31556926, // 1 year in seconds
        },
        (err, token) => {
            res.send({
                token: token,
                data: user,
                message: "Login successfully"
            });
        }
    );
    const mobile_no = user.phoneNumber;
    const data = { mobile_no: mobile_no, body: ` User Login successfully` }
    await mobile_otp.sendBySms(data);

    user.otp = "";
    user = await user.save();

});

router.post("/resend-otp", async (req, res) => {

    let user = await User.findOne({ phoneNumber: req.body.phoneNumber });
    if (!user) return res.status(400).json({ message: 'User not found.' });

    let otp = await mobile_otp.generateOtp();

    user.otp = otp;

    user = await user.save();

    const mobile_no = user.phoneNumber;
    const data = { mobile_no: mobile_no, body: `your login OTP is ${otp}` }
    await mobile_otp.sendBySms(data);

    res.status(200).json({
        message: "OTP created successfully...",
        data: otp
    });

});

router.post("/login", async (req, res) => {
    const { error } = validSignin.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
        let user = await User.findOne({ phoneNumber: req.body.phoneNumber });

        if (!user) return res.status(401).json({ message: "User not found" });

        let otp = await mobile_otp.generateOtp();

        user.otp = otp;

        user = await user.save();

        const mobile_no = user.phoneNumber;
        const data = { mobile_no: mobile_no, body: `your login OTP is ${otp}` }
        await mobile_otp.sendBySms(data);

        res.status(200).json({
            message: "OTP created successfully...",
            data: otp
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.toString() });
    }
});


module.exports = router;
