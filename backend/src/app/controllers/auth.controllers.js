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
  res.json({ message: "hi" });
};

exports.doLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: 3600,
    });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

exports.doRegister = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    user = new User({ username, email, password });
    await user.save();
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: 3600,
    });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
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

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  let user = await User.findOne({ phoneNumber });

  if (user) {
    user.otp = otp;
    user.verified = false;
  } else {
    user = new User({ phoneNumber, otp, verified: false });
  }

  await user.save();

  try {
    await client.messages.create({
      body: `Your OTP code is ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });

    res.status(200).send({ message: "OTP sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Failed to send OTP" });
  }
};

exports.VerifyCode = async(req, res) => {
  const { phoneNumber, otp } = req.body;

  const user = await User.findOne({ phoneNumber });

  if (user && user.otp === otp) {
    user.verified = true;
    await user.save();

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: 3600,
    });
    res.status(200).send({ token });
  } else {
    res.status(400).send({ message: "Invalid OTP" });
  }
};