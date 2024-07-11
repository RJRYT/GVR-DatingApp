const User = require("../models").user;
const jwt = require('jsonwebtoken');
const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const fs = require("fs");

exports.test = (req, res) => {
  res.json({"message": "hello world from users"});
};

// Middleware to protect routes
exports.authMiddleware = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token)
    return res.status(401).json({ msg: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

exports.CheckUser = async(req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Configure multer for file uploads
const profilePicStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(
      null,
      path.join(__dirname, "../uploads/profilePics")
    );
  },
  filename: function (req, file, cb) {
    const userId = req.user.id;
    const randomString = crypto.randomBytes(6).toString("hex");
    const currentDate = new Date().toISOString().replace(/:/g, "-"); // Format date to avoid issues with colons
    const uniqueName = `profilepic_${userId}_${randomString}_${currentDate}${path.extname(
      file.originalname
    )}`;
    cb(null, uniqueName);
  },
});

const reelStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads/shortReels"));
  },
  filename: function (req, file, cb) {
    const userId = req.user.id;
    const randomString = crypto.randomBytes(6).toString("hex");
    const currentDate = new Date().toISOString().replace(/:/g, "-"); // Format date to avoid issues with colons
    const uniqueName = `reel_${userId}_${randomString}_${currentDate}${path.extname(
      file.originalname
    )}`;
    cb(null, uniqueName);
  },
});

exports.uploadProfilePics = multer({ storage: profilePicStorage });

exports.uploadReel = multer({ storage: reelStorage });

exports.saveUploadedPics = async(req, res) =>{
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.files.forEach((file) => {
      user.profilePic.push({ url: file.path });
    });

    await user.save();
    res
      .status(200)
      .json({
        message: "Profile pictures uploaded successfully",
        profilePics: user.profilePics,
      });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.saveUploadedReel = async(req, res) =>{
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.shortReel = { url: req.file.path };
    await user.save();
    res
      .status(200)
      .json({
        message: "Short reel uploaded successfully",
        shortReel: user.shortReel,
      });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.serveProfilePic = async(req, res) => {
  const filePath = path.join(
    __dirname,
    "../uploads/profilePics",
    req.params.filename
  );
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).json({ message: "File not found" });
    }
    res.sendFile(filePath);
  });
};

exports.serveShortReel = async(req, res) => {
  const filePath = path.join(
    __dirname,
    "../uploads/shortReels",
    req.params.filename
  );
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).json({ message: "File not found" });
    }
    res.sendFile(filePath);
  });
};

exports.updateUserPersonalDetails = async(req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    } else if (user.profileSectionOneDone){
      return res.status(404).json({ message: "Personal details already added" });
    }
    
    user.age = req.body.age;
    user.dob = req.body.dob;
    user.hobbies = req.body.hobbies;
    user.interests = req.body.interests;
    user.smokingHabits = req.body.smokingHabits;
    user.drinkingHabits = req.body.drinkingHabits;
    user.qualification = req.body.qualification;
    user.personalInfoSubmitted = true;

    await user.save();

    res.json({message: "Updated successfully",user});
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

exports.updateUserProfessinalDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    } else if (user.profileSectionOneDone) {
      return res
        .status(404)
        .json({ message: "Professional details already added" });
    }

    user.profession = req.body.profession;
    user.company = req.body.company;
    user.experience = req.body.experience;
    user.professionalInfoSubmitted = true;

    await user.save();

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

exports.updateUserPurposeDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    } else if (user.purposeSubmitted) {
      return res
        .status(404)
        .json({ message: "purpose already added" });
    }

    user.purpose = req.body.purpose;
    user.purposeSubmitted = true;

    await user.save();

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};