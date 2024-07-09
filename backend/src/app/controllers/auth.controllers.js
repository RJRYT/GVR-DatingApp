const passport = require("passport");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const twilio = require("twilio");
const client = new twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const User = require("../models").user;

exports.test = (req, res) => {
  res.json({ message: "hello world from auth" });
};

exports.doLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: 3600,
    });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({message:"Server error"});
  }
};

exports.doRegister = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    user = new User({ username, email, password });
    await user.save();
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: 3600,
    });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({message:"Server error"});
  }
};

exports.GoogleLogin = passport.authenticate("google", {
  scope: ["profile", "email"],
});

exports.PassportVerify = passport.authenticate("google", {
  failureRedirect: process.env.FRONTEND_URL+"/home?error=GoogleOAuthFailed",
});

exports.GoogleCallBack = (req, res) => {
  const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, {
    expiresIn: 3600,
  });
  res.redirect(`${process.env.FRONTEND_URL}/home?token=${token}`);
};

exports.SendCode = async(req, res) => {
  const { phoneNumber } = req.body;

  let user = await User.findOne({ phoneNumber });

  if (!user) {
    user = new User({ phoneNumber });
  }

  await user.save();

  try {
    await client.verify.v2
      .services(process.env.TWILIO_SERVICE_SID)
      .verifications.create({ to: `+91${phoneNumber}`, channel: "sms" })
      .then((verification) => {
        console.log(verification.sid);
        res.status(200).send({ message: "OTP sent successfully" });
      });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Failed to send OTP" });
  }
};

exports.VerifyCode = async(req, res) => {
  const { phoneNumber, otp } = req.body;

  const user = await User.findOne({ phoneNumber });

  if (user) {
    client.verify.v2
      .services(process.env.TWILIO_SERVICE_SID)
      .verificationChecks.create({ to: `+91${phoneNumber}`, code: otp })
      .then((verification_check) => {
        console.log(verification_check);
        if (verification_check.status) {
          const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: 3600,
          });
          res.status(200).send({ token });
        }
      });
  } else {
    res.status(400).send({ message: "Invalid OTP" });
  }
};