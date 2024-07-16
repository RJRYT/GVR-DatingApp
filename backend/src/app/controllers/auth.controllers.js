const passport = require("passport");
const bcrypt = require("bcryptjs");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../config/token.config");

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
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const AccessToken = generateAccessToken({ id: user.id });
    const RefreshToken = generateRefreshToken({ id: user.id });

    res.cookie("accessToken", AccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    res.cookie("refreshToken", RefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    res.json({ AccessToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.doLogout = async (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.json({ message: "Logout successful" });
};

exports.doRegister = async (req, res) => {
  const { username, email, password, phoneNumber } = req.body;
  try {
    let user = await User.findOne({
      $or: [{ email }, { phoneNumber }],
    });
    if (user) return res.status(400).json({ message: "User already exists" });

    user = new User({ username, email, password, phoneNumber });
    await user.save();
    const AccessToken = generateAccessToken({ id: user.id });
    const RefreshToken = generateRefreshToken({ id: user.id });

    res.cookie("accessToken", AccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    res.cookie("refreshToken", RefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    res.json({ AccessToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.GoogleLogin = passport.authenticate("google", {
  scope: ["profile", "email"],
});

exports.PassportVerify = passport.authenticate("google", {
  failureRedirect: process.env.FRONTEND_URL + "/home?error=GoogleOAuthFailed",
});

exports.GoogleCallBack = (req, res) => {
  const AccessToken = generateAccessToken({ id: req.user.id });
  const RefreshToken = generateRefreshToken({ id: req.user.id });

  res.cookie("accessToken", AccessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  res.cookie("refreshToken", RefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
  res.redirect(`${process.env.FRONTEND_URL}/home?token=${AccessToken}`);
};

exports.SendCode = async (req, res) => {
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

exports.VerifyCode = async (req, res) => {
  const { phoneNumber, otp } = req.body;

  const user = await User.findOne({ phoneNumber });

  if (user) {
    client.verify.v2
      .services(process.env.TWILIO_SERVICE_SID)
      .verificationChecks.create({ to: `+91${phoneNumber}`, code: otp })
      .then(async (verification_check) => {
        if (verification_check.status) {
          const AccessToken = generateAccessToken({ id: user.id });
          const RefreshToken = generateRefreshToken({ id: user.id });

          res.cookie("accessToken", AccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
          });

          res.cookie("refreshToken", RefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
          });
          user.numberVerified = true;
          await user.save();
          res.status(200).send({ AccessToken });
        }
      });
  } else {
    res.status(400).send({ message: "Invalid OTP" });
  }
};
