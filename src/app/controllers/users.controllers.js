const User = require("../models").user;
const jwt = require("jsonwebtoken");
const multer = require("multer");
const multerS3 = require("multer-s3");
const path = require("path");
const crypto = require("crypto");
const s3Config = require("./../config/aws.config");
const { DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { generateAccessToken } = require("../config/token.config");

exports.test = (req, res) => {
  res.json({ message: "hello world from users" });
};

// Middleware to protect routes
exports.authMiddleware = (req, res, next) => {
  const token = req.header("x-auth-token") || req.cookies.accessToken;
  if (!token)
    return res.status(401).json({ message: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

exports.RefreshToken = async (req, res) => {
  const refreshToken = req.body.refreshToken || req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(403).json({ message: "Refresh token not found" });
  }

  jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_TOKEN_SECRET,
    (err, user) => {
      if (err) return res.sendStatus(403);

      const accessToken = generateAccessToken({ id: user.id });
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });

      res.json({ accessToken });
    }
  );
};

exports.CheckUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server Error" });
  }
};

exports.uploadProfilePics = multer({
  storage: multerS3({
    s3: s3Config,
    bucket: process.env.S3_BUCKET,
    acl: "public-read",
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname, originalname: file.originalname });
    },
    key: function (req, file, cb) {
      const userId = req.user.id;
      const randomString = crypto.randomBytes(6).toString("hex");
      const currentDate = new Date().toISOString().replace(/:/g, "-"); // Format date to avoid issues with colons
      const uniqueName = `profilepics/${userId}_${randomString}_${currentDate}${path.extname(
        file.originalname
      )}`;
      cb(null, uniqueName);
    },
  }),
});

exports.uploadReel = multer({
  storage: multerS3({
    s3: s3Config,
    bucket: process.env.S3_BUCKET,
    acl: "public-read",
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname, originalname: file.originalname });
    },
    key: function (req, file, cb) {
      const userId = req.user.id;
      const randomString = crypto.randomBytes(6).toString("hex");
      const currentDate = new Date().toISOString().replace(/:/g, "-"); // Format date to avoid issues with colons
      const uniqueName = `shortreels/${userId}_${randomString}_${currentDate}${path.extname(
        file.originalname
      )}`;
      cb(null, uniqueName);
    },
  }),
});

exports.saveUploadedPics = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.personalInfoSubmitted) {
      return res
        .status(400)
        .json({ message: "Personal section already completed." });
    }

    if (user.profilePic.length > 0) {
      for (const pic of user.profilePic) {
        const params = { Bucket: process.env.S3_BUCKET, Key: pic.key };
        await s3Config.send(new DeleteObjectCommand(params));
      }
    }

    user.profilePic = req.files.map((file) => ({
      url: file.location,
      key: file.key,
    }));

    await user.save();
    res.status(200).json({
      message: "Profile pictures uploaded successfully",
      profilePics: user.profilePics,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.saveUploadedReel = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.personalInfoSubmitted) {
      return res
        .status(400)
        .json({ message: "Personal section already completed." });
    }

    if (user.shortReel) {
      const params = {
        Bucket: process.env.S3_BUCKET,
        Key: user.shortReel.key,
      };
      await s3Config.send(new DeleteObjectCommand(params));
    }

    user.shortReel = { url: req.file.location, key: req.file.key };
    await user.save();
    res.status(200).json({
      message: "Short reel uploaded successfully",
      shortReel: user.shortReel,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.updateUserPersonalDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    } else if (user.personalInfoSubmitted) {
      return res
        .status(404)
        .json({ message: "Personal details already added" });
    }

    user.age = req.body.age;
    user.dateOfBirth = req.body.dateOfBirth;
    user.gender = req.body.gender; 
    user.hobbies = req.body.hobbies;
    user.location = req.body.location;
    user.interests = req.body.interests;
    user.smokingHabits = req.body.smokingHabits;
    user.drinkingHabits = req.body.drinkingHabits;
    user.qualification = req.body.qualification;
    user.personalInfoSubmitted = true;

    await user.save();

    res.json({ message: "Updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server Error" });
  }
};

exports.updateUserProfessinalDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    } else if (user.professionalInfoSubmitted) {
      return res
        .status(404)
        .json({ message: "Professional details already added" });
    }

    const formData = req.body;
    if (
      formData.professionType === "employee" ||
      formData.professionType === "employer"
    ) {
      user.companyName = formData.companyName;
      user.designation = formData.designation;
      user.jobLocation = formData.jobLocation;
      user.professionalInfoSubmitted = true;
      user.professionType = formData.professionType;
    } else if (formData.professionType === "jobseeker") {
      user.expertiseLevel = formData.expertiseLevel;
      user.professionalInfoSubmitted = true;
      user.professionType = formData.professionType;
    }

    await user.save();

    res.json({ message: "Updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server Error" });
  }
};

exports.updateUserPurposeDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    } else if (user.purposeSubmitted) {
      return res.status(404).json({ message: "purpose already added" });
    }

    user.purpose = req.body.purpose;
    user.purposeSubmitted = true;

    await user.save();

    res.json({ message: "Updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server Error" });
  }
};

exports.CheckRegistrationStatus = async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  } else {
    res.json({
      personalInfoSubmitted: user.personalInfoSubmitted,
      professionalInfoSubmitted: user.professionalInfoSubmitted,
      purposeSubmitted: user.purposeSubmitted,
    });
  }
};

exports.fetchUserDetails = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(
      userId,
      "username age dateOfBirth gender location hobbies interests smokingHabits drinkingHabits qualification profilePic shortReel"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user profile", error);
    res.status(500).json({ message: "Server error" });
  }
};